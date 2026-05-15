"use server";

import { auth } from "@clerk/nextjs/server";

export async function fetchFeedChunk(
  offset: number,
  limit: number = 15,
  searchQuery: string = "",
  tab?: "trending" | "latest" | "portraits" | "art",
  interests: string[] = []
) {
  const { userId } = await auth();
  const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any as D1Database);
  
  const currentUserId = userId || 'guest';
  const activeTab = tab || "latest";

  // ============================================================================
  // 🌟 THE ALGORITHM: Exploration vs Exploitation (For Logged-in Users)
  // ============================================================================
  if (currentUserId !== 'guest' && !searchQuery && (activeTab === "latest" || activeTab === "trending")) {
    try {
      const { results: interests } = await db.prepare(`
        SELECT p.style_id, COUNT(*) as score
        FROM likes l
        JOIN posts p ON p.id = l.post_id
        WHERE l.user_id = ? AND p.style_id IS NOT NULL
        GROUP BY p.style_id ORDER BY score DESC LIMIT 5
      `).bind(currentUserId).all();

      const topStyles = interests.map((r: any) => r.style_id);

      if (topStyles.length > 0 || interests.length > 0) {
        // 🌟 MERGE INTERESTS: Session interests take priority for "The Hook"
        const mergedStyles = Array.from(new Set([...interests, ...topStyles])).slice(0, 10);
        const stylePlaceholders = mergedStyles.map(() => '?').join(',');
        
        // 🌟 MASSIVE FIX: Using grouped LEFT JOINs stops D1 from reading 500k rows!
        const personalizedQuery = `
          SELECT 
            p.id, p.image_url, p.user_id, p.created_at, p.tags, p.prompt_used, p.style_id,
            p.title, p.description,
            s.name as style_name, u.username, u.profile_image_url,
            COALESCE(l.likes_count, 0) as likes_count,
            COALESCE(v.views_count, 0) as views_count,
            0 as remix_count,
            CASE WHEN my_l.post_id IS NOT NULL THEN 1 ELSE 0 END as is_liked_by_me,
            (
              CASE WHEN p.style_id IN (${stylePlaceholders}) THEN 50 ELSE 0 END
              + (COALESCE(l.likes_count, 0) * 2)
              + CASE WHEN f.id IS NOT NULL THEN 20 ELSE 0 END
              - (CAST((julianday('now') - julianday(p.created_at)) AS INTEGER) * 1)
            ) as relevance_score,
            0 as is_wildcard
          FROM posts p
          LEFT JOIN styles s ON p.style_id = s.id
          LEFT JOIN users u ON p.user_id = u.id
          LEFT JOIN (SELECT post_id, COUNT(*) as likes_count FROM likes GROUP BY post_id) l ON p.id = l.post_id
          LEFT JOIN (SELECT post_id, COUNT(*) as views_count FROM post_views GROUP BY post_id) v ON p.id = v.post_id
          LEFT JOIN likes my_l ON my_l.post_id = p.id AND my_l.user_id = ?
          LEFT JOIN follows f ON f.following_id = p.user_id AND f.follower_id = ?
          WHERE p.is_public = 1 AND p.user_id != ?
          ORDER BY relevance_score DESC
          LIMIT 12 OFFSET ?
        `;
        
        const binds = [currentUserId, ...mergedStyles, currentUserId, currentUserId, currentUserId, offset];
        const { results: personalizedPosts } = await db.prepare(personalizedQuery).bind(...binds).all();

        const existingIds = personalizedPosts.map((p: any) => p.id);
        const excludeIds = existingIds.length > 0 ? existingIds : ['dummy_id']; 
        const excludePlaceholders = excludeIds.map(() => '?').join(',');

        const wildcardQuery = `
          SELECT 
            p.id, p.image_url, p.user_id, p.created_at, p.tags, p.prompt_used, p.style_id,
            p.title, p.description,
            s.name as style_name, u.username, u.profile_image_url,
            COALESCE(l.likes_count, 0) as likes_count,
            COALESCE(v.views_count, 0) as views_count,
            0 as remix_count, 0 as is_liked_by_me, 0 as relevance_score,
            1 as is_wildcard
          FROM posts p
          LEFT JOIN styles s ON p.style_id = s.id
          LEFT JOIN users u ON p.user_id = u.id
          LEFT JOIN (SELECT post_id, COUNT(*) as likes_count FROM likes GROUP BY post_id) l ON p.id = l.post_id
          LEFT JOIN (SELECT post_id, COUNT(*) as views_count FROM post_views GROUP BY post_id) v ON p.id = v.post_id
          LEFT JOIN post_views pv ON pv.post_id = p.id AND pv.user_id = ?
          WHERE p.is_public = 1 AND p.user_id != ? AND pv.id IS NULL 
            AND p.id NOT IN (${excludePlaceholders})
            AND COALESCE(v.views_count, 0) < 50 
          ORDER BY p.created_at DESC
          LIMIT 3
        `;

        const wildcardBinds = [currentUserId, currentUserId, ...excludeIds];
        const { results: wildcardPosts } = await db.prepare(wildcardQuery).bind(...wildcardBinds).all();

        const mixedFeed = [...personalizedPosts];
        wildcardPosts.forEach((wildcard: any, index: number) => {
          const insertAt = (index + 1) * 4 - 1; 
          if (insertAt < mixedFeed.length) {
            mixedFeed.splice(insertAt, 0, wildcard);
          } else {
            mixedFeed.push(wildcard);
          }
        });

        return mixedFeed;
      }
    } catch (error) {
      console.error("Algorithm Engine Error:", error);
    }
  }

  // ============================================================================
  // 🌟 STANDARD QUERY: Guest Users, Search Results, & Specific Tabs
  // ============================================================================
  
  let orderBy = "p.created_at DESC";
  let whereExtra = "";

  if (activeTab === "trending") {
    orderBy = "(COALESCE(l.likes_count, 0) * 2 + COALESCE(v.views_count, 0)) DESC, p.created_at DESC";
  }

  if (activeTab === "portraits") whereExtra = " AND p.style_id != 'schnell'";
  if (activeTab === "art") whereExtra = " AND p.style_id = 'schnell'";

  let baseQuery = `
    SELECT 
      p.id, p.image_url, p.user_id, p.created_at, p.tags, p.prompt_used, p.style_id,
      p.title, p.description,
      s.name as style_name, u.username, u.profile_image_url,
      COALESCE(l.likes_count, 0) as likes_count,
      COALESCE(v.views_count, 0) as views_count,
      0 as remix_count,
      CASE WHEN my_l.post_id IS NOT NULL THEN 1 ELSE 0 END as is_liked_by_me,
      ((COALESCE(l.likes_count, 0) * 10) + (COALESCE(v.views_count, 0) * 1)) as interest_score,
      0 as is_wildcard
    FROM posts p
    LEFT JOIN styles s ON p.style_id = s.id
    LEFT JOIN users u ON p.user_id = u.id
    LEFT JOIN (SELECT post_id, COUNT(*) as likes_count FROM likes GROUP BY post_id) l ON p.id = l.post_id
    LEFT JOIN (SELECT post_id, COUNT(*) as views_count FROM post_views GROUP BY post_id) v ON p.id = v.post_id
    LEFT JOIN likes my_l ON my_l.post_id = p.id AND my_l.user_id = ?
    WHERE p.is_public = 1${whereExtra}
  `;

  const binds: any[] = [currentUserId === 'guest' ? 'none' : currentUserId];

  if (searchQuery && searchQuery.trim() !== "") {
    baseQuery += ` AND (LOWER(p.tags) LIKE LOWER(?) OR LOWER(p.prompt_used) LIKE LOWER(?) OR LOWER(p.title) LIKE LOWER(?) OR LOWER(u.username) LIKE LOWER(?))`;
    const searchWildcard = `%${searchQuery.trim()}%`;
    binds.push(searchWildcard, searchWildcard, searchWildcard, searchWildcard);
  }

  baseQuery += ` ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
  binds.push(limit, offset);

  try {
    const { results } = await db.prepare(baseQuery).bind(...binds).all();
    return results as any[];
  } catch (error) {
    console.error("Standard Feed DB Error:", error);
    return [];
  }
}