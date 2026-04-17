import FeedClient from "./FeedClient";
import { auth } from "@clerk/nextjs/server";

export const revalidate = 0;

export default async function ExplorePage({ searchParams }: { searchParams: any }) {
  const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any as D1Database);
  const { userId } = await auth();

  // 1. Get the Viral Remix target if exists
  const remixId = searchParams.remix as string | undefined;
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

  // 🌟 THE PINTEREST-STYLE TAG ALGORITHM
  // This query finds posts that match tags the user has previously liked.
  const { results } = await db.prepare(`
    WITH UserInterests AS (
      -- Get all tags from posts this specific user has liked
      SELECT DISTINCT p.tags
      FROM likes l
      JOIN posts p ON l.post_id = p.id
      WHERE l.user_id = ?
    )
    SELECT 
      p.id, p.image_url, p.user_id, p.created_at, p.tags,
      s.name as style_name,
      u.username, u.profile_image_url,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
      (SELECT COUNT(*) FROM post_views WHERE post_id = p.id) as views_count,
      (SELECT COUNT(*) FROM posts WHERE prompt_used LIKE '%' || p.id || '%') as remix_count,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND user_id = ?) as is_liked_by_me,
      
      -- 🎯 THE SCORE CALCULATION
      (
        -- Global Engagement Base (Remixes are king)
        ((SELECT COUNT(*) FROM likes WHERE post_id = p.id) * 2) + 
        ((SELECT COUNT(*) FROM posts WHERE prompt_used LIKE '%' || p.id || '%') * 15) +
        
        -- Tag Matching Bonus (Pinterest Logic)
        -- If post tags overlap with user's liked tags, give +50 points
        CASE 
          WHEN EXISTS (SELECT 1 FROM UserInterests WHERE UserInterests.tags LIKE '%' || p.tags || '%') 
          THEN 50 ELSE 0 
        END
      ) as interest_score

    FROM posts p
    LEFT JOIN styles s ON p.style_id = s.id
    LEFT JOIN users u ON p.user_id = u.id
    WHERE p.is_public = 1
    ORDER BY interest_score DESC
    LIMIT 80
  `).bind(userId || 'guest', userId || 'guest').all();

  return (
    <FeedClient 
      initialPosts={results as any[]} 
      currentUserId={userId} 
      initialRemixData={targetRemixPost} 
    />
  );
}