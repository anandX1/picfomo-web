export async function POST(req: Request) {
  try {
    // 1. THE BOUNCER: Check for your custom secret
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");

    // We will add WEBHOOK_SECRET to your Cloudflare/Next.js environment variables later
    if (secret !== process.env.WEBHOOK_SECRET) {
      console.error("🚨 SECURITY ALERT: Unauthorized webhook attempt blocked.");
      return new Response(JSON.stringify({ error: "Unauthorized. Hacker Blocked." }), { status: 401 });
    }

    // 2. Parse the Replicate Payload
    const body = await req.json() as any;
    
    // 3. Only process it if the AI successfully finished the image
    if (body.status === "succeeded") {
        const imageUrl = body.output[0];
        const predictionId = body.id; // Replicate's unique ID for this generation
        
        const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any as D1Database);

        // 4. Update the Vault! Find the "pending" post and attach the finished image.
        await db.prepare("UPDATE posts SET image_url = ?, status = 'completed' WHERE replicate_id = ?")
          .bind(imageUrl, predictionId)
          .run();
          
        console.log(`✅ Webhook success: Image saved for prediction ${predictionId}`);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    // If it's just a "starting" or "processing" update, just say OK and ignore it
    return new Response(JSON.stringify({ received: true }), { status: 200 });

  } catch (error) {
    console.error("Webhook Error:", error);
    return new Response(JSON.stringify({ error: "Webhook failed" }), { status: 500 });
  }
}