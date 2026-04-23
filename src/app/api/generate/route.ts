// app/api/generate/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// ────────────────────────────────────────────────────────────────
// 🔥 FIRERED 1.1 – PROVEN PARAMETERS (Wiro benchmark, March 2026)
// ────────────────────────────────────────────────────────────────
const PIXAZO_FIRERED_URL =
  "https://gateway.pixazo.ai/firered-image-edit-v1-1/v1/firered-image-edit-v1-1-request";

// guidance_scale = 1.5  → outfit changes, face locked ✓
const GUIDANCE_SCALE = 1.5;
// num_inference_steps = 30  → official default, good detail/speed
const INFERENCE_STEPS = 30;

// Negative prompt – blocks identity drift & ghost people
const NEGATIVE_PROMPT =
  "changed face, different person, wrong identity, altered nose, altered eyes, " +
  "altered beard, removed glasses, changed skin tone, " +
  "two people, multiple people, extra person, " +
  "blurry face, distorted face, mutated hands";

// ────────────────────────────────────────────────────────────────
// HELPER: Base64 → R2 public URL
// ────────────────────────────────────────────────────────────────
async function uploadBase64ToR2(base64Str: string, env: any): Promise<string> {
  if (!base64Str.startsWith("data:image")) return base64Str; // already a URL

  const S3 = new S3Client({
    region: "auto",
    endpoint: `https://${env.R2_ACCOUNT_ID || process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY!,
    },
  });

  const [header, base64Data] = base64Str.split(",");
  const mimeType = header.match(/data:([^;]+);base64/)?.[1] || "image/jpeg";
  const ext = mimeType.split("/")[1] || "jpg";
  const binary = atob(base64Data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

  const key = `uploads/picfomo_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  await S3.send(
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME || process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: mimeType,
      Body: bytes,
    })
  );
  return `${env.NEXT_PUBLIC_R2_URL || process.env.NEXT_PUBLIC_R2_URL}/${key}`;
}

// ────────────────────────────────────────────────────────────────
// HELPER: Poll FireRed until COMPLETED or FAILED
// ────────────────────────────────────────────────────────────────
async function pollPixazoStatus(pollingUrl: string, apiKey: string): Promise<string> {
  for (let i = 0; i < 24; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const res = await fetch(pollingUrl, {
      headers: { "Ocp-Apim-Subscription-Key": apiKey },
    });
    const data = (await res.json()) as any;

    if (data.status === "COMPLETED" && data.output?.media_url?.[0]) {
      return data.output.media_url[0];
    }
    if (data.status === "FAILED" || data.status === "ERROR") {
      throw new Error(`Pixazo failed: ${data.error || "unknown"}`);
    }
  }
  throw new Error("Generation timed out. Please try again.");
}

// ────────────────────────────────────────────────────────────────
// THE ONE AND ONLY PROMPT (hand‑crafted for FireRed v1.1)
// ────────────────────────────────────────────────────────────────
const STYLE_TRANSFER_PROMPT =
  "Change the outfit in Image 1 to exactly match the outfit in Image 2. " +
  "Change the background to match Image 2. " +
  "Keep the face, glasses, jewelry, and all personal accessories of Image 1 completely unchanged. " +
  "Preserve Image 1's exact identity, skin tone, hair, and facial expression.";

