import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// 🌟 BULLETPROOF URL CONSTANTS (Prevents Markdown Link Copy-Paste Errors)
const PIXAZO_SCHNELL_URL = "https://gateway.pixazo.ai/flux-1-schnell/v1/getData";
const PIXAZO_FIRERED_URL = "https://gateway.pixazo.ai/firered-image-edit-v1-1/v1/firered-image-edit-v1-1-request";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// === 1. GROQ SEO HELPER (Fortified & Cloudflare Safe) ===
async function generateSEOData(prompt: string, apiKey: string) {
  if (!apiKey || apiKey === "undefined") {
    console.error("🚨 GROQ_API_KEY is missing or undefined — skipping Groq call");
    return { 
      title: "PicFOMO Generation", 
      description: "A stunning creation synthesized in the PicFOMO Studio.", 
      tags: "ai, art, picfomo, portrait, synthesis" 
    };
  }

  try {
    const safePrompt = prompt?.trim() 
      ? prompt.trim().slice(0, 500)
      : "A highly detailed, aesthetic AI image generation.";

    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        max_tokens: 300,
        messages: [
          {
            role: "system",
            content: `You are an SEO expert for an AI image gallery called PicFOMO. 
Respond ONLY with a raw JSON object — no markdown, no backticks, no explanation.
The JSON must have exactly these three keys:
- "title": a catchy 3-5 word phrase
- "description": 1-2 engaging sentences  
- "tags": a comma-separated string of exactly 5 relevant tags`
          },
          {
            role: "user",
            content: `Generate SEO metadata for this image prompt: "${safePrompt}"`
          }
        ],
        temperature: 0.3,
      })
    });
    
    if (!res.ok) {
      const errorBody = await res.text();
      console.error(`🚨 Groq 400 body: ${errorBody}`);
      throw new Error(`Groq ${res.status}: ${errorBody}`);
    }

    const data = (await res.json()) as any;
    let content = data?.choices?.[0]?.message?.content;

    if (!content) throw new Error("Empty Groq response");

    // Strip markdown fences defensively
    content = content.trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(content);

    if (!parsed.title || !parsed.description || !parsed.tags) {
      throw new Error("Groq returned malformed JSON shape");
    }

    return parsed;

  } catch (error) {
    console.error("Groq SEO Error:", error);
    return { 
      title: "PicFOMO Generation", 
      description: "A stunning creation synthesized in the PicFOMO Studio.", 
      tags: "ai, art, picfomo, synthesis" 
    };
  }
}

// === 2. PIXAZO FIRE-RED POLLING HELPER ===
async function pollPixazoStatus(pollingUrl: string, apiKey: string) {
  let attempts = 0;
  const maxAttempts = 24; 

  while (attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 5000)); 
    
    const res = await fetch(pollingUrl, {
      headers: { "Ocp-Apim-Subscription-Key": apiKey }
    });
    
    const data = (await res.json()) as any;

    if (data.status === "COMPLETED" && data.output?.media_url?.[0]) {
      return data.output.media_url[0];
    }
    
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

