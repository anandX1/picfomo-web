import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// 🌟 BULLETPROOF URL CONSTANTS
const PIXAZO_SCHNELL_URL = "https://gateway.pixazo.ai/flux-1-schnell/v1/getData";
const PIXAZO_FIRERED_URL = "https://gateway.pixazo.ai/firered-image-edit-v1-1/v1/firered-image-edit-v1-1-request";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// 🔥 FIRERED 1.1 – PROVEN PARAMETERS (From Official Gateway Test)
const GUIDANCE_SCALE = 4.5; // 🌟 LOW CFG = FACE LOCKED!
const INFERENCE_STEPS = 30;
const NEGATIVE_PROMPT = "changed face, different person, wrong identity, altered nose, altered eyes, altered beard, removed glasses, changed skin tone, two people, multiple people, extra person, blurry face, distorted face, mutated hands, plastic skin, airbrushed";

// 🌟 THE SOTA PROMPT FROM YOUR SUCCESSFUL TEST
const SOTA_STYLE_TRANSFER_PROMPT = "Take the person from Image 1 and apply the full style of Image 2. Replace background, clothing, costume, and lighting with Image 2's details. Preserve the identity, face, and natural features of Image 1 without distortion. Final output must look like the person was originally photographed in Image 2's setting and outfit.";

