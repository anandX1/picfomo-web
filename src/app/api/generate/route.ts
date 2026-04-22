import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const PIXAZO_SCHNELL_URL  = "https://gateway.pixazo.ai/flux-1-schnell/v1/getData";
const PIXAZO_FIRERED_URL  = "https://gateway.pixazo.ai/firered-image-edit-v1-1/v1/firered-image-edit-v1-1-request";
const GROQ_API_URL        = "https://api.groq.com/openai/v1/chat/completions";

// ─────────────────────────────────────────────────────────────────────────────
// HOW FIRERED 1.1 WORKS (read this before touching prompts)
// ─────────────────────────────────────────────────────────────────────────────
// FireRed treats Figure 1 as the CANVAS — it edits from there.
// Figure 2 is the REFERENCE — elements to pull from.
//
// CORRECT ORDER for PicFOMO "style transfer":
//   image_urls[0] = STYLE IMAGE  → Figure 1 (canvas / scene to keep)
//   image_urls[1] = USER FACE    → Figure 2 (identity to transplant in)
//
// CORRECT PROMPT PATTERN:
//   "Replace the face of the person in Figure 1 with the face of the
//    person in Figure 2. Keep the clothing, background, pose, and
//    lighting of Figure 1 completely unchanged."
//
// SHORT + SURGICAL prompts always beat long verbose ones.
// Never say "Redraw" — that triggers full regeneration and loses identity.
// ─────────────────────────────────────────────────────────────────────────────

