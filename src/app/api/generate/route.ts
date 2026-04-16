import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(req: Request) {
  let sparksDeducted = false;
  let costToRefund = 0;
  let currentUserId = "";
  let styleName = "Generation";

  try {
    // 1. AUTH CHECK
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    currentUserId = userId;

    const body = (await req.json()) as any;
    const { prompt, styleId, model, steps, width, height } = body;

    if (!prompt) return NextResponse.json({ error: "Missing prompt data" }, { status: 400 });

    // 🌟 OFFICIAL OPENNEXT DATABASE CONNECTION
    const { env } = await getCloudflareContext({ async: true });
    const db = env.DB as any;
    if (!db) throw new Error("Database binding missing from OpenNext context");

    // 2. ECONOMY CHECK
    if (styleId) {
      // 'as any' instantly kills the strict TypeScript unknown errors
      const style = await db
        .prepare("SELECT name, spark_cost FROM styles WHERE id = ? AND is_active = 1")
        .bind(styleId)
        .first() as any;

      if (!style) return NextResponse.json({ error: "Invalid style" }, { status: 400 });
      
      costToRefund = style.spark_cost;
      styleName = style.name;
    } else if (model === "schnell") {
      costToRefund = 0; 
      styleName = "Flux Schnell";
    } else {
      return NextResponse.json({ error: "Invalid generation request" }, { status: 400 });
    }

    // 3. THE ATOMIC TOLL BOOTH 
    if (costToRefund > 0) {
      const updateResult = await db
        .prepare(`UPDATE users SET sparks_balance = sparks_balance - ? WHERE id = ? AND sparks_balance >= ? RETURNING sparks_balance`)
        .bind(costToRefund, userId, costToRefund)
        .first();

      if (!updateResult) return NextResponse.json({ error: "Not enough Sparks." }, { status: 402 });

      const txId = `tx_${Date.now()}_gen_${Math.random().toString(36).substring(7)}`;
      await db.prepare("INSERT INTO spark_transactions (id, user_id, amount, reason) VALUES (?, ?, ?, ?)")
        .bind(txId, userId, -costToRefund, `Started: ${styleName}`)
        .run();

      sparksDeducted = true; 
    }

    // 4. CALL THE AI 
    const PIXAZO_KEY = process.env.PIXAZO_API_KEY;
    if (!PIXAZO_KEY) throw new Error("Server missing Pixazo API key");

    let imageUrl = "";

    if (model === "schnell") {
      const payload = {
        prompt: prompt,
        num_steps: steps || 4,
        width: width || 1024,
        height: height || 1024
      };

      const response = await fetch("https://gateway.pixazo.ai/flux-1-schnell/v1/getData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": PIXAZO_KEY
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`Pixazo Error: ${response.status} - ${await response.text()}`);
      
      const data = (await response.json()) as any;
      if (data.output) {
        imageUrl = data.output;
      } else {
        throw new Error("No image URL returned from Pixazo.");
      }
    } else if (styleId) {
      throw new Error("Premium Styles are currently under maintenance. Please use the free Imagine tool.");
    }

    // 5. SAVE TO VAULT 
    const postId = `post_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    await db.prepare("INSERT INTO posts (id, user_id, image_url, prompt_used, style_id, is_public) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(postId, userId, imageUrl, prompt, styleId || "schnell", 1)
      .run();

    // 6. RETURN TO FRONTEND
    return NextResponse.json({ output: imageUrl }, { status: 200 });

  } catch (error: any) {
    console.error("Generation Error:", error);
    
    // 7. THE REFUND MECHANISM
    if (sparksDeducted && currentUserId && costToRefund > 0) {
      try {
        const { env } = await getCloudflareContext({ async: true });
        const db = env.DB as any;
        const refundTxId = `tx_${Date.now()}_refund_${Math.random().toString(36).substring(7)}`;
        await db.batch([
          db.prepare("UPDATE users SET sparks_balance = sparks_balance + ? WHERE id = ?").bind(costToRefund, currentUserId),
          db.prepare("INSERT INTO spark_transactions (id, user_id, amount, reason) VALUES (?, ?, ?, ?)").bind(refundTxId, currentUserId, costToRefund, `Refunded: ${styleName} (Failed)`)
        ]);
      } catch (e) { console.error("Refund failed!", e); }
    }
    return NextResponse.json({ error: error.message || "API Error. Sparks refunded." }, { status: 500 });
  }
}