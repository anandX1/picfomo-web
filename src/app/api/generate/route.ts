import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const PIXAZO_SCHNELL_URL = "https://gateway.pixazo.ai/flux-1-schnell/v1/getData";
const PIXAZO_FIRERED_URL = "https://gateway.pixazo.ai/firered-image-edit-v1-1/v1/firered-image-edit-v1-1-request";
const GROQ_API_URL       = "https://api.groq.com/openai/v1/chat/completions";

// ─────────────────────────────────────────────────────────────────────────────
// FIRERED 1.1 — WHAT ACTUALLY WORKS (learned from real benchmark tests)
// ─────────────────────────────────────────────────────────────────────────────
//
// KEY FINDING from Wiro lab test (real before/after):
//   guidance_scale = 1.5  → outfit changed, face preserved ✓
//   guidance_scale = 3.5+ → identity lock wins, nothing changes ✗
//
// WHY: FireRed has a differentiable consistency loss baked into training.
//   At high CFG, the consistency loss fights the prompt → stalemate.
//   At low CFG (1.5), the trained editing pathways activate naturally
//   and make targeted changes without triggering the preservation fight.
//
// PROMPT VERB MATTERS:
//   "Change the outfit to..."   → signals REPLACEMENT ✓
//   "Dress the person in..."    → signals ADDITION on top ✗
//   "Dress using Figure 2..."   → ambiguous ✗
//
// IMAGE ORDER (never changes):
//   image_urls[0] = USER PHOTO   → Figure 1 (canvas, identity)
//   image_urls[1] = STYLE IMAGE  → Figure 2 (outfit + bg reference)
//
// PROMPT STRUCTURE (from official templates + working community examples):
//   "Change the outfit in Figure 1 to match the clothing in Figure 2.
//    Change the background to match Figure 2.
//    Keep the face, glasses, skin tone, and hair in Figure 1 unchanged."
//
// PARAMS:
//   guidance_scale:      1.5   ← proven working value (Wiro benchmark)
//   num_inference_steps: 30    ← official default
//
// ─────────────────────────────────────────────────────────────────────────────


// ── 1. R2 UPLOAD ─────────────────────────────────────────────────────────────
async function uploadBase64ToR2(base64Str: string, env: any): Promise<string> {
  if (!base64Str.startsWith("data:image")) return base64Str; // already a URL

  const S3 = new S3Client({
    region: "auto",
    endpoint: `https://${env.R2_ACCOUNT_ID || process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId:     env.R2_ACCESS_KEY_ID     || process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY!,
    },
  });

  const [header, base64Data] = base64Str.split(",");
  const mimeType = header.match(/data:([^;]+);base64/)?.[1] || "image/jpeg";
  const ext      = mimeType.split("/")[1] || "jpg";
  const binary   = atob(base64Data);
  const bytes    = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

  const key = `uploads/picfomo_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  await S3.send(new PutObjectCommand({
    Bucket:      env.R2_BUCKET_NAME     || process.env.R2_BUCKET_NAME,
    Key:         key,
    ContentType: mimeType,
    Body:        bytes,
  }));
  return `${env.NEXT_PUBLIC_R2_URL || process.env.NEXT_PUBLIC_R2_URL}/${key}`;
}


// ── 2. GROQ SEO ───────────────────────────────────────────────────────────────
async function generateSEOData(prompt: string, apiKey: string) {
  const fallback = {
    title: "PicFOMO Portrait",
    description: "A stunning AI-styled portrait created on PicFOMO.",
    tags: "ai, portrait, picfomo, style, fashion",
  };
  if (!apiKey || apiKey === "undefined") return fallback;

  try {
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
              "You are an SEO expert for an AI image gallery called PicFOMO. " +
              "Respond ONLY with a raw JSON object — no markdown, no backticks. " +
              'Keys: "title" (3-5 words), "description" (1-2 sentences), "tags" (5 comma-separated tags).',
          },
          { role: "user", content: `SEO metadata for: "${prompt.slice(0, 400)}"` },
        ],
      }),
    });
    if (!res.ok) throw new Error(`Groq ${res.status}`);
    const data    = (await res.json()) as any;
    let   content = data?.choices?.[0]?.message?.content ?? "";
    content = content.trim()
      .replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
    const parsed = JSON.parse(content);
    if (!parsed.title || !parsed.description || !parsed.tags) throw new Error("bad shape");
    return parsed;
  } catch {
    return fallback;
  }
}


