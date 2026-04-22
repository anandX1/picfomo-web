import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const PIXAZO_SCHNELL_URL = "https://gateway.pixazo.ai/flux-1-schnell/v1/getData";
const PIXAZO_FIRERED_URL = "https://gateway.pixazo.ai/firered-image-edit-v1-1/v1/firered-image-edit-v1-1-request";
const GROQ_API_URL       = "https://api.groq.com/openai/v1/chat/completions";

// ─────────────────────────────────────────────────────────────────────────────
// FIRERED 1.1 — MENTAL MODEL (do not change image order without reading this)
// ─────────────────────────────────────────────────────────────────────────────
//
// FireRed is a VIRTUAL TRY-ON model, not a face-swap model.
// It was trained to: take outfit/bg from a reference → apply to a base person.
//
// ALWAYS:
//   image_urls[0] = USER PHOTO    → Figure 1 — the canvas, the identity anchor
//   image_urls[1] = STYLE IMAGE   → Figure 2 — pure reference: outfit + bg
//
// PROMPT RULES:
//   - 3 sentences max. Short = better.
//   - Name WHAT changes (outfit, background)
//   - Name WHAT stays (face, beard, glasses — be specific)
//   - Never say "redraw", "recreate", "generate" — those lose identity
//
// PARAMS:
//   guidance_scale = 3.5  →  face preserved strongly, outfit transfers softly
//   num_inference_steps = 35  →  slightly more = cleaner blending
//
// ─────────────────────────────────────────────────────────────────────────────


