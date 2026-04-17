"use server";

import { auth } from "@clerk/nextjs/server";

export async function fetchFeedChunk(offset: number, limit: number = 15) {
  const { userId } = await auth();
  const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any as D1Database);
  
  const currentUserId = userId || 'guest';

  // 🌟 THE PINTEREST-STYLE TAG ALGORITHM (Chunked)
  const { results } = await db.prepare(`
    WITH UserInterests AS (
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
      (
        ((SELECT COUNT(*) FROM likes WHERE post_id = p.id) * 2) + 
        ((SELECT COUNT(*) FROM posts WHERE prompt_used LIKE '%' || p.id || '%') * 15) +
        CASE 
          WHEN EXISTS (SELECT 1 FROM UserInterests WHERE UserInterests.tags LIKE '%' || p.tags || '%') 
          THEN 50 ELSE 0 
        END
      ) as interest_score
    FROM posts p
    LEFT JOIN styles s ON p.style_id = s.id
    LEFT JOIN users u ON p.user_id = u.id
    WHERE p.is_public = 1
    ORDER BY interest_score DESC, p.created_at DESC
    LIMIT ? OFFSET ?
  `).bind(currentUserId, currentUserId, limit, offset).all();

  return results as any[];
}