// === 3. THE MAIN API ROUTE ===
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

    if (!GROQ_KEY) console.error("🚨 CRITICAL: GROQ_API_KEY is missing from Cloudflare environment!");

    // --- A. GET PRICING, LOGIC, & PROMPTS ---
    let sparkCost = 2; // Default for Schnell
    let finalPrompt = prompt;
    let apiImageUrls: string[] = [];

    if (model !== "schnell") {
      if (model === "swap") {
        if (!targetImage || !sourceImage) throw new Error("Target and source images required for swap.");
        apiImageUrls = [targetImage, sourceImage];
        finalPrompt = prompt || "Replace the face in Figure 1 with the face from Figure 2. Preserve Figure 1's background and clothing.";
      } 
      else if (styleId === "custom") {
         sparkCost = 15; 
         if (!customBgImage || !sourceImage) throw new Error("Face and custom background image required.");
         
         // 🌟 CUSTOM MODE: Base = User Face (Fig 1), Reference = Custom Background (Fig 2)
         apiImageUrls = [sourceImage, customBgImage];
         
         finalPrompt = `Replace the entire background of Figure 1 with the exact scene and environment from Figure 2. Preserve the person in Figure 1 exactly, keeping their clothing, face, and pose unchanged. Adjust lighting to blend naturally.`;
         
         if (prompt) finalPrompt += ` Additional details: ${prompt}`;
      } 
      else {
         const styleRecord = await db.prepare("SELECT spark_cost, description, preview_image_url FROM styles WHERE id = ?").bind(styleId).first();
         if (!styleRecord) throw new Error("Style not found or inactive.");
         
         sparkCost = styleRecord.spark_cost as number;
         if (!sourceImage) throw new Error("Source face image required.");
         
         // 🌟 PREMIUM STYLE FIX: Base = Style Image (Fig 1), Reference = User Face (Fig 2)
         apiImageUrls = [styleRecord.preview_image_url as string, sourceImage];
         
         finalPrompt = `Replace the face of the person in Figure 1 with the exact facial features and identity of the person in Figure 2. Strictly preserve the original background, clothing, posture, lighting, and artistic style of Figure 1. Ensure seamless skin tone matching. Do not alter the scene or outfit of Figure 1.`;
         
         if (styleRecord.description) finalPrompt += ` Context: ${styleRecord.description}.`;
         if (prompt) finalPrompt += ` User details: ${prompt}`;
      }
    }

    // --- B. SECURE BILLING ---
    const userWallet = await db.prepare("SELECT sparks_balance FROM users WHERE id = ?").bind(userId).first();
    const currentBalance = (userWallet?.sparks_balance as number) || 0;

    if (currentBalance < sparkCost) {
      return NextResponse.json({ error: "Insufficient Sparks." }, { status: 402 });
    }

    // DEDUCT SPARKS AND LOG TRANSACTION
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
            headers: {
              "Content-Type": "application/json",
              "Ocp-Apim-Subscription-Key": PIXAZO_KEY
            },
            body: JSON.stringify({ prompt: finalPrompt, num_steps: 4, height: 1024, width: 1024 })
          }),
          generateSEOData(finalPrompt, GROQ_KEY ?? "") 
        ]);

        const pixazoData = (await pixazoRes.json()) as any;
        if (!pixazoRes.ok) throw new Error(pixazoData.error || "Schnell API Failed");
        
        outputImageUrl = pixazoData.output;
        seoData = groqRes;

      } else {
        // 🌟 FIRE-RED COMPOSITING (Dual Image)
        if (!apiImageUrls || apiImageUrls.length < 2) throw new Error("Missing required images for compositing.");

        const [pixazoStartRes, groqRes] = await Promise.all([
          fetch(PIXAZO_FIRERED_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Ocp-Apim-Subscription-Key": PIXAZO_KEY
            },
            body: JSON.stringify({
              prompt: finalPrompt,
              image_urls: apiImageUrls, 
              num_inference_steps: 30,
              guidance_scale: 4
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
        postId, 
        userId, 
        outputImageUrl, 
        finalPrompt, 
        styleId || "schnell",
        seoData.title,
        seoData.description,
        seoData.tags
      ).run();

      return NextResponse.json({ output: outputImageUrl, post_id: postId }, { status: 200 });

    } catch (aiError: any) {
      // REFUND SPARKS ON FAILURE
      const refundTxId = `tx_${Date.now()}_refund_${Math.random().toString(36).substring(7)}`;
      await db.batch([
        db.prepare("UPDATE users SET sparks_balance = sparks_balance + ? WHERE id = ?").bind(sparkCost, userId),
        db.prepare("INSERT INTO spark_transactions (id, user_id, amount, reason) VALUES (?, ?, ?, ?)").bind(refundTxId, userId, sparkCost, 'Refund: Generation Failed')
      ]);
      
      console.error("AI Pipeline Error (Refunded):", aiError);
      
      if (aiError.message === "NSFW_VIOLATION") {
         return NextResponse.json({ error: "Upload rejected: Violates safety and community guidelines. Sparks refunded." }, { status: 400 });
      }
      
      return NextResponse.json({ error: aiError.message || "Generation failed. Sparks refunded." }, { status: 500 });
    }

  } catch (serverError: any) {
    console.error("Server API Error:", serverError);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}