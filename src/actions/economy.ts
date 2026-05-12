"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { enqueueIndexing, pingSitemaps } from "@/utils/indexing";

// 1. CLAIM DAILY LOGIN REWARD (Upgraded with Streak Tracking)
export async function claimDailyLogin() {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, message: "Unauthorized" };

    const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any as D1Database);

    // 1. Check if already claimed today
    const existingClaim = await db.prepare(
      "SELECT id FROM task_completions WHERE user_id = ? AND task_key = 'daily_login' AND date(completed_at) = date('now')"
    ).bind(userId).first();

    if (existingClaim) return { success: false, message: "Already claimed today" };

    // 2. Fetch user's current streak data (🌟 FIX: Using your existing streak_days column!)
    const user = await db.prepare(
      "SELECT streak_days FROM users WHERE id = ?"
    ).bind(userId).first<{ streak_days: number }>();
    
    let currentStreak = user?.streak_days || 0;

    // 3. Calculate Streak Logic (🌟 FIX: Checking task_completions for yesterday!)
    const yesterdayClaim = await db.prepare(
      "SELECT id FROM task_completions WHERE user_id = ? AND task_key = 'daily_login' AND date(completed_at) = date('now', '-1 day')"
    ).bind(userId).first();

    // If they claimed exactly yesterday, the streak continues. Otherwise, it resets to 1.
    if (yesterdayClaim) {
      currentStreak += 1;
    } else {
      currentStreak = 1;
    }

    // Reset the visual loop back to 1 if they pass day 7
    if (currentStreak > 7) {
      currentStreak = 1;
    }

    // 4. Calculate Rewards (Day 7 gives 5 base + 20 bonus = 25 Sparks)
    const isDay7 = currentStreak === 7;
    const rewardAmount = isDay7 ? 25 : 5; 

    // 5. Generate secure IDs for the database (Matching your schema)
    const txId = `tx_${Date.now()}_daily_${Math.random().toString(36).substring(7)}`;
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // 6. Execute Database Batch (Updates everything safely in one go)
    await db.batch([
      // Log Task Completion
      db.prepare("INSERT INTO task_completions (id, user_id, task_key) VALUES (?, ?, ?)").bind(taskId, userId, 'daily_login'),
      // Update Wallet & Streak Memory using streak_days
      db.prepare("UPDATE users SET sparks_balance = sparks_balance + ?, streak_days = ? WHERE id = ?").bind(rewardAmount, currentStreak, userId),
      // Add to Ledger
      db.prepare("INSERT INTO spark_transactions (id, user_id, amount, reason) VALUES (?, ?, ?, ?)").bind(txId, userId, rewardAmount, isDay7 ? 'Day 7 Login Bonus' : 'Daily Login Drop')
    ]);

    // Force UI refresh
    revalidatePath("/dashboard/sparks");
    revalidatePath("/sparks"); 

    return { success: true, reward: rewardAmount, streak: currentStreak };

  } catch (error: any) {
    console.error("Daily claim error:", error);
    return { success: false, message: "Server error processing claim." };
  }
}

// 2. JOIN PRO WAITLIST (Phantom Feature)
export async function joinProWaitlist(expectedPrice: number, contactInfo: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any as D1Database);

  const existingLead = await db
    .prepare("SELECT id FROM early_access_leads WHERE user_id = ?")
    .bind(userId)
    .first();

  if (existingLead) {
    return { success: false, message: "Already on waitlist" };
  }

  const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const txId = `tx_${Date.now()}_waitlist_${Math.random().toString(36).substring(7)}`;

  await db.batch([
    db.prepare("INSERT INTO early_access_leads (id, user_id, expected_price, contact_info) VALUES (?, ?, ?, ?)").bind(leadId, userId, expectedPrice, contactInfo),
    db.prepare("UPDATE users SET sparks_balance = sparks_balance + 12 WHERE id = ?").bind(userId),
    db.prepare("INSERT INTO spark_transactions (id, user_id, amount, reason) VALUES (?, ?, ?, ?)").bind(txId, userId, 12, 'Pro Waitlist Bonus')
  ]);

  revalidatePath("/dashboard/sparks");
  return { success: true };
}