// ── 1. R2 UPLOAD (base64 → public HTTPS URL) ─────────────────────────────────
async function uploadBase64ToR2(base64Str: string, env: any): Promise<string> {
  // Already a URL (e.g. style image from DB) — pass through unchanged
  if (!base64Str.startsWith("data:image")) return base64Str;

  const accountId  = env.R2_ACCOUNT_ID        || process.env.R2_ACCOUNT_ID;
  const accessKey  = env.R2_ACCESS_KEY_ID      || process.env.R2_ACCESS_KEY_ID;
  const secretKey  = env.R2_SECRET_ACCESS_KEY  || process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = env.R2_BUCKET_NAME        || process.env.R2_BUCKET_NAME;
  const publicUrl  = env.NEXT_PUBLIC_R2_URL    || process.env.NEXT_PUBLIC_R2_URL;

  const S3 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: accessKey!, secretAccessKey: secretKey! },
  });

  const [header, base64Data] = base64Str.split(",");
  const mimeType = header.match(/data:([^;]+);base64/)?.[1] || "image/jpeg";
  const ext      = mimeType.split("/")[1] || "jpg";

  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);

  const key = `uploads/picfomo_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  await S3.send(new PutObjectCommand({ Bucket: bucketName, Key: key, ContentType: mimeType, Body: bytes }));
  return `${publicUrl}/${key}`;
}

// ── 2. GROQ SEO ───────────────────────────────────────────────────────────────
async function generateSEOData(prompt: string, apiKey: string) {
  const fallback = {
    title: "PicFOMO Synthesis",
    description: "A stunning creation synthesized in the PicFOMO Studio.",
    tags: "ai, art, picfomo, portrait, synthesis",
  };

  if (!apiKey || apiKey === "undefined") return fallback;

  try {
    const safePrompt = (prompt?.trim() || "AI portrait generation").slice(0, 500);

    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        max_tokens: 300,
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              `You are an SEO expert for an AI image gallery called PicFOMO. ` +
              `Respond ONLY with a raw JSON object — no markdown, no backticks, no explanation. ` +
              `Keys: "title" (catchy 3-5 words), "description" (1-2 sentences), "tags" (5 comma-separated tags).`,
          },
          { role: "user", content: `Generate SEO metadata for: "${safePrompt}"` },
        ],
      }),
    });

    if (!res.ok) throw new Error(`Groq HTTP ${res.status}`);
    const data = (await res.json()) as any;
    let content = data?.choices?.[0]?.message?.content ?? "";
    content = content.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
    const parsed = JSON.parse(content);
    if (!parsed.title || !parsed.description || !parsed.tags) throw new Error("Bad shape");
    return parsed;
  } catch {
    return fallback;
  }
}

// ── 3. PIXAZO POLL ────────────────────────────────────────────────────────────
async function pollPixazoStatus(pollingUrl: string, apiKey: string): Promise<string> {
  for (let attempt = 0; attempt < 24; attempt++) {
    await new Promise((r) => setTimeout(r, 5000));
    const res  = await fetch(pollingUrl, { headers: { "Ocp-Apim-Subscription-Key": apiKey } });
    const data = (await res.json()) as any;

    if (data.status === "COMPLETED" && data.output?.media_url?.[0]) return data.output.media_url[0];
    if (data.status === "FAILED" || data.status === "ERROR") {
      const msg = data.error?.toLowerCase() ?? "";
      if (msg.includes("nsfw") || msg.includes("safety")) throw new Error("NSFW_VIOLATION");
      throw new Error(`Pixazo failed: ${data.error || "Unknown"}`);
    }
  }
  throw new Error("Generation timed out. Please try again.");
}

// ── 4. FIRERED PROMPT BUILDER ─────────────────────────────────────────────────
// Keep prompts SHORT — 2-3 sentences max.
// FireRed's Qwen encoder reads both images + text together.
// Over-explained prompts create conflicting signals.

function buildStylePrompt(styleDescription?: string, userExtra?: string): string {
  // Figure 1 = style image (canvas)
  // Figure 2 = user face (identity reference)
  let p =
    "Replace the face of the person in Figure 1 with the face of the person in Figure 2. " +
    "Keep the clothing, outfit, background, pose, and lighting of Figure 1 completely unchanged. " +
    "Match the skin tone of Figure 2 naturally to the lighting in Figure 1.";

  if (styleDescription) p += ` Style context: ${styleDescription}.`;
  if (userExtra?.trim()) p += ` ${userExtra.trim()}`;
  return p;
}

function buildCustomBgPrompt(userExtra?: string): string {
  // Figure 1 = user face (canvas — keep the person)
  // Figure 2 = custom background/scene
  let p =
    "Replace the background behind the person in Figure 1 with the environment and scene from Figure 2. " +
    "Keep the person in Figure 1 — their face, clothing, and pose — completely unchanged. " +
    "Adjust the lighting on the person to match Figure 2 naturally.";

  if (userExtra?.trim()) p += ` ${userExtra.trim()}`;
  return p;
}

function buildSwapPrompt(userExtra?: string): string {
  // Figure 1 = style/target scene (canvas)
  // Figure 2 = user face (identity reference)
  let p =
    "Replace the face of the person in Figure 1 with the face of the person in Figure 2. " +
    "Keep the clothing, background, pose, and scene of Figure 1 exactly as it is. " +
    "Blend the skin tone of Figure 2 seamlessly with the lighting of Figure 1.";

  if (userExtra?.trim()) p += ` ${userExtra.trim()}`;
  return p;
}

const NEGATIVE_PROMPT =
  "wrong face, different person, changed identity, distorted features, " +
  "mismatched lighting, plastic skin, airbrushed, oversmoothed, blurry face, artifacts";

// ── 5. MAIN ROUTE ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await req.json()) as any;
    const { prompt, model, styleId, sourceImage, customBgImage, targetImage } = body;

    const envCtx    = ((await getCloudflareContext({ async: true })).env as any);
    const db        = envCtx.DB as any;
    const PIXAZO_KEY = envCtx.PIXAZO_API_KEY  || process.env.PIXAZO_API_KEY;
    const GROQ_KEY   = (envCtx.GROQ_API_KEY as string | undefined) ?? process.env.GROQ_API_KEY;

    // ── BUILD PAYLOAD ────────────────────────────────────────────────────────
    let sparkCost   = 2;
    let finalPrompt = prompt as string;
    let apiImageUrls: string[] = [];

    if (model !== "schnell") {
      // Upload user face to R2 (base64 → HTTPS URL that Pixazo can fetch)
      if (!sourceImage) throw new Error("Source face image is required.");
      const userFaceUrl = await uploadBase64ToR2(sourceImage, envCtx);

      if (model === "swap") {
        // ── SWAP / COLLAB MODE ───────────────────────────────────────────────
        // Fig 1 = style/target scene | Fig 2 = user face
        if (!targetImage) throw new Error("Target image required for swap.");
        const targetUrl = await uploadBase64ToR2(targetImage, envCtx);

        apiImageUrls = [targetUrl, userFaceUrl];       // [Fig1=scene, Fig2=face]
        finalPrompt  = buildSwapPrompt(prompt);

      } else if (styleId === "custom") {
        // ── CUSTOM BACKGROUND MODE ───────────────────────────────────────────
        // Fig 1 = user face (keep the person) | Fig 2 = custom background scene
        sparkCost = 15;
        if (!customBgImage) throw new Error("Custom background image required.");
        const customBgUrl = await uploadBase64ToR2(customBgImage, envCtx);

        apiImageUrls = [userFaceUrl, customBgUrl];     // [Fig1=user, Fig2=scene]
        finalPrompt  = buildCustomBgPrompt(prompt);

      } else {
        // ── PREMIUM STYLE MODE ───────────────────────────────────────────────
        // Fig 1 = style image (canvas — clothing/bg to keep)
        // Fig 2 = user face (identity to transplant in)
        const styleRecord = await db
          .prepare("SELECT spark_cost, description, preview_image_url FROM styles WHERE id = ?")
          .bind(styleId)
          .first();
        if (!styleRecord) throw new Error("Style not found.");

        sparkCost = styleRecord.spark_cost as number;

        // Style image is already an HTTPS URL from DB — no upload needed
        const styleImageUrl = styleRecord.preview_image_url as string;

        apiImageUrls = [styleImageUrl, userFaceUrl];   // [Fig1=style, Fig2=face]
        finalPrompt  = buildStylePrompt(
          styleRecord.description as string | undefined,
          prompt
        );
      }
    }

    // ── BILLING ──────────────────────────────────────────────────────────────
    const userWallet     = await db.prepare("SELECT sparks_balance FROM users WHERE id = ?").bind(userId).first();
    const currentBalance = (userWallet?.sparks_balance as number) || 0;
    if (currentBalance < sparkCost) return NextResponse.json({ error: "Insufficient Sparks." }, { status: 402 });

    const txId     = `tx_${Date.now()}_gen_${Math.random().toString(36).slice(2)}`;
    const txReason = styleId === "custom" ? "Custom Background Generation" : "Generated Portrait";

    await db.batch([
      db.prepare("UPDATE users SET sparks_balance = sparks_balance - ? WHERE id = ?").bind(sparkCost, userId),
      db.prepare("INSERT INTO spark_transactions (id, user_id, amount, reason) VALUES (?, ?, ?, ?)").bind(txId, userId, -sparkCost, txReason),
    ]);

    // ── GENERATION ───────────────────────────────────────────────────────────
    try {
      let outputImageUrl = "";
      let seoData        = { title: "", description: "", tags: "" };

      if (model === "schnell") {
        const [pixazoRes, groqRes] = await Promise.all([
          fetch(PIXAZO_SCHNELL_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Ocp-Apim-Subscription-Key": PIXAZO_KEY },
            body: JSON.stringify({ prompt: finalPrompt, num_steps: 4, height: 1024, width: 1024 }),
          }),
          generateSEOData(finalPrompt, GROQ_KEY ?? ""),
        ]);

        const pixazoData = (await pixazoRes.json()) as any;
        if (!pixazoRes.ok) throw new Error(pixazoData.error || "Schnell API failed");
        outputImageUrl = pixazoData.output;
        seoData        = groqRes;

      } else {
        if (apiImageUrls.length < 2) throw new Error("Missing images for compositing.");

        const [pixazoStartRes, groqRes] = await Promise.all([
          fetch(PIXAZO_FIRERED_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Ocp-Apim-Subscription-Key": PIXAZO_KEY },
            body: JSON.stringify({
              prompt:              finalPrompt,
              negative_prompt:     NEGATIVE_PROMPT,
              image_urls:          apiImageUrls,
              num_inference_steps: 30,
              guidance_scale:      3.5,
            }),
          }),
          generateSEOData(finalPrompt, GROQ_KEY ?? ""),
        ]);

        const startData = (await pixazoStartRes.json()) as any;
        if (!pixazoStartRes.ok || !startData.polling_url) throw new Error(startData.error || "FireRed queue failed");

        outputImageUrl = await pollPixazoStatus(startData.polling_url, PIXAZO_KEY);
        seoData        = groqRes;
      }

      // ── SAVE ──────────────────────────────────────────────────────────────
      const postId = `post_${Date.now()}`;
      await db
        .prepare(
          `INSERT INTO posts (id, user_id, image_url, prompt_used, style_id, title, description, tags, is_public)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`
        )
        .bind(postId, userId, outputImageUrl, finalPrompt, styleId || "schnell", seoData.title, seoData.description, seoData.tags)
        .run();

      return NextResponse.json({ output: outputImageUrl, post_id: postId }, { status: 200 });

    } catch (aiError: any) {
      // Refund on AI failure
      const refundId = `tx_${Date.now()}_refund_${Math.random().toString(36).slice(2)}`;
      await db.batch([
        db.prepare("UPDATE users SET sparks_balance = sparks_balance + ? WHERE id = ?").bind(sparkCost, userId),
        db.prepare("INSERT INTO spark_transactions (id, user_id, amount, reason) VALUES (?, ?, ?, ?)").bind(refundId, userId, sparkCost, "Refund: Generation Failed"),
      ]);

      if (aiError.message === "NSFW_VIOLATION") {
        return NextResponse.json({ error: "Image rejected: violates safety guidelines. Sparks refunded." }, { status: 400 });
      }
      return NextResponse.json({ error: aiError.message || "Generation failed. Sparks refunded." }, { status: 500 });
    }

  } catch (serverError: any) {
    return NextResponse.json({ error: serverError.message || "Internal Server Error" }, { status: 500 });
  }
}