// === 1. BASE64 TO R2 INTERCEPTOR ===
async function uploadBase64ToR2(base64Str: string, env: any): Promise<string> {
  if (!base64Str.startsWith("data:image")) return base64Str;

  const accountId = env.R2_ACCOUNT_ID || process.env.R2_ACCOUNT_ID;
  const accessKey = env.R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID;
  const secretKey = env.R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = env.R2_BUCKET_NAME || process.env.R2_BUCKET_NAME;
  const publicUrl = env.NEXT_PUBLIC_R2_URL || process.env.NEXT_PUBLIC_R2_URL;

  const S3 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: accessKey!, secretAccessKey: secretKey! },
  });

  const [header, base64Data] = base64Str.split(",");
  const mimeMatch = header.match(/data:([^;]+);base64/);
  const mimeType = mimeMatch?.[1] || "image/jpeg";
  const ext = mimeType.split("/")[1] || "jpg";

  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const key = `uploads/picfomo_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;

  await S3.send(new PutObjectCommand({ Bucket: bucketName, Key: key, ContentType: mimeType, Body: bytes }));
  return `${publicUrl}/${key}`;
}

// === 2. GROQ SEO HELPER ===
async function generateSEOData(prompt: string, apiKey: string) {
  if (!apiKey || apiKey === "undefined") {
    return { title: "PicFOMO Synthesis", description: "A stunning creation synthesized in the PicFOMO Studio.", tags: "ai, art, picfomo, portrait, synthesis" };
  }

  try {
    const safePrompt = prompt?.trim() ? prompt.trim().slice(0, 500) : "A highly detailed, aesthetic AI image generation.";

    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        max_tokens: 300,
        messages: [
          { role: "system", content: `You are an SEO expert for an AI image gallery called PicFOMO. Respond ONLY with a raw JSON object. Keys: "title" (3-5 words), "description" (1-2 sentences), "tags" (5 comma-separated tags).` },
          { role: "user", content: `Generate SEO metadata for this image prompt: "${safePrompt}"` }
        ],
        temperature: 0.3,
      })
    });
    
    if (!res.ok) throw new Error(`Groq HTTP ${res.status}`);

    const data = (await res.json()) as any;
    let content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty Groq response");

    content = content.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
    return JSON.parse(content);

  } catch (error) {
    return { title: "PicFOMO Synthesis", description: "A stunning creation synthesized in the PicFOMO Studio.", tags: "ai, art, picfomo, synthesis" };
  }
}

// === 3. PIXAZO FIRE-RED POLLING HELPER ===
async function pollPixazoStatus(pollingUrl: string, apiKey: string) {
  let attempts = 0;
  const maxAttempts = 24; 

  while (attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 5000)); 
    
    const res = await fetch(pollingUrl, { headers: { "Ocp-Apim-Subscription-Key": apiKey } });
    const data = (await res.json()) as any;

    if (data.status === "COMPLETED" && data.output?.media_url?.[0]) return data.output.media_url[0];
    
    if (data.status === "FAILED" || data.status === "ERROR") {
      if (data.error?.toLowerCase().includes("nsfw") || data.error?.toLowerCase().includes("safety")) {
         throw new Error("NSFW_VIOLATION");
      }
      throw new Error(`Pixazo Generation Failed: ${data.error || "Unknown Error"}`);
    }
    attempts++;
  }
  throw new Error("Generation timed out. The model is currently overloaded. Please try again.");
}

// === 4. THE MAIN API ROUTE ===
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await req.json()) as any;
    const { prompt, model, styleId, sourceImage, customBgImage, targetImage } = body;

    const envCtx = ((await getCloudflareContext({ async: true })).env as any);
    const db = envCtx.DB as any;
    
    const PIXAZO_KEY = envCtx.PIXAZO_API_KEY || process.env.PIXAZO_API_KEY;
    const GROQ_KEY = (envCtx.GROQ_API_KEY as string | undefined) ?? process.env.GROQ_API_KEY;

    let sparkCost = 2; 
    let finalPrompt = prompt;
    let apiImageUrls: string[] = [];

    // --- A. GET PRICING, LOGIC, & PROMPTS ---
    if (model !== "schnell") {
      let secureSourceFace = sourceImage;
      if (sourceImage) secureSourceFace = await uploadBase64ToR2(sourceImage, envCtx);

      if (model === "swap") {
        if (!targetImage || !secureSourceFace) throw new Error("Target and source images required for swap.");
        let secureTarget = await uploadBase64ToR2(targetImage, envCtx);
        
        apiImageUrls = [secureSourceFace, secureTarget]; // Image 1 = user, Image 2 = reference
        finalPrompt = SOTA_STYLE_TRANSFER_PROMPT;
      } 
      else if (styleId === "custom") {
         sparkCost = 15; 
         if (!customBgImage || !secureSourceFace) throw new Error("Face and custom background image required.");
         
         let secureCustomBg = await uploadBase64ToR2(customBgImage, envCtx);
         
         apiImageUrls = [secureSourceFace, secureCustomBg]; // Image 1 = user, Image 2 = custom background
         finalPrompt = SOTA_STYLE_TRANSFER_PROMPT;
         if (prompt) finalPrompt += ` Additional details: ${prompt}`;
      } 
      else {
         const styleRecord = await db.prepare("SELECT spark_cost, description, preview_image_url FROM styles WHERE id = ?").bind(styleId).first();
         if (!styleRecord) throw new Error("Style not found or inactive.");
         
         sparkCost = styleRecord.spark_cost as number;
         if (!secureSourceFace) throw new Error("Source face image required.");
         
         // 🌟 Using your successful UI configuration: Image 1 = User Face, Image 2 = Style
         apiImageUrls = [secureSourceFace, styleRecord.preview_image_url as string];
         
         finalPrompt = SOTA_STYLE_TRANSFER_PROMPT;
         if (prompt) finalPrompt += ` Additional details: ${prompt}`;
      }
    }

    // --- B. SECURE BILLING ---
    const userWallet = await db.prepare("SELECT sparks_balance FROM users WHERE id = ?").bind(userId).first();
    const currentBalance = (userWallet?.sparks_balance as number) || 0;

    if (currentBalance < sparkCost) {
      return NextResponse.json({ error: "Insufficient Sparks." }, { status: 402 });
    }

    const txId = `tx_${Date.now()}_gen_${Math.random().toString(36).substring(7)}`;
    const txReason = styleId === 'custom' ? 'Custom Background Generation' : 'Generated Portrait';
    
    await db.batch([
      db.prepare("UPDATE users SET sparks_balance = sparks_balance - ? WHERE id = ?").bind(sparkCost, userId),
      db.prepare("INSERT INTO spark_transactions (id, user_id, amount, reason) VALUES (?, ?, ?, ?)").bind(txId, userId, -sparkCost, txReason)
    ]);

    try {
      // --- C. AI GENERATION & SEO ---
      let outputImageUrl = "";
      let seoData = { title: "", description: "", tags: "" };

      if (model === "schnell") {
        const [pixazoRes, groqRes] = await Promise.all([
          fetch(PIXAZO_SCHNELL_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Ocp-Apim-Subscription-Key": PIXAZO_KEY },
            body: JSON.stringify({ prompt: finalPrompt, num_steps: 4, height: 1024, width: 1024 })
          }),
          generateSEOData(finalPrompt, GROQ_KEY ?? "") 
        ]);

        const pixazoData = (await pixazoRes.json()) as any;
        if (!pixazoRes.ok) throw new Error(pixazoData.error || "Schnell API Failed");
        
        outputImageUrl = pixazoData.output;
        seoData = groqRes;

      } else {
        // 🌟 FIRE-RED COMPOSITING USING YOUR PROVEN SOTA PROMPT
        if (!apiImageUrls || apiImageUrls.length < 2) throw new Error("Missing required images for compositing.");

        const [pixazoStartRes, groqRes] = await Promise.all([
          fetch(PIXAZO_FIRERED_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Ocp-Apim-Subscription-Key": PIXAZO_KEY },
            body: JSON.stringify({
              prompt: finalPrompt,
              negative_prompt: NEGATIVE_PROMPT, 
              image_urls: apiImageUrls, 
              num_inference_steps: INFERENCE_STEPS,
              guidance_scale: GUIDANCE_SCALE // 🌟 LOCKED TO 1.5 CFG
            })
          }),
          generateSEOData(finalPrompt, GROQ_KEY ?? "") 
        ]);

        const startData = (await pixazoStartRes.json()) as any;
        if (!pixazoStartRes.ok || !startData.polling_url) throw new Error(startData.error || "FireRed queue failed");

        outputImageUrl = await pollPixazoStatus(startData.polling_url, PIXAZO_KEY);
        seoData = groqRes;
      }

      // --- D. SAVE TO DATABASE ---
      const postId = `post_${Date.now()}`;
      await db.prepare(`
        INSERT INTO posts (id, user_id, image_url, prompt_used, style_id, title, description, tags, is_public)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0) 
      `).bind(
        postId, userId, outputImageUrl, finalPrompt, styleId || "schnell", seoData.title, seoData.description, seoData.tags
      ).run();

      return NextResponse.json({ output: outputImageUrl, post_id: postId }, { status: 200 });

    } catch (aiError: any) {
      const refundTxId = `tx_${Date.now()}_refund_${Math.random().toString(36).substring(7)}`;
      await db.batch([
        db.prepare("UPDATE users SET sparks_balance = sparks_balance + ? WHERE id = ?").bind(sparkCost, userId),
        db.prepare("INSERT INTO spark_transactions (id, user_id, amount, reason) VALUES (?, ?, ?, ?)").bind(refundTxId, userId, sparkCost, 'Refund: Generation Failed')
      ]);
      
      console.error("AI Pipeline Error:", aiError);
      if (aiError.message === "NSFW_VIOLATION") return NextResponse.json({ error: "Upload rejected: Violates safety guidelines." }, { status: 400 });
      return NextResponse.json({ error: aiError.message || "Generation failed." }, { status: 500 });
    }

  } catch (serverError: any) {
    console.error("Server API Error:", serverError);
    return NextResponse.json({ error: serverError.message || "Internal Server Error" }, { status: 500 });
  }
}