// 3. PURCHASE PRIVACY (22 Sparks)
export async function purchasePrivacy(postId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  
  const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any as D1Database);
  const COST = 22; 

  const post = await db.prepare("SELECT user_id, is_public FROM posts WHERE id = ?").bind(postId).first<{ user_id: string; is_public: number }>();
  if (!post) return { success: false, message: "Post not found" };
  if (post.user_id !== userId) return { success: false, message: "Not your post" };
  if (post.is_public === 0) return { success: false, message: "Already private" };

  const updateResult = await db.prepare(`UPDATE users SET sparks_balance = sparks_balance - ? WHERE id = ? AND sparks_balance >= ? RETURNING sparks_balance`).bind(COST, userId, COST).first();
  if (!updateResult) return { success: false, message: "Not enough Sparks" };

  const txId = `tx_${Date.now()}_priv_${Math.random().toString(36).substring(7)}`;

  await db.batch([
    db.prepare("UPDATE posts SET is_public = 0 WHERE id = ?").bind(postId),
    db.prepare("INSERT INTO spark_transactions (id, user_id, amount, reason) VALUES (?, ?, ?, ?)").bind(txId, userId, -COST, 'Vault Privacy Lock')
  ]);

  revalidatePath("/dashboard/vault");
  return { success: true };
}

// 4. THE CREATOR DIVIDEND: LIKE (+1 Unclaimed Spark AND a Notification!)
export async function likePost(postId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  
  const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any as D1Database);

  const existingLike = await db.prepare("SELECT * FROM likes WHERE post_id = ? AND user_id = ?").bind(postId, userId).first();
  if (existingLike) return { success: false, message: "Already liked" };

  const post = await db.prepare("SELECT user_id FROM posts WHERE id = ?").bind(postId).first<{ user_id: string }>();
  if (!post) return { success: false, message: "Post not found" };

  const creatorId = post.user_id;

  if (creatorId === userId) {
     await db.prepare("INSERT INTO likes (user_id, post_id) VALUES (?, ?)").bind(userId, postId).run();
     return { success: true, message: "Liked own post (No dividend)" };
  }

  const notifId = `notif_${Date.now()}_like_${Math.random().toString(36).substring(7)}`;
  const message = "Someone liked your post!"; 

  await db.batch([
    db.prepare("INSERT INTO likes (user_id, post_id) VALUES (?, ?)").bind(userId, postId),
    db.prepare("UPDATE users SET unclaimed_sparks = unclaimed_sparks + 1 WHERE id = ?").bind(creatorId),
    db.prepare("INSERT INTO notifications (id, user_id, recipient_id, actor_id, type, message, post_id) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(notifId, creatorId, creatorId, userId, 'like', message, postId)
  ]);

  revalidatePath("/feed");
  return { success: true };
}

