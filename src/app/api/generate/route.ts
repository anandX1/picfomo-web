import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// @ts-ignore
import piexif from "piexifjs";

// 🌟 BULLETPROOF URL CONSTANTS
const PIXAZO_SCHNELL_URL = "https://gateway.pixazo.ai/flux-1-schnell/v1/getData";
const PIXAZO_FIRERED_URL = "https://gateway.pixazo.ai/firered-image-edit-v1-1/v1/firered-image-edit-v1-1-request";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// 🔥 FIRERED 1.1 – PLAN A PARAMETERS (Single Image + Text Prompt)
const GUIDANCE_SCALE = 4.5; // Sweet spot for text-driven background/clothes replacement
const INFERENCE_STEPS = 30;

// 🌟 ANTI-PLASTIC NEGATIVE PROMPT
const NEGATIVE_PROMPT = "plastic skin, airbrushed, CGI, cartoon, 3d render, overly smooth, beauty filter, distorted features, bad anatomy, wrong identity, multiple people, mutated hands, blurred face";

// === 1. BASE64 TO R2 INTERCEPTOR (Crucial for Pixazo) ===
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

// === 1B. SEMANTIC IMAGE PIPELINE (EXIF & CDN UPLOAD) ===
function getSemanticFilename(styleName: string, id: string): string {
  const cleanStyle = styleName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const isRealistic = cleanStyle.includes('dslr') || cleanStyle.includes('studio') || cleanStyle.includes('corporate');
  const modifier = isRealistic ? 'authentic-unfiltered' : 'professional';
  return `picfomo-${cleanStyle}-${modifier}-portrait-${id}.jpg`;
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function processAndUploadGeneratedImage(imageUrl: string, styleName: string, prompt: string, env: any): Promise<string> {
  try {
    const res = await fetch(imageUrl);
    const arrayBuffer = await res.arrayBuffer();
    let finalBytes = new Uint8Array(arrayBuffer);
    
    // Inject EXIF Metadata for Google Image SEO
    try {
      const base64Str = uint8ArrayToBase64(finalBytes);
      const base64Img = `data:image/jpeg;base64,${base64Str}`;
      
      const exifObj = {
        "0th": {
          [piexif.ImageIFD.Software]: "PicFOMO AI Engine",
          [piexif.ImageIFD.Copyright]: "PicFOMO",
          [piexif.ImageIFD.ImageDescription]: prompt || `PicFOMO ${styleName} AI Portrait`,
        }
      };
      const exifBytes = piexif.dump(exifObj);
      const newBase64 = piexif.insert(exifBytes, base64Img);
      
      const pureBase64 = newBase64.replace(/^data:image\/jpeg;base64,/, "");
      finalBytes = base64ToUint8Array(pureBase64) as any;
    } catch (exifErr) {
      console.warn("EXIF injection failed, skipping:", exifErr);
    }

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

    const uniqueId = Math.random().toString(36).substring(2, 9);
    const key = `renders/${getSemanticFilename(styleName, uniqueId)}`;

    await S3.send(new PutObjectCommand({ 
      Bucket: bucketName, 
      Key: key, 
      ContentType: 'image/jpeg', 
      Body: finalBytes 
    }));

    return `${publicUrl}/${key}`;
  } catch (err) {
    console.error("Semantic upload pipeline failed, returning original URL:", err);
    return imageUrl;
  }
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

// === 4. THE MAIN API ROUTE (PLAN A - SINGLE IMAGE) ===
export async function POST(req: Request) {
  try {
    const clientIp = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'unknown';
    const { userId } = await auth();
    const isGuest = !userId;

    const body = (await req.json()) as any;
    // We drop customBgImage and targetImage entirely for Plan A
    const { prompt, model, styleId, sourceImage } = body;

    const envCtx = ((await getCloudflareContext({ async: true })).env as any);
    const db = envCtx.DB as any;
    
    const PIXAZO_KEY = envCtx.PIXAZO_API_KEY || process.env.PIXAZO_API_KEY;
    const GROQ_KEY = (envCtx.GROQ_API_KEY as string | undefined) ?? process.env.GROQ_API_KEY;

    let sparkCost = 2; 
    let finalPrompt = prompt;
    let secureSourceFace = "";

    // 🌟 TEXTURE ANCHOR TO FIGHT THE PLASTIC LOOK
    const TEXTURE_ANCHOR = "Ensure photorealistic DSLR quality, highly detailed skin texture, visible pores, and natural lighting. Do not airbrush or smooth the face.";

    // --- A. GET PRICING, LOGIC, & PROMPTS ---
    let styleNameForSEO = "schnell";
    if (model !== "schnell") {
      if (!sourceImage) throw new Error("Source face image required.");
      secureSourceFace = await uploadBase64ToR2(sourceImage, envCtx);

      if (styleId === "custom") {
         sparkCost = 15; 
         styleNameForSEO = "custom";
         finalPrompt = `Keep the facial identity, Skin tone, and micro skin texture of the person exactly the same. Change their clothing, background, and scene to: ${prompt}. ${TEXTURE_ANCHOR}`;
      } 
      else {
         const styleRecord = await db.prepare("SELECT spark_cost, description, name FROM styles WHERE id = ?").bind(styleId).first();
         if (!styleRecord) throw new Error("Style not found or inactive.");
         
         sparkCost = styleRecord.spark_cost as number;
         styleNameForSEO = styleRecord.name as string;
         
         // 🌟 PLAN A: Single Image Instruction Prompt
         finalPrompt = `Keep the facial identity of the person exactly the same. Change their clothing, the background, and the overall aesthetic to match this style: ${styleRecord.description}. ${TEXTURE_ANCHOR}`;
         
         if (prompt) finalPrompt += ` Additional user details: ${prompt}`;
      }
    }

    // --- B. SECURE BILLING ---
    if (isGuest) {
      // Check if IP already used a pass
      const existingIp = await db.prepare("SELECT ip FROM guest_ips WHERE ip = ?").bind(clientIp).first();
      if (existingIp && clientIp !== 'unknown') {
        return NextResponse.json({ error: "Free pass already used on this network." }, { status: 429 });
      }
    } else {
      const userWallet = await db.prepare("SELECT sparks_balance FROM users WHERE id = ?").bind(userId).first();
      const currentBalance = (userWallet?.sparks_balance as number) || 0;

      if (currentBalance < sparkCost) {
        return NextResponse.json({ error: "Insufficient Sparks." }, { status: 402 });
      }

      const txId = `tx_${Date.now()}_gen_${Math.random().toString(36).substring(7)}`;
      const txReason = styleId === 'custom' ? 'Custom Style Generation' : 'Generated Portrait';
      
      // Deduct Sparks & Record Transaction
      await db.batch([
        db.prepare("UPDATE users SET sparks_balance = sparks_balance - ? WHERE id = ?").bind(sparkCost, userId),
        db.prepare("INSERT INTO spark_transactions (id, user_id, amount, reason) VALUES (?, ?, ?, ?)").bind(txId, userId, -sparkCost, txReason)
      ]);
    }

    try {
      // --- C. AI GENERATION & SEO ---
      let rawOutputUrl = "";
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
        
        rawOutputUrl = pixazoData.output;
        seoData = groqRes;

      } else {
        // 🌟 FIRE-RED EDIT (PLAN A - SINGLE IMAGE)
        const [pixazoStartRes, groqRes] = await Promise.all([
          fetch(PIXAZO_FIRERED_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Ocp-Apim-Subscription-Key": PIXAZO_KEY },
            body: JSON.stringify({
              prompt: finalPrompt,
              negative_prompt: NEGATIVE_PROMPT, 
              image_urls: [secureSourceFace], // 🌟 BACK TO 1 IMAGE!
              num_inference_steps: INFERENCE_STEPS,
              guidance_scale: GUIDANCE_SCALE
            })
          }),
          generateSEOData(finalPrompt, GROQ_KEY ?? "") 
        ]);

        const startData = (await pixazoStartRes.json()) as any;
        if (!pixazoStartRes.ok || !startData.polling_url) throw new Error(startData.error || "FireRed queue failed");

        rawOutputUrl = await pollPixazoStatus(startData.polling_url, PIXAZO_KEY);
        seoData = groqRes;
      }

      // --- D. SEMANTIC IMAGE PIPELINE (EXIF & CDN) ---
      const finalImageUrl = await processAndUploadGeneratedImage(rawOutputUrl, styleNameForSEO, seoData.description, envCtx);

      // --- E. SAVE TO DATABASE ---
      const postId = `post_${Date.now()}`;
      await db.prepare(`
        INSERT INTO posts (id, user_id, image_url, prompt_used, style_id, title, description, tags, is_public)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0) 
      `).bind(
        postId, isGuest ? 'guest_user' : userId, finalImageUrl, finalPrompt, styleId || "schnell", seoData.title, seoData.description, seoData.tags
      ).run();

      if (isGuest && clientIp !== 'unknown') {
        await db.prepare("INSERT INTO guest_ips (ip) VALUES (?)").bind(clientIp).run();
      }

      const response = NextResponse.json({ output: finalImageUrl, post_id: postId }, { status: 200 });

      if (isGuest) response.cookies.set('picfomo_guest_pass', 'used', { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 30 });
      return response;

    } catch (aiError: any) {
      if (!isGuest) {
        // Refund Sparks
        const refundTxId = `tx_${Date.now()}_refund_${Math.random().toString(36).substring(7)}`;
        await db.batch([
          db.prepare("UPDATE users SET sparks_balance = sparks_balance + ? WHERE id = ?").bind(sparkCost, userId),
          db.prepare("INSERT INTO spark_transactions (id, user_id, amount, reason) VALUES (?, ?, ?, ?)").bind(refundTxId, userId, sparkCost, 'Refund: Generation Failed')
        ]);
      }
      
      console.error("AI Pipeline Error:", aiError);
      if (aiError.message === "NSFW_VIOLATION") return NextResponse.json({ error: "Upload rejected: Violates safety guidelines." }, { status: 400 });
      return NextResponse.json({ error: aiError.message || "Generation failed." }, { status: 500 });
    }

  } catch (serverError: any) {
    console.error("Server API Error:", serverError);
    return NextResponse.json({ error: serverError.message || "Internal Server Error" }, { status: 500 });
  }
}