// ────────────────────────────────────────────────────────────────
// MAIN POST HANDLER – REPLACE USER ONLY
// ────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    // 1. Auth
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 2. Parse exactly two images
    const { sourceImage, targetImage } = (await req.json()) as {
      sourceImage: string; // user face (base64)
      targetImage: string; // reference person (base64)
    };

    if (!sourceImage || !targetImage) {
      return NextResponse.json(
        { error: "Both sourceImage and targetImage (base64) are required." },
        { status: 400 }
      );
    }

    // 3. Environment
    const envCtx = ((await getCloudflareContext({ async: true })).env as any);
    const db = envCtx.DB as any; // D1Database (for billing + saving)
    const PIXAZO_KEY = envCtx.PIXAZO_API_KEY || process.env.PIXAZO_API_KEY;
    const GROQ_KEY = (envCtx.GROQ_API_KEY as string | undefined) ?? process.env.GROQ_API_KEY;

    // 4. Upload both images to R2 (no base64 ever hits Pixazo)
    const [userFaceUrl, targetUrl] = await Promise.all([
      uploadBase64ToR2(sourceImage, envCtx),
      uploadBase64ToR2(targetImage, envCtx),
    ]);

    // 5. Billing (fixed cost for this specific action – e.g. 10 sparks)
    const SPARK_COST = 10;
    const wallet = await db
      .prepare("SELECT sparks_balance FROM users WHERE id = ?")
      .bind(userId)
      .first();
    const balance = (wallet?.sparks_balance as number) || 0;

    if (balance < SPARK_COST) {
      return NextResponse.json({ error: "Insufficient Sparks." }, { status: 402 });
    }

    // Deduct sparks
    const txId = `tx_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    await db.batch([
      db.prepare("UPDATE users SET sparks_balance = sparks_balance - ? WHERE id = ?")
        .bind(SPARK_COST, userId),
      db.prepare("INSERT INTO spark_transactions (id, user_id, amount, reason) VALUES (?, ?, ?, ?)")
        .bind(txId, userId, -SPARK_COST, "Style Transfer"),
    ]);

    try {
      // 6. FireRed payload – two images, low CFG, negative prompt, fixed prompt
      const payload = {
        prompt: STYLE_TRANSFER_PROMPT,
        negative_prompt: NEGATIVE_PROMPT,
        image_urls: [userFaceUrl, targetUrl],  // Image 1 = user, Image 2 = reference
        num_inference_steps: INFERENCE_STEPS,
        guidance_scale: GUIDANCE_SCALE,
      };

      const startRes = await fetch(PIXAZO_FIRERED_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": PIXAZO_KEY,
        },
        body: JSON.stringify(payload),
      });

      const startData = (await startRes.json()) as any;
      if (!startRes.ok || !startData.polling_url) {
        throw new Error(startData.error || startData.message || "FireRed queue failed");
      }

      // 7. Poll for result
      const outputImageUrl = await pollPixazoStatus(startData.polling_url, PIXAZO_KEY);

      // 8. SEO (optional – run after generation to save a few ms; use fallback if Groq missing)
      let title = "Style Transfer Portrait";
      let description = "A hyper‑realistic portrait created on PicFOMO by transferring the style of a reference image.";
      let tags = "ai, portrait, style, transfer, fashion";

      if (GROQ_KEY && GROQ_KEY !== "undefined") {
        try {
          const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { Authorization: `Bearer ${GROQ_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "llama-3.1-8b-instant",
              max_tokens: 300,
              temperature: 0.3,
              messages: [
                { role: "system", content: "You are an SEO expert for an AI image gallery called PicFOMO. Respond ONLY with a raw JSON object — no markdown, no backticks. Keys: 'title' (3-5 words), 'description' (1-2 sentences), 'tags' (5 comma-separated tags)." },
                { role: "user", content: `SEO metadata for a style transfer portrait.` },
              ],
            }),
          });
          const data = (await groqRes.json()) as any;
          const content = data?.choices?.[0]?.message?.content ?? "";
          const cleaned = content.trim().replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
          const parsed = JSON.parse(cleaned);
          if (parsed.title && parsed.description && parsed.tags) {
            title = parsed.title;
            description = parsed.description;
            tags = parsed.tags;
          }
        } catch {
          // keep defaults
        }
      }

      // 9. Save to posts (private by default)
      const postId = `post_${Date.now()}`;
      await db
        .prepare(
          "INSERT INTO posts (id, user_id, image_url, prompt_used, style_id, title, description, tags, is_public) " +
          "VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)"
        )
        .bind(postId, userId, outputImageUrl, STYLE_TRANSFER_PROMPT, "style_transfer", title, description, tags)
        .run();

      return NextResponse.json({ output: outputImageUrl, post_id: postId }, { status: 200 });

    } catch (aiError: any) {
      // Refund on generation failure
      const refundId = `tx_${Date.now()}_refund_${Math.random().toString(36).slice(2)}`;
      await db.batch([
        db.prepare("UPDATE users SET sparks_balance = sparks_balance + ? WHERE id = ?")
          .bind(SPARK_COST, userId),
        db.prepare("INSERT INTO spark_transactions (id, user_id, amount, reason) VALUES (?, ?, ?, ?)")
          .bind(refundId, userId, SPARK_COST, `Refund: ${aiError.message || "Generation failed"}`),
      ]);
      return NextResponse.json(
        { error: aiError.message || "Generation failed. Sparks refunded." },
        { status: 500 }
      );
    }

  } catch (serverError: any) {
    console.error("[PicFOMO] Server Error:", serverError);
    return NextResponse.json({ error: serverError.message || "Internal Server Error" }, { status: 500 });
  }
}