// ── 3. PIXAZO POLL ────────────────────────────────────────────────────────────
async function pollPixazoStatus(pollingUrl: string, apiKey: string): Promise<string> {
  for (let i = 0; i < 24; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const res  = await fetch(pollingUrl, { headers: { "Ocp-Apim-Subscription-Key": apiKey } });
    const data = (await res.json()) as any;
    if (data.status === "COMPLETED" && data.output?.media_url?.[0]) return data.output.media_url[0];
    if (data.status === "FAILED" || data.status === "ERROR") {
      if ((data.error ?? "").toLowerCase().match(/nsfw|safety/)) throw new Error("NSFW_VIOLATION");
      throw new Error(`Pixazo failed: ${data.error || "unknown"}`);
    }
  }
  throw new Error("Generation timed out. Please try again.");
}


// ── 4. PROMPT BUILDERS ────────────────────────────────────────────────────────
//
// Rule: use "Change" not "Dress". "Change" = replace. "Dress" = add on top.
// Rule: always explicitly list what to keep (face, glasses, skin, hair).
// Rule: keep it short — 2-3 sentences max. Long prompts lose specificity.
//

// PREMIUM STYLE MODE
// Figure 1 = user photo | Figure 2 = style card image
function buildStylePrompt(styleDesc?: string, userExtra?: string): string {
  let p =
    "Change the outfit in Figure 1 to match the clothing worn in Figure 2. " +
    "Change the background to match Figure 2. " +
    "Keep the face, eyes, nose, beard, glasses, hair, and skin tone from Figure 1 completely unchanged.";

  if (styleDesc?.trim()) p += ` Style: ${styleDesc.trim()}.`;
  if (userExtra?.trim()) p += ` ${userExtra.trim()}`;
  return p;
}

// CUSTOM BACKGROUND MODE
// Figure 1 = user photo | Figure 2 = scene image (bg reference only)
function buildCustomBgPrompt(userExtra?: string): string {
  let p =
    "Change the background in Figure 1 to the environment shown in Figure 2. " +
    "Keep the person in Figure 1 — their face, clothing, pose, and all features — completely unchanged. " +
    "Adjust the lighting on the person naturally to fit the new background.";

  if (userExtra?.trim()) p += ` ${userExtra.trim()}`;
  return p;
}

// SWAP / COLLAB MODE
// Figure 1 = user photo | Figure 2 = target look
function buildSwapPrompt(userExtra?: string): string {
  let p =
    "Change the outfit in Figure 1 to match the clothing worn in Figure 2. " +
    "Change the background to match Figure 2. " +
    "Keep the face, eyes, nose, beard, glasses, hair, and skin tone from Figure 1 completely unchanged.";

  if (userExtra?.trim()) p += ` ${userExtra.trim()}`;
  return p;
}

// Negative prompt: block identity drift + extra-person hallucination
const NEGATIVE_PROMPT =
  "changed face, different person, wrong identity, altered nose, altered eyes, " +
  "altered beard, removed glasses, changed skin tone, " +
  "two people, multiple people, second person in background, extra person";


