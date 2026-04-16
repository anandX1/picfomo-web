"use server";

import { auth } from "@clerk/nextjs/server";


export async function fetchStoryStats() {
  const { userId } = await auth();
  if (!userId) return { sparks: 0, totalLikes: 0, totalPosts: 0 };

  try {
    const db = ((process.env as any).DB as D1Database);
    
    const batchResults = await db.batch([
      db.prepare("SELECT sparks_balance FROM users WHERE id = ?").bind(userId),
      db.prepare("SELECT COUNT(*) as total FROM likes INNER JOIN posts ON likes.post_id = posts.id WHERE posts.user_id = ?").bind(userId),
      db.prepare("SELECT COUNT(*) as total FROM posts WHERE user_id = ?").bind(userId)
    ]);

    return {
      sparks: (batchResults[0]?.results[0] as any)?.sparks_balance || 0,
      totalLikes: (batchResults[1]?.results[0] as any)?.total || 0,
      totalPosts: (batchResults[2]?.results[0] as any)?.total || 0,
    };
  } catch (error) {
    console.error("Story Stats Error:", error);
    return { sparks: 0, totalLikes: 0, totalPosts: 0 };
  }
}