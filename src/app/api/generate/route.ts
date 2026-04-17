import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// === 1. GROQ SEO HELPER (Fortified & Cloudflare Safe) ===
async function generateSEOData(prompt: string, apiKey: string) {
  try {
    const safePrompt = prompt?.trim() ? prompt.trim() : "A highly detailed, aesthetic AI image generation.";

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // 🌟 FIX 1: Upgraded to Groq's most robust model
        model: "llama-3.3-70b-versatile",
        // 🌟 FIX 2: Removed strict response_format to stop the 400 crashes!
        messages: [{
          role: "system",
          content: "You are an SEO expert for an AI image gallery. Output ONLY valid JSON. Your JSON must contain exactly three keys: 'title' (catchy 3-5 words), 'description' (engaging 1-2 sentences), and 'tags' (a comma-separated string of 5 relevant tags). Do not use markdown blocks."
        }, {
          role: "user",
          content: safePrompt 
        }],
        temperature: 0.2
      })
    });
    
    if (!res.ok) {
      // 🚨 EXTRACT EXACT ERROR BODY FROM GROQ
      const errorBody = await res.text();
      console.warn(`Groq API failed with status: ${res.status}. Body: ${errorBody}`);
      throw new Error(`Groq request failed: ${res.status}`);
    }

    // 🌟 TS FIX: Cast as any to fix "Type unknown" errors
    const data = (await res.json()) as any;
    
    let content = data?.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("Malformed Groq response structure");
    }

    // 🌟 FIX 3: Defensive parsing to strip markdown if Groq disobeys
    content = content.trim();
    if (content.startsWith('```json')) {
      content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    } else if (content.startsWith('```')) {
      content = content.replace(/```/g, '').trim();
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("Groq SEO Error (Using Safe Fallback):", error);
    return { 
      title: "PicFOMO Generation", 
      description: "A stunning creation synthesized in the PicFOMO Studio.", 
      tags: "ai, art, picfomo, synthesis" 
    };
  }
}

// === 2. PIXAZO FIRE-RED POLLING HELPER (Fixed for Rate Limits) ===
async function pollPixazoStatus(pollingUrl: string, apiKey: string) {
  let attempts = 0;
  const maxAttempts = 24; 

  while (attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 5000)); 
    
    const res = await fetch(pollingUrl, {
      headers: { "Ocp-Apim-Subscription-Key": apiKey }
    });
    
    // 🌟 TS FIX: Cast as any
    const data = (await res.json()) as any;

    if (data.status === "COMPLETED" && data.output?.media_url?.[0]) {
      return data.output.media_url[0];
    }
    if (data.status === "FAILED" || data.status === "ERROR") {
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

    // 🌟 TS FIX: Cast body as any to fix 'prompt does not exist on type unknown'
    const body = (await req.json()) as any;
    const { prompt, model, styleId, sourceImage } = body;

    const envCtx = ((await getCloudflareContext({ async: true })).env as any);
    const db = envCtx.DB as any; // Cast as any to bypass strict D1Database typing issues here
    
    const PIXAZO_KEY = envCtx.PIXAZO_API_KEY || process.env.PIXAZO_API_KEY;
    const GROQ_KEY = envCtx.GROQ_API_KEY || process.env.GROQ_API_KEY;

    if (!GROQ_KEY) console.error("🚨 CRITICAL: GROQ_API_KEY is missing from Cloudflare environment!");

    // --- A. GET PRICING & PROMPTS ---
    let sparkCost = 2; // Default for Schnell
    let finalPrompt = prompt;

    if (model !== "schnell" && styleId) {
      const styleRecord = await db.prepare("SELECT spark_cost, description FROM styles WHERE id = ?").bind(styleId).first();
      if (!styleRecord) throw new Error("Style not found or inactive.");
      
      sparkCost = styleRecord.spark_cost as number;
      finalPrompt = prompt ? `${styleRecord.description}. Additional details: ${prompt}` : (styleRecord.description as string);
    }

    // --- B. SECURE BILLING ---
    const userWallet = await db.prepare("SELECT sparks_balance FROM users WHERE id = ?").bind(userId).first();
    const currentBalance = (userWallet?.sparks_balance as number) || 0;

    if (currentBalance < sparkCost) {
      return NextResponse.json({ error: "Insufficient Sparks." }, { status: 402 });
    }

    // DEDUCT SPARKS FIRST
    await db.prepare("UPDATE users SET sparks_balance = sparks_balance - ? WHERE id = ?").bind(sparkCost, userId).run();

    try {
      // --- C. AI GENERATION & SEO (CONCURRENT) ---
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
          generateSEOData(finalPrompt, GROQ_KEY) 
        ]);

        // 🌟 TS FIX: Cast as any
        const pixazoData = (await pixazoRes.json()) as any;
        if (!pixazoRes.ok) throw new Error(pixazoData.error || "Schnell API Failed");
        
        outputImageUrl = pixazoData.output;
        seoData = groqRes;

      } else {
        if (!sourceImage) throw new Error("Source image required for this style.");

        const [pixazoStartRes, groqRes] = await Promise.all([
          fetch("[https://gateway.pixazo.ai/firered-image-edit-v1-1/v1/firered-image-edit-v1-1-request](https://gateway.pixazo.ai/firered-image-edit-v1-1/v1/firered-image-edit-v1-1-request)", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Ocp-Apim-Subscription-Key": PIXAZO_KEY
            },
            body: JSON.stringify({
              prompt: finalPrompt,
              image_urls: [sourceImage],
              num_inference_steps: 30,
              guidance_scale: 4
            })
          }),
          generateSEOData(finalPrompt, GROQ_KEY) 
        ]);

        // 🌟 TS FIX: Cast as any
        const startData = (await pixazoStartRes.json()) as any;
        if (!pixazoStartRes.ok || !startData.polling_url) throw new Error(startData.error || "FireRed queue failed");

        outputImageUrl = await pollPixazoStatus(startData.polling_url, PIXAZO_KEY);
        seoData = groqRes;
      }

      // --- D. SAVE TO DATABASE ---
      const postId = `post_${Date.now()}`;
      await db.prepare(`
        INSERT INTO posts (id, user_id, image_url, prompt_used, style_id, title, description, tags, is_public)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
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
      await db.prepare("UPDATE users SET sparks_balance = sparks_balance + ? WHERE id = ?").bind(sparkCost, userId).run();
      console.error("AI Pipeline Error (Refunded):", aiError);
      return NextResponse.json({ error: aiError.message || "Generation failed. Sparks refunded." }, { status: 500 });
    }

  } catch (serverError) {
    console.error("Server API Error:", serverError);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}