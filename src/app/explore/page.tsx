import FeedClient from "./FeedClient";
import { auth } from "@clerk/nextjs/server";
import { fetchFeedChunk } from "@/actions/feed"; // 🌟 NEW IMPORT

export const revalidate = 0;

export default async function ExplorePage({ searchParams }: { searchParams: any }) {
  const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any as D1Database);
  const { userId } = await auth();

  // Handle Collab Target
  const remixId = searchParams?.remix as string | undefined;
  let targetRemixPost = null;
  if (remixId) {
    targetRemixPost = await db.prepare(`
      SELECT posts.id, posts.image_url, styles.name as style_name, users.username
      FROM posts 
      LEFT JOIN styles ON posts.style_id = styles.id
      LEFT JOIN users ON posts.user_id = users.id
      WHERE posts.id = ?
    `).bind(remixId).first();
  }

  // 🌟 Grab the first chunk (Offset 0, Limit 15)
  const initialPosts = await fetchFeedChunk(0, 15);

  return (
    <FeedClient 
      initialPosts={initialPosts} 
      currentUserId={userId} 
      initialRemixData={targetRemixPost} 
    />
  );
}