// ── 1. R2 UPLOAD ─────────────────────────────────────────────────────────────
async function uploadBase64ToR2(base64Str: string, env: any): Promise<string> {
  // Already an HTTPS URL (style images from DB) — pass through unchanged
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
  const binary   = atob(base64Data);
  const bytes    = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

  const key = `uploads/picfomo_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  await S3.send(new PutObjectCommand({ Bucket: bucketName, Key: key, ContentType: mimeType, Body: bytes }));
  return `${publicUrl}/${key}`;
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
              "Respond ONLY with a raw JSON object — no markdown, no backticks, no explanation. " +
              'Keys: "title" (3-5 words), "description" (1-2 sentences), "tags" (5 comma-separated tags).',
          },
          { role: "user", content: `SEO metadata for: "${prompt.slice(0, 400)}"` },
        ],
      }),
    });

    if (!res.ok) throw new Error(`Groq ${res.status}`);
    const data    = (await res.json()) as any;
    let   content = data?.choices?.[0]?.message?.content ?? "";
    content = content
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
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

    if (data.status === "COMPLETED" && data.output?.media_url?.[0]) {
      return data.output.media_url[0];
    }
    if (data.status === "FAILED" || data.status === "ERROR") {
      if ((data.error ?? "").toLowerCase().match(/nsfw|safety/)) throw new Error("NSFW_VIOLATION");
      throw new Error(`Pixazo failed: ${data.error || "unknown"}`);
    }
  }
  throw new Error("Generation timed out. Please try again.");
}


// ── 4. PROMPT BUILDERS ────────────────────────────────────────────────────────
//
// KEY LESSON from testing:
//   The face drifted when guidance_scale was 4.5.
//   Fix: guidance_scale back to 3.5 + more explicit face-lock in the prompt.
//   Being specific ("beard", "glasses") locks those features better than
//   generic words like "identity" or "features".
//

// PREMIUM STYLE MODE
// Fig 1 = user photo (canvas — never changes)
// Fig 2 = style image (outfit + bg reference)
function buildStylePrompt(styleDescription?: string, userExtra?: string): string {
  let p =
    "Dress the person in Figure 1 in the exact outfit and clothing shown in Figure 2, " +
    "and change the background to match Figure 2. " +
    "Do not change the face, eyes, nose, beard, glasses, hair, or skin tone of the person in Figure 1 — " +
    "only the clothing and background should change.";

  if (styleDescription?.trim()) p += ` Style context: ${styleDescription.trim()}.`;
  if (userExtra?.trim())        p += ` ${userExtra.trim()}`;
  return p;
}

// CUSTOM BACKGROUND MODE
// Fig 1 = user photo (canvas — keep the whole person)
// Fig 2 = scene / environment reference (only bg extracted)
function buildCustomBgPrompt(userExtra?: string): string {
  let p =
    "Replace only the background behind the person in Figure 1 with the environment from Figure 2. " +
    "Keep the person in Figure 1 — their face, clothing, pose, and all features — completely unchanged. " +
    "Adjust the lighting on the person to match the environment in Figure 2 naturally.";

  if (userExtra?.trim()) p += ` ${userExtra.trim()}`;
  return p;
}

// SWAP / COLLAB MODE
// Fig 1 = user photo (identity anchor)
// Fig 2 = target look (outfit + bg reference)
function buildSwapPrompt(userExtra?: string): string {
  let p =
    "Dress the person in Figure 1 in the exact outfit worn in Figure 2, " +
    "and change the background to match Figure 2. " +
    "Do not change the face, eyes, nose, beard, glasses, hair, or skin tone of the person in Figure 1 — " +
    "only the clothing and background should change.";

  if (userExtra?.trim()) p += ` ${userExtra.trim()}`;
  return p;
}

// Universal negative prompt
// Blocks: identity drift, second-person hallucination, clothing retention
const NEGATIVE_PROMPT =
  "changed face, different person, wrong identity, altered nose, altered eyes, " +
  "altered beard, removed glasses, different skin tone, " +
  "two people, multiple people, second person visible, extra person in background, " +
  "keeping original clothing, same outfit as input";


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

    if (!GROQ_KEY) console.error("🚨 GROQ_API_KEY missing from environment");


    // ── BUILD PAYLOAD ────────────────────────────────────────────────────────
    let sparkCost    = 2;
    let finalPrompt  = prompt as string;
    let apiImageUrls: string[] = [];

    // All FireRed modes use the same params — face lock needs guidance LOW
    const FIRERED_STEPS    = 35;   // slightly more steps = cleaner result
    const FIRERED_GUIDANCE = 3.5;  // LOW = identity preserved, style applied softly
                                   // (4.5 caused face drift in previous test)

    if (model !== "schnell") {
      if (!sourceImage) throw new Error("Source face image is required.");

      // Convert user's base64 photo to a public HTTPS URL Pixazo can fetch
      const userFaceUrl = await uploadBase64ToR2(sourceImage, envCtx);

      if (model === "swap") {
        // ── SWAP / COLLAB ────────────────────────────────────────────────────
        if (!targetImage) throw new Error("Target image required for swap.");
        const targetUrl = await uploadBase64ToR2(targetImage, envCtx);

        apiImageUrls = [userFaceUrl, targetUrl]; // [Fig1=user, Fig2=target]
        finalPrompt  = buildSwapPrompt(prompt);

      } else if (styleId === "custom") {
        // ── CUSTOM BACKGROUND ────────────────────────────────────────────────
        sparkCost = 15;
        if (!customBgImage) throw new Error("Custom background image required.");
        const customBgUrl = await uploadBase64ToR2(customBgImage, envCtx);

        apiImageUrls = [userFaceUrl, customBgUrl]; // [Fig1=user, Fig2=scene]
        finalPrompt  = buildCustomBgPrompt(prompt);

      } else {
        // ── PREMIUM STYLE ────────────────────────────────────────────────────
        const styleRecord = await db
          .prepare("SELECT spark_cost, description, preview_image_url FROM styles WHERE id = ?")
          .bind(styleId)
          .first();
        if (!styleRecord) throw new Error("Style not found.");

        sparkCost = styleRecord.spark_cost as number;
        const styleImageUrl = styleRecord.preview_image_url as string; // Already HTTPS — no upload

        apiImageUrls = [userFaceUrl, styleImageUrl]; // [Fig1=user, Fig2=style]
        finalPrompt  = buildStylePrompt(
          styleRecord.description as string | undefined,
          prompt
        );
      }
    }


    // ── BILLING ──────────────────────────────────────────────────────────────
    const wallet  = await db
      .prepare("SELECT sparks_balance FROM users WHERE id = ?")
      .bind(userId)
      .first();
    const balance = (wallet?.sparks_balance as number) || 0;

    if (balance < sparkCost) {
      return NextResponse.json({ error: "Insufficient Sparks." }, { status: 402 });
    }

    const txId     = `tx_${Date.now()}_gen_${Math.random().toString(36).slice(2)}`;
    const txReason = styleId === "custom" ? "Custom Background Generation" : "Generated Portrait";

    await db.batch([
      db.prepare("UPDATE users SET sparks_balance = sparks_balance - ? WHERE id = ?")
        .bind(sparkCost, userId),
      db.prepare("INSERT INTO spark_transactions (id, user_id, amount, reason) VALUES (?, ?, ?, ?)")
        .bind(txId, userId, -sparkCost, txReason),
    ]);


    // ── GENERATION ───────────────────────────────────────────────────────────
    try {
      let outputImageUrl = "";
      let seoData        = { title: "", description: "", tags: "" };

      if (model === "schnell") {
        // ── FLUX SCHNELL (text-to-image, no face) ───────────────────────────
        const [pixazoRes, groqRes] = await Promise.all([
          fetch(PIXAZO_SCHNELL_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Ocp-Apim-Subscription-Key": PIXAZO_KEY,
            },
            body: JSON.stringify({
              prompt:    finalPrompt,
              num_steps: 4,
              height:    1024,
              width:     1024,
            }),
          }),
          generateSEOData(finalPrompt, GROQ_KEY ?? ""),
        ]);

        const pData = (await pixazoRes.json()) as any;
        if (!pixazoRes.ok) throw new Error(pData.error || "Schnell API failed");
        outputImageUrl = pData.output;
        seoData        = groqRes;

      } else {
        // ── FIRERED 1.1 (outfit transfer + bg change) ────────────────────────
        if (apiImageUrls.length < 2) throw new Error("Missing images for generation.");

        const [pixazoStartRes, groqRes] = await Promise.all([
          fetch(PIXAZO_FIRERED_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Ocp-Apim-Subscription-Key": PIXAZO_KEY,
            },
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

        const startData = (await pixazoStartRes.json()) as any;
        if (!pixazoStartRes.ok || !startData.polling_url) {
          throw new Error(startData.error || "FireRed queue failed — no polling URL returned");
        }

        outputImageUrl = await pollPixazoStatus(startData.polling_url, PIXAZO_KEY);
        seoData        = groqRes;
      }


      // ── SAVE TO DB ────────────────────────────────────────────────────────
      const postId = `post_${Date.now()}`;
      await db
        .prepare(
          "INSERT INTO posts (id, user_id, image_url, prompt_used, style_id, title, description, tags, is_public) " +
          "VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)"
        )
        .bind(
          postId,
          userId,
          outputImageUrl,
          finalPrompt,
          styleId || "schnell",
          seoData.title,
          seoData.description,
          seoData.tags
        )
        .run();

      return NextResponse.json({ output: outputImageUrl, post_id: postId }, { status: 200 });

    } catch (aiError: any) {
      // Refund sparks on any AI failure
      const refundId = `tx_${Date.now()}_refund_${Math.random().toString(36).slice(2)}`;
      await db.batch([
        db.prepare("UPDATE users SET sparks_balance = sparks_balance + ? WHERE id = ?")
          .bind(sparkCost, userId),
        db.prepare("INSERT INTO spark_transactions (id, user_id, amount, reason) VALUES (?, ?, ?, ?)")
          .bind(refundId, userId, sparkCost, "Refund: Generation Failed"),
      ]);

      console.error("AI Pipeline Error (refunded):", aiError);

      if (aiError.message === "NSFW_VIOLATION") {
        return NextResponse.json(
          { error: "Image rejected: violates safety guidelines. Sparks refunded." },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: aiError.message || "Generation failed. Sparks refunded." },
        { status: 500 }
      );
    }

  } catch (serverError: any) {
    console.error("Server Error:", serverError);
    return NextResponse.json(
      { error: serverError.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}