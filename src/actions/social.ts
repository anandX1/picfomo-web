"use server";

import { auth } from "@clerk/nextjs/server";

import { revalidatePath } from "next/cache";

// 1. TOGGLE FOLLOW STATUS
export async function toggleFollow(targetUserId: string) {
  const { userId } = await auth();
  if (!userId) return { success: false, message: "Must be logged in to follow." };
  if (userId === targetUserId) return { success: false, message: "You cannot follow yourself." };

  const db = ((process.env as any).DB as D1Database);

  try {
    const existing = await db.prepare("SELECT * FROM follows WHERE follower_id = ? AND following_id = ?")
      .bind(userId, targetUserId).first();

    if (existing) {
      await db.prepare("DELETE FROM follows WHERE follower_id = ? AND following_id = ?")
        .bind(userId, targetUserId).run();
      revalidatePath("/u/[username]", "page");
      return { success: true, isFollowing: false };
    } else {
      await db.prepare("INSERT INTO follows (follower_id, following_id) VALUES (?, ?)")
        .bind(userId, targetUserId).run();
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
  if (!userId) return { success: false }; // Only track logged-in views for now

  const db = ((process.env as any).DB as D1Database);

  try {
    // INSERT OR IGNORE prevents the app from crashing if they already viewed it
    await db.prepare("INSERT OR IGNORE INTO post_views (post_id, user_id) VALUES (?, ?)")
      .bind(postId, userId).run();
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}