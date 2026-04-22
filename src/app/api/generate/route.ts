import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

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

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
      throw new Error(`Groq ${res.status}: ${errorBody}`);
    }

    const data = (await res.json()) as any;
    let content = data?.choices?.[0]?.message?.content;

    if (!content) throw new Error("Empty Groq response");

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
    console.error("Groq SEO Error (Using Safe Fallback):", error);
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
    
    // 🌟 NSFW & SAFETY CATCH
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
    const db = envCtx.DB as D1Database;
    
    const PIXAZO_KEY = envCtx.PIXAZO_API_KEY || process.env.PIXAZO_API_KEY;
    const GROQ_KEY = (envCtx.GROQ_API_KEY as string | undefined) ?? process.env.GROQ_API_KEY;

    if (!GROQ_KEY) console.error("🚨 CRITICAL: GROQ_API_KEY is missing from Cloudflare environment!");

    let sparkCost = 2; 
    let finalPrompt = prompt;
    let targetBackgroundUrl = customBgImage || null;

    if (model !== "schnell" && model !== "swap") {
      if (styleId === "custom") {
         sparkCost = 15; 
         if (!customBgImage) throw new Error("Custom background image required.");
      } else {
         const styleRecord = await db.prepare("SELECT spark_cost, description, preview_image_url FROM styles WHERE id = ?").bind(styleId).first();
         if (!styleRecord) throw new Error("Style not found or inactive.");
         
         sparkCost = styleRecord.spark_cost as number;
         targetBackgroundUrl = styleRecord.preview_image_url as string; 
         
         finalPrompt = `Place the person from Figure 1 into the scene from Figure 2. Preserve the exact facial features, skin tone, and identity of the person from Figure 1. Match the lighting direction, color temperature, and atmosphere of Figure 2. Natural seamless blend, photorealistic, no compositing artifacts. Style details: ${styleRecord.description}`;
         
         if (prompt) finalPrompt += `. Additional user details: ${prompt}`;
      }
    }

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
      let outputImageUrl = "";
      let seoData = { title: "", description: "", tags: "" };

      if (model === "schnell") {
        const [pixazoRes, groqRes] = await Promise.all([
          fetch("[https://gateway.pixazo.ai/flux-1-schnell/v1/getData](https://gateway.pixazo.ai/flux-1-schnell/v1/getData)", {
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
        if (!sourceImage) throw new Error("Source face image required.");
        
        let apiImageUrls = [sourceImage, targetBackgroundUrl];
        
        if (model === "swap") {
          if (!targetImage) throw new Error("Target image is missing for Collab Swap!");
          apiImageUrls = [targetImage, sourceImage]; 
        } else if (!targetBackgroundUrl) {
          throw new Error("Target background required for this style.");
        }

        const [pixazoStartRes, groqRes] = await Promise.all([
          fetch("[https://gateway.pixazo.ai/firered-image-edit-v1-1/v1/firered-image-edit-v1-1-request](https://gateway.pixazo.ai/firered-image-edit-v1-1/v1/firered-image-edit-v1-1-request)", {
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
    return NextResponse.json({ error: serverError.message || "Internal Server Error" }, { status: 500 });
  }
}