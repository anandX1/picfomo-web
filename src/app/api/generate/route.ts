import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// === 1. GROQ SEO HELPER ===
async function generateSEOData(prompt: string) {
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        response_format: { type: "json_object" },
        messages: [{
          role: "system",
          content: "You are an SEO expert for an AI image gallery. Based on the user's image prompt, return a JSON object with exactly three keys: 'title' (catchy 3-5 words), 'description' (engaging 1-2 sentences), and 'tags' (a comma-separated string of 5 relevant tags)."
        }, {
          role: "user",
          content: prompt
        }]
      })
    });
    
    const data = await res.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error("Groq SEO Error:", error);
    return { title: "AI Generation", description: "Created in PicFOMO Studio.", tags: "ai, art, picfomo" };
  }
}

// === 2. PIXAZO FIRE-RED POLLING HELPER ===
async function pollPixazoStatus(pollingUrl: string, apiKey: string) {
  let attempts = 0;
  const maxAttempts = 20; // 20 attempts * 1.5s = 30 seconds max timeout

  while (attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Wait 1.5s between checks
    
    const res = await fetch(pollingUrl, {
      headers: { "Ocp-Apim-Subscription-Key": apiKey }
    });
    const data = await res.json();

    if (data.status === "COMPLETED" && data.output?.media_url?.[0]) {
      return data.output.media_url[0];
    }
    if (data.status === "FAILED" || data.status === "ERROR") {
      throw new Error(`Pixazo Generation Failed: ${data.error || "Unknown Error"}`);
    }
    
    attempts++;
  }
  throw new Error("Generation timed out. Please try again.");
}

// === 3. THE MAIN API ROUTE ===
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { prompt, model, styleId, sourceImage } = body;

    const db = ((await getCloudflareContext({ async: true })).env.DB as any as D1Database);
    const PIXAZO_KEY = process.env.PIXAZO_API_KEY!;

    // --- A. GET PRICING & PROMPTS ---
    let sparkCost = 2; // Default for Schnell
    let finalPrompt = prompt;

    if (model !== "schnell" && styleId) {
      // It's a Premium Style. Fetch details from DB.
      const styleRecord = await db.prepare("SELECT spark_cost, description FROM styles WHERE id = ?").bind(styleId).first();
      if (!styleRecord) throw new Error("Style not found or inactive.");
      
      sparkCost = styleRecord.spark_cost as number;
      // Combine the Secret Prompt + Optional User Prompt
      finalPrompt = prompt ? `${styleRecord.description}. Additional details: ${prompt}` : (styleRecord.description as string);
    }

    // --- B. SECURE BILLING (🌟 FIX: Uses 'sparks_balance') ---
    const userWallet = await db.prepare("SELECT sparks_balance FROM users WHERE id = ?").bind(userId).first();
    const currentBalance = (userWallet?.sparks_balance as number) || 0;

    if (currentBalance < sparkCost) {
      return NextResponse.json({ error: "Insufficient Sparks." }, { status: 402 });
    }

    // DEDUCT SPARKS FIRST (The secure way)
    await db.prepare("UPDATE users SET sparks_balance = sparks_balance - ? WHERE id = ?").bind(sparkCost, userId).run();

    try {
      // --- C. AI GENERATION & SEO (CONCURRENT) ---
      let outputImageUrl = "";
      let seoData = { title: "", description: "", tags: "" };

      if (model === "schnell") {
        // FAST LANE: Run Schnell & Groq at the exact same time
        const [pixazoRes, groqRes] = await Promise.all([
          fetch("https://gateway.pixazo.ai/flux-1-schnell/v1/getData", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Ocp-Apim-Subscription-Key": PIXAZO_KEY
            },
            body: JSON.stringify({ prompt: finalPrompt, num_steps: 4, height: 1024, width: 1024 })
          }),
          generateSEOData(finalPrompt)
        ]);

        const pixazoData = await pixazoRes.json();
        if (!pixazoRes.ok) throw new Error(pixazoData.error || "Schnell API Failed");
        
        outputImageUrl = pixazoData.output;
        seoData = groqRes;

      } else {
        // HEAVY LANE: FireRed Edit (Image to Image)
        if (!sourceImage) throw new Error("Source image required for this style.");

        // Start FireRed Job & Groq SEO at the same time
        const [pixazoStartRes, groqRes] = await Promise.all([
          fetch("https://gateway.pixazo.ai/firered-image-edit-v1-1/v1/firered-image-edit-v1-1-request", {
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
          generateSEOData(finalPrompt)
        ]);

        const startData = await pixazoStartRes.json();
        if (!pixazoStartRes.ok || !startData.polling_url) throw new Error(startData.error || "FireRed queue failed");

        // Wait for FireRed to finish processing via Polling Helper
        outputImageUrl = await pollPixazoStatus(startData.polling_url, PIXAZO_KEY);
        seoData = groqRes;
      }

      // --- D. SAVE TO DATABASE ---
      const postId = `post_${Date.now()}`;
      await db.prepare(`
        INSERT INTO posts (id, user_id, image_url, prompt_used, style_id, title, description, tags, is_private)
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

      // Return success to the frontend!
      return NextResponse.json({ output: outputImageUrl, post_id: postId }, { status: 200 });

    } catch (aiError: any) {
      // 🚨 CRITICAL REFUND LOGIC (🌟 FIX: Uses 'sparks_balance') 🚨
      // If the AI fails, we MUST give the user their Sparks back!
      await db.prepare("UPDATE users SET sparks_balance = sparks_balance + ? WHERE id = ?").bind(sparkCost, userId).run();
      console.error("AI Pipeline Error (Refunded):", aiError);
      return NextResponse.json({ error: aiError.message || "Generation failed. Sparks refunded." }, { status: 500 });
    }

  } catch (serverError) {
    console.error("Server API Error:", serverError);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}