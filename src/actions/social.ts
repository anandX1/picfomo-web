"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// 1. TOGGLE FOLLOW STATUS
export async function toggleFollow(targetUserId: string) {
  const { userId } = await auth();
  if (!userId) return { success: false, message: "Must be logged in to follow." };
  if (userId === targetUserId) return { success: false, message: "You cannot follow yourself." };

  const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any as D1Database);

  try {
    const existing = await db.prepare("SELECT * FROM follows WHERE follower_id = ? AND following_id = ?")
      .bind(userId, targetUserId).first();

    if (existing) {
      await db.prepare("DELETE FROM follows WHERE follower_id = ? AND following_id = ?")
        .bind(userId, targetUserId).run();
      revalidatePath("/u/[username]", "page");
      return { success: true, isFollowing: false };
    } else {
      const notifId = `notif_${Date.now()}_follow_${Math.random().toString(36).substring(7)}`;
      const message = "Someone started following you!";
      
      // 🌟 FIX: Added notification insert so the Bell actually rings!
      await db.batch([
        db.prepare("INSERT INTO follows (follower_id, following_id) VALUES (?, ?)").bind(userId, targetUserId),
        db.prepare("INSERT INTO notifications (id, user_id, recipient_id, actor_id, type, message) VALUES (?, ?, ?, ?, ?, ?)")
          .bind(notifId, targetUserId, targetUserId, userId, 'follow', message)
      ]);
      
      revalidatePath("/u/[username]", "page");
      return { success: true, isFollowing: true };
    }
  } catch (error) {
    return { success: false, message: "Database error." };
  }
}

// 2. RECORD UNIQUE VIEW
export async function recordView(postId: string) {
  const { userId } = await auth();
  if (!userId) return { success: false };

  const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any as D1Database);

  try {
    await db.prepare("INSERT OR IGNORE INTO post_views (post_id, user_id) VALUES (?, ?)").bind(postId, userId).run();
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}