// 5. THE VIRAL LOOP: MOCK REMIX (+2 Unclaimed Sparks AND a Notification!)
export async function mockRemixPost(postId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  
  const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any as D1Database);
  const REMIX_COST = 10; 

  const post = await db.prepare("SELECT user_id, image_url, prompt_used, style_id FROM posts WHERE id = ?").bind(postId).first<{ user_id: string; image_url: string; prompt_used: string; style_id: string }>();
  if (!post) return { success: false, message: "Post not found" };

  const creatorId = post.user_id;

  const updateResult = await db.prepare(`UPDATE users SET sparks_balance = sparks_balance - ? WHERE id = ? AND sparks_balance >= ? RETURNING sparks_balance`).bind(REMIX_COST, userId, REMIX_COST).first();
  if (!updateResult) return { success: false, message: "Not enough Sparks to Remix" };

  const txIdCharge = `tx_${Date.now()}_remix_charge_${Math.random().toString(36).substring(7)}`;
  const newPostId = `post_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  const batch = [
    db.prepare("INSERT INTO spark_transactions (id, user_id, amount, reason) VALUES (?, ?, ?, ?)").bind(txIdCharge, userId, -REMIX_COST, 'Remixed a Style'),
    db.prepare("INSERT INTO posts (id, user_id, image_url, prompt_used, style_id, is_public) VALUES (?, ?, ?, ?, ?, ?)").bind(newPostId, userId, post.image_url, post.prompt_used, post.style_id, 1)
  ];

  if (creatorId !== userId) {
    const notifId = `notif_${Date.now()}_remix_${Math.random().toString(36).substring(7)}`;
    const message = "Someone remixed your style!"; 
    
    batch.push(db.prepare("UPDATE users SET unclaimed_sparks = unclaimed_sparks + 2 WHERE id = ?").bind(creatorId));
    batch.push(db.prepare("INSERT INTO notifications (id, user_id, recipient_id, actor_id, type, message, post_id) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(notifId, creatorId, creatorId, userId, 'remix', message, postId));
  }

  await db.batch(batch);

  revalidatePath("/feed");
  revalidatePath("/dashboard/vault");
  return { success: true };
}

// 6. DELETE POST (User Right to Deletion)
export async function deletePost(postId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  
  const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any as D1Database);

  const post = await db.prepare("SELECT user_id FROM posts WHERE id = ?").bind(postId).first<{ user_id: string }>();
  if (!post) return { success: false, message: "Post not found" };
  if (post.user_id !== userId) return { success: false, message: "Not your post" };

  await db.batch([
    db.prepare("DELETE FROM likes WHERE post_id = ?").bind(postId),
    db.prepare("DELETE FROM posts WHERE id = ?").bind(postId)
  ]);

  revalidatePath("/dashboard/vault");
  revalidatePath("/feed");
  return { success: true };
}

// 7. COMPLETE DYNAMIC TASK (Bounty)
export async function completeTask(taskId: string, submittedData: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any as D1Database);

  const task = await db.prepare("SELECT * FROM tasks WHERE id = ? AND is_active = 1").bind(taskId).first<{ reward_amount: number, title: string }>();
  if (!task) return { success: false, message: "Task not found or inactive" };

  const existing = await db.prepare("SELECT id FROM user_tasks WHERE user_id = ? AND task_id = ?").bind(userId, taskId).first();
  if (existing) return { success: false, message: "Bounty already claimed" };

  const userTaskId = `ut_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const txId = `tx_${Date.now()}_task_${Math.random().toString(36).substring(7)}`;

  await db.batch([
    db.prepare("INSERT INTO user_tasks (id, user_id, task_id, submitted_data) VALUES (?, ?, ?, ?)").bind(userTaskId, userId, taskId, submittedData),
    db.prepare("UPDATE users SET sparks_balance = sparks_balance + ? WHERE id = ?").bind(task.reward_amount, userId),
    db.prepare("INSERT INTO spark_transactions (id, user_id, amount, reason) VALUES (?, ?, ?, ?)").bind(txId, userId, task.reward_amount, `Bounty: ${task.title}`)
  ]);

  revalidatePath("/dashboard/sparks");
  return { success: true };
}

