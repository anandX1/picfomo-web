import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { enqueueIndexing, pingSitemaps } from "@/utils/indexing";

// ❌ WE DELETED 'export const runtime = "edge"' to allow Svix crypto to work via OpenNext

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!WEBHOOK_SECRET) {
    console.error('Missing CLERK_WEBHOOK_SECRET');
    return new Response('Error: Missing secret', { status: 500 });
  }

  // Next.js 15+ async headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error: Invalid signature', { status: 400 });
  }

  const eventType = evt.type;

  // 🌟 Clean OpenNext DB Connection
  let db: any;
  try {
    const { env } = await getCloudflareContext({ async: true });
    db = env.DB;
  } catch (e) {
    console.error("Failed to connect to D1:", e);
    return new Response('Database Connection Error', { status: 500 });
  }

  // ---------------------------------------------------------
  // 1. HANDLE NEW USER SIGNUPS (The 35 Spark Welcome Bonus)
  // ---------------------------------------------------------
  if (eventType === 'user.created') {
    const { id, first_name, username, image_url, email_addresses } = evt.data;
    const primaryEmail = email_addresses?.[0]?.email_address || '';
    const finalUsername = username || first_name || `user_${id.slice(0, 5)}`;
    
    // Guarantee uniqueness for referral codes
    const referralCode = `${finalUsername.toLowerCase()}_${Math.random().toString(36).substring(7)}`; 

    console.log(`⚡ WEBHOOK: Processing user ${finalUsername} (ID: ${id})`);
    
    try {
      // Wipe out old ghost accounts if you reuse an email during testing
      const oldUser = await db.prepare("SELECT id FROM users WHERE email = ?").bind(primaryEmail).first();
      
      if (oldUser) {
        console.log(`⚠️ Cleaning up old ghost data for reused email: ${primaryEmail}`);
        await db.batch([
          db.prepare("DELETE FROM spark_transactions WHERE user_id = ?").bind(oldUser.id),
          db.prepare("DELETE FROM user_tasks WHERE user_id = ?").bind(oldUser.id),
          db.prepare("DELETE FROM referrals WHERE referred_user_id = ? OR referrer_id = ?").bind(oldUser.id, oldUser.id),
          db.prepare("DELETE FROM users WHERE id = ?").bind(oldUser.id)
        ]);
      }

      // Insert fresh User with exactly 35 Sparks and their unique referral code
      await db.prepare(`
        INSERT INTO users (id, email, username, display_name, profile_image_url, sparks_balance, referral_code)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id, primaryEmail, finalUsername, finalUsername, image_url || '', 35, referralCode
      ).run();

      const txId = `tx_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      await db.prepare(`
        INSERT INTO spark_transactions (id, user_id, amount, reason)
        VALUES (?, ?, ?, ?)
      `).bind(txId, id, 35, 'Welcome Bonus').run();

      console.log(`✅ SAVED ${finalUsername} WITH 35 SPARKS!`);
      await enqueueIndexing(`https://www.picfomo.com/u/${finalUsername}`);
      await pingSitemaps();

    } catch (dbError) {
      console.error("❌ Database Error:", dbError);
      return new Response('Database injection failed', { status: 500 });
    }
  }

  // ---------------------------------------------------------
  // 2. HANDLE USER UPDATES
  // ---------------------------------------------------------
  if (eventType === 'user.updated') {
    const { id, first_name, username, image_url } = evt.data;
    const finalUsername = username || first_name || `user_${id.slice(0, 5)}`;

    console.log(`⚡ WEBHOOK: Updating user ${finalUsername} (ID: ${id})`);
    
    try {
      await db.prepare(`
        UPDATE users 
        SET username = ?, display_name = ?, profile_image_url = ? 
        WHERE id = ?
      `).bind(finalUsername, finalUsername, image_url || '', id).run();

      console.log(`✅ UPDATED ${finalUsername} IN DATABASE!`);
      await enqueueIndexing(`https://www.picfomo.com/u/${finalUsername}`);
      await pingSitemaps();
    } catch (dbError) {
      console.error("❌ Database Update Error:", dbError);
      return new Response('Database update failed', { status: 500 });
    }
  }

  // ---------------------------------------------------------
  // 3. HANDLE USER DELETIONS (Auto-Cleanup)
  // ---------------------------------------------------------
  if (eventType === 'user.deleted') {
    const { id } = evt.data;
    if (id) {
      try {
        await db.batch([
          db.prepare("DELETE FROM spark_transactions WHERE user_id = ?").bind(id),
          db.prepare("DELETE FROM user_tasks WHERE user_id = ?").bind(id),
          db.prepare("DELETE FROM referrals WHERE referred_user_id = ? OR referrer_id = ?").bind(id, id),
          db.prepare("DELETE FROM users WHERE id = ?").bind(id)
        ]);
        console.log(`🗑️ Successfully purged user ${id}`);
      } catch (err) {
        console.error("Failed to delete user:", err);
      }
    }
  }

  return new Response('Webhook processed successfully', { status: 200 });
}