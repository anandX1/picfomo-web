import { auth } from "@clerk/nextjs/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import Replicate from "replicate";

export const runtime = "edge";

export async function POST(req: Request) {
  let sparksDeducted = false;
  let costToRefund = 0;
  let currentUserId = "";
  let styleName = "Generation";

  try {
    const { userId } = await auth();
    if (!userId) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    currentUserId = userId;

    const body = (await req.json()) as { prompt: string; styleId: string };
    const { prompt, styleId } = body;

    if (!prompt || !styleId) return new Response(JSON.stringify({ error: "Missing data" }), { status: 400 });

    const db = getRequestContext().env.DB;

    const style = await db
      .prepare("SELECT name, spark_cost FROM styles WHERE id = ? AND is_active = 1")
      .bind(styleId)
      .first<{ name: string; spark_cost: number }>();

    if (!style) return new Response(JSON.stringify({ error: "Invalid style" }), { status: 400 });
    
    costToRefund = style.spark_cost;
    styleName = style.name;

    // 1. THE ATOMIC TOLL BOOTH
    const updateResult = await db
      .prepare(`UPDATE users SET sparks_balance = sparks_balance - ? WHERE id = ? AND sparks_balance >= ? RETURNING sparks_balance`)
      .bind(costToRefund, userId, costToRefund)
      .first();

    if (!updateResult) return new Response(JSON.stringify({ error: "Not enough Sparks." }), { status: 402 });

    // 2. INSTANT LEDGER LOG
    const txId = `tx_${Date.now()}_gen_${Math.random().toString(36).substring(7)}`;
    await db.prepare("INSERT INTO spark_transactions (id, user_id, amount, reason) VALUES (?, ?, ?, ?)")
      .bind(txId, userId, -costToRefund, `Started: ${styleName}`)
      .run();

    sparksDeducted = true; 

    // 3. CALL THE AI 
    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      { input: { prompt: `${prompt}, in the style of ${styleName}` } }
    ) as string[];

    const imageUrl = output[0];

    // 4. SAVE TO VAULT (Transaction is already logged above!)
    const postId = `post_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    await db.prepare("INSERT INTO posts (id, user_id, image_url, prompt_used, style_id, is_public) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(postId, userId, imageUrl, prompt, styleId, 1)
      .run();

    return new Response(JSON.stringify({ imageUrl: imageUrl }), { status: 200 });

  } catch (error) {
    console.error("Generation Error:", error);
    
    // 5. THE REFUND MECHANISM
    if (sparksDeducted && currentUserId) {
      try {
        const db = getRequestContext().env.DB;
        const refundTxId = `tx_${Date.now()}_refund_${Math.random().toString(36).substring(7)}`;
        await db.batch([
          db.prepare("UPDATE users SET sparks_balance = sparks_balance + ? WHERE id = ?").bind(costToRefund, currentUserId),
          db.prepare("INSERT INTO spark_transactions (id, user_id, amount, reason) VALUES (?, ?, ?, ?)").bind(refundTxId, currentUserId, costToRefund, `Refunded: ${styleName} (Failed)`)
        ]);
      } catch (e) { console.error("Refund failed!", e); }
    }
    return new Response(JSON.stringify({ error: "API Error. Sparks refunded." }), { status: 500 });
  }
}