// 8. PROCESS REFERRAL
export async function processReferral(referralCode: string) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, message: "Unauthorized" };

    const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any as D1Database);

    const me = await db.prepare("SELECT id FROM users WHERE id = ?").bind(userId).first();
    if (!me) {
      return { success: false, message: "syncing" };
    }

    const existing = await db.prepare("SELECT id FROM referrals WHERE referred_user_id = ?").bind(userId).first();
    if (existing) return { success: false, message: "Already used a code" };

    const referrer = await db.prepare("SELECT id FROM users WHERE LOWER(referral_code) = LOWER(?) OR id = ?").bind(referralCode, referralCode).first<{ id: string }>();
    if (!referrer) return { success: false, message: "Invalid code" };

    if (referrer.id === userId) return { success: false, message: "Self referral" };

    const refId = `ref_${Date.now()}`;
    const txIdReferrer = `tx_${Date.now()}_ref_bonus_${Math.random().toString(36).substring(7)}`;
    const txIdNewbie = `tx_${Date.now()}_ref_welcome_${Math.random().toString(36).substring(7)}`;

    await db.batch([
      db.prepare("INSERT INTO referrals (id, referrer_id, referred_user_id) VALUES (?, ?, ?)").bind(refId, referrer.id, userId),
      
      db.prepare("UPDATE users SET sparks_balance = sparks_balance + 35 WHERE id = ?").bind(referrer.id),
      db.prepare("INSERT INTO spark_transactions (id, user_id, amount, reason) VALUES (?, ?, ?, ?)").bind(txIdReferrer, referrer.id, 35, 'Referral Bonus'),
      
      db.prepare("UPDATE users SET sparks_balance = sparks_balance + 20 WHERE id = ?").bind(userId),
      db.prepare("INSERT INTO spark_transactions (id, user_id, amount, reason) VALUES (?, ?, ?, ?)").bind(txIdNewbie, userId, 20, 'Invited by Friend Bonus')
    ]);

    revalidatePath("/dashboard/sparks");
    return { success: true, message: "Referral processed successfully" };
    
  } catch (error) {
    console.error("Referral Error:", error);
    return { success: false, message: "Database constraint error" };
  }
}

// 9. NEW: THE HARVEST (Zynga Mechanic)
export async function claimDividends() {
  const { userId } = await auth();
  if (!userId) return { success: false, message: "Unauthorized" };

  const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any as D1Database);

  const user = await db.prepare("SELECT unclaimed_sparks FROM users WHERE id = ?").bind(userId).first<{ unclaimed_sparks: number }>();

  if (!user || user.unclaimed_sparks <= 0) {
    return { success: false, message: "No Sparks to claim" };
  }

  const amountToClaim = user.unclaimed_sparks;
  const txId = `tx_${Date.now()}_claim_${Math.random().toString(36).substring(7)}`;

  await db.batch([
    db.prepare("UPDATE users SET sparks_balance = sparks_balance + ?, unclaimed_sparks = 0 WHERE id = ?").bind(amountToClaim, userId),
    db.prepare("INSERT INTO spark_transactions (id, user_id, amount, reason) VALUES (?, ?, ?, ?)").bind(txId, userId, amountToClaim, 'Harvested Creator Dividend')
  ]);

  revalidatePath("/dashboard/sparks");
  return { success: true, claimedAmount: amountToClaim };
}

// 10. PUBLISH POST TO FEED (Upsell Feature)
export async function publishPostToFeed(postId: string) {
  const { userId } = await auth();
  if (!userId) return { success: false, message: "Unauthorized" };

  const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any as D1Database);

  const post = await db.prepare("SELECT user_id, is_public FROM posts WHERE id = ?").bind(postId).first<{ user_id: string; is_public: number }>();
  
  if (!post) return { success: false, message: "Post not found" };
  if (post.user_id !== userId) return { success: false, message: "Not your post" };
  if (post.is_public === 1) return { success: false, message: "Already public" };

  // Flip it to public!
  await db.prepare("UPDATE posts SET is_public = 1 WHERE id = ?").bind(postId).run();

  // Force cache refresh so it appears immediately on the Explore feed
  revalidatePath("/explore");
  revalidatePath("/dashboard/vault");

  // Indexing priority: posts last (after styles/users)
  await enqueueIndexing(db, "post", `/post/${postId}`);
  await pingSitemaps();
  return { success: true };
}