// ── 5. MAIN ROUTE ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await req.json()) as any;
    const { prompt, model, styleId, sourceImage, customBgImage, targetImage } = body;

    const envCtx     = ((await getCloudflareContext({ async: true })).env as any);
    const db         = envCtx.DB as any;
    const PIXAZO_KEY = envCtx.PIXAZO_API_KEY  || process.env.PIXAZO_API_KEY;
    const GROQ_KEY   = (envCtx.GROQ_API_KEY as string | undefined) ?? process.env.GROQ_API_KEY;

    if (!GROQ_KEY) console.error("🚨 GROQ_API_KEY missing");

    // ── BUILD PAYLOAD ────────────────────────────────────────────────────────
    let sparkCost    = 2;
    let finalPrompt  = prompt as string;
    let apiImageUrls: string[] = [];

    // THE critical params — guidance 1.5 proven to unlock outfit change
    // while face preservation stays intact (Wiro benchmark, March 2026)
    const FIRERED_GUIDANCE = 1.5;
    const FIRERED_STEPS    = 30;

    if (model !== "schnell") {
      if (!sourceImage) throw new Error("Source face image is required.");
      const userFaceUrl = await uploadBase64ToR2(sourceImage, envCtx);

      if (model === "swap") {
        if (!targetImage) throw new Error("Target image required for swap.");
        const targetUrl  = await uploadBase64ToR2(targetImage, envCtx);
        apiImageUrls     = [userFaceUrl, targetUrl];
        finalPrompt      = buildSwapPrompt(prompt);

      } else if (styleId === "custom") {
        sparkCost = 15;
        if (!customBgImage) throw new Error("Custom background image required.");
        const bgUrl  = await uploadBase64ToR2(customBgImage, envCtx);
        apiImageUrls = [userFaceUrl, bgUrl];
        finalPrompt  = buildCustomBgPrompt(prompt);

      } else {
        const styleRecord = await db
          .prepare("SELECT spark_cost, description, preview_image_url FROM styles WHERE id = ?")
          .bind(styleId)
          .first();
        if (!styleRecord) throw new Error("Style not found.");

        sparkCost    = styleRecord.spark_cost as number;
        apiImageUrls = [userFaceUrl, styleRecord.preview_image_url as string];
        finalPrompt  = buildStylePrompt(
          styleRecord.description as string | undefined,
          prompt
        );
      }
    }

    // ── BILLING ──────────────────────────────────────────────────────────────
    const wallet  = await db.prepare("SELECT sparks_balance FROM users WHERE id = ?").bind(userId).first();
    const balance = (wallet?.sparks_balance as number) || 0;
    if (balance < sparkCost) return NextResponse.json({ error: "Insufficient Sparks." }, { status: 402 });

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
        const pData = (await pixazoRes.json()) as any;
        if (!pixazoRes.ok) throw new Error(pData.error || "Schnell API failed");
        outputImageUrl = pData.output;
        seoData        = groqRes;

      } else {
        if (apiImageUrls.length < 2) throw new Error("Missing images for generation.");

        const [startRes, groqRes] = await Promise.all([
          fetch(PIXAZO_FIRERED_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Ocp-Apim-Subscription-Key": PIXAZO_KEY },
            body: JSON.stringify({
              prompt:              finalPrompt,
              negative_prompt:     NEGATIVE_PROMPT,
              image_urls:          apiImageUrls,
              num_inference_steps: FIRERED_STEPS,
              guidance_scale:      FIRERED_GUIDANCE,
            }),
          }),
          generateSEOData(finalPrompt, GROQ_KEY ?? ""),
        ]);

        const startData = (await startRes.json()) as any;
        if (!startRes.ok || !startData.polling_url) throw new Error(startData.error || "FireRed queue failed");
        outputImageUrl = await pollPixazoStatus(startData.polling_url, PIXAZO_KEY);
        seoData        = groqRes;
      }

      // ── SAVE ──────────────────────────────────────────────────────────────
      const postId = `post_${Date.now()}`;
      await db
        .prepare(
          "INSERT INTO posts (id, user_id, image_url, prompt_used, style_id, title, description, tags, is_public) " +
          "VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)"
        )
        .bind(postId, userId, outputImageUrl, finalPrompt, styleId || "schnell",
              seoData.title, seoData.description, seoData.tags)
        .run();

      return NextResponse.json({ output: outputImageUrl, post_id: postId }, { status: 200 });

    } catch (aiError: any) {
      const refundId = `tx_${Date.now()}_refund_${Math.random().toString(36).slice(2)}`;
      await db.batch([
        db.prepare("UPDATE users SET sparks_balance = sparks_balance + ? WHERE id = ?").bind(sparkCost, userId),
        db.prepare("INSERT INTO spark_transactions (id, user_id, amount, reason) VALUES (?, ?, ?, ?)").bind(refundId, userId, sparkCost, "Refund: Generation Failed"),
      ]);
      if (aiError.message === "NSFW_VIOLATION")
        return NextResponse.json({ error: "Image rejected: violates safety guidelines. Sparks refunded." }, { status: 400 });
      return NextResponse.json({ error: aiError.message || "Generation failed. Sparks refunded." }, { status: 500 });
    }

  } catch (serverError: any) {
    console.error("Server Error:", serverError);
    return NextResponse.json({ error: serverError.message || "Internal Server Error" }, { status: 500 });
  }
}