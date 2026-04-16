"use server";

import { auth } from "@clerk/nextjs/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { revalidatePath } from "next/cache";

export async function likePost(postId: string) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("You must be logged in to like a post.");
  }

  const db = getRequestContext().env.DB;

  // 1. Check if the user already liked this post (Prevent double-liking)
  const existingLike = await db
    .prepare("SELECT * FROM likes WHERE user_id = ? AND post_id = ?")
    .bind(userId, postId)
    .first();

  if (existingLike) {
    return { success: false, message: "Already liked" };
  }

  // 2. Find the post to see who created it
  const post = await db
    .prepare("SELECT user_id FROM posts WHERE id = ?")
    .bind(postId)
    .first<{ user_id: string }>();

  if (!post) {
    throw new Error("Post not found");
  }

  const creatorId = post.user_id;

  // 3. Prepare the Database Batch Transaction
  const txId = `tx_${Date.now()}_like_${Math.random().toString(36).substring(7)}`;

  // These two happen no matter what
  const statements = [
    db.prepare("INSERT INTO likes (user_id, post_id) VALUES (?, ?)").bind(userId, postId),
    db.prepare("UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?").bind(postId),
  ];

  // 4. THE CREATOR DIVIDEND (+1 Spark)
  // We only pay the creator if the person liking the post is NOT the creator.
  if (userId !== creatorId) {
    statements.push(
      db.prepare("UPDATE users SET sparks_balance = sparks_balance + 1 WHERE id = ?").bind(creatorId),
      db.prepare("INSERT INTO spark_transactions (id, user_id, amount, reason, ref_id) VALUES (?, ?, ?, ?, ?)").bind(txId, creatorId, 1, 'Post Liked', postId)
    );
  }

  // 5. Execute everything at the exact same time
  await db.batch(statements);

  // 6. Tell Next.js to refresh the page so the Like counter instantly ticks up
  revalidatePath("/");
  revalidatePath("/dashboard/feed");

  return { success: true };
}