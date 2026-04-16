
import FeedClient from "./FeedClient";
import { auth } from "@clerk/nextjs/server";


export const revalidate = 0;

export default async function ExplorePage() {
  const db = ((process.env as any).DB as D1Database);
  const { userId } = await auth();

  // THE FIX: Added 'is_liked_by_me' to the query to prevent fake red hearts and spamming
  const { results } = await db.prepare(`
    SELECT 
      posts.id, 
      posts.image_url, 
      posts.user_id, 
      posts.created_at,
      styles.name as style_name,
      users.username,
      users.profile_image_url,
      (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) as likes_count,
      (SELECT COUNT(*) FROM post_views WHERE post_views.post_id = posts.id) as views_count,
      (SELECT COUNT(*) FROM follows WHERE follows.following_id = posts.user_id) as followers_count,
      (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id AND likes.user_id = ?) as is_liked_by_me
    FROM posts
    LEFT JOIN styles ON posts.style_id = styles.id
    LEFT JOIN users ON posts.user_id = users.id
    WHERE posts.is_public = 1
    ORDER BY 
      ((SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) * 10) / 
      ((cast(julianday('now') - julianday(posts.created_at) as real) * 24) + 2.0) * ((cast(julianday('now') - julianday(posts.created_at) as real) * 24) + 2.0) DESC
    LIMIT 50
  `).bind(userId || 'guest').all();

  const posts = results as any[];

  async function handleInject() {
    "use server";
    console.log("Injecting test asset...");
  }

  return (
    <FeedClient 
      initialPosts={posts} 
      currentUserId={userId} 
      injectAction={handleInject}
    />
  );
}