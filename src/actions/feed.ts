"use server";

import { auth } from "@clerk/nextjs/server";

export async function fetchFeedChunk(
  offset: number,
  limit: number = 15,
  searchQuery: string = "",
  tab?: "trending" | "latest" | "portraits" | "art"
) {
  const { userId } = await auth();
  const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any as D1Database);
  
  const currentUserId = userId || 'guest';
  const activeTab = tab || "latest";

  // ============================================================================
  // 🌟 THE ALGORITHM: Exploration vs Exploitation (For Logged-in Users on Default Feed)
  // ============================================================================
  if (currentUserId !== 'guest' && !searchQuery && (activeTab === "latest" || activeTab === "trending")) {
    try {
      // STEP 1: Find the user's top 5 favorite styles
      const { results: interests } = await db.prepare(`
        SELECT p.style_id, COUNT(*) as score
        FROM likes l
        JOIN posts p ON p.id = l.post_id
        WHERE l.user_id = ? AND p.style_id IS NOT NULL
        GROUP BY p.style_id ORDER BY score DESC LIMIT 5
      `).bind(currentUserId).all();

      const topStyles = interests.map((r: any) => r.style_id);

      // If they have a history, run the personalized algorithm
      if (topStyles.length > 0) {
        const stylePlaceholders = topStyles.map(() => '?').join(',');
        
        // --- EXPLOITATION: Fetch top 12 highly personalized posts ---
        const personalizedQuery = `
          SELECT 
            p.id, p.image_url, p.user_id, p.created_at, p.tags, p.prompt_used,
            s.name as style_name,
            u.username, u.profile_image_url,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
            (SELECT COUNT(*) FROM post_views WHERE post_id = p.id) as views_count,
            0 as remix_count,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND user_id = ?) as is_liked_by_me,
            (
              CASE WHEN p.style_id IN (${stylePlaceholders}) THEN 30 ELSE 0 END
              + ((SELECT COUNT(*) FROM likes WHERE post_id = p.id) * 2)
              + CASE WHEN f.id IS NOT NULL THEN 20 ELSE 0 END
              - (CAST((julianday('now') - julianday(p.created_at)) AS INTEGER) * 2)
            ) as relevance_score,
            0 as is_wildcard
          FROM posts p
          LEFT JOIN styles s ON p.style_id = s.id
          LEFT JOIN users u ON p.user_id = u.id
          LEFT JOIN follows f ON f.following_id = p.user_id AND f.follower_id = ?
          WHERE p.is_public = 1 AND p.user_id != ?
          ORDER BY relevance_score DESC
          LIMIT 12 OFFSET ?
        `;
        
        const binds = [currentUserId, ...topStyles, currentUserId, currentUserId, offset];
        const { results: personalizedPosts } = await db.prepare(personalizedQuery).bind(...binds).all();

        // --- EXPLORATION: Fetch 3 Wildcard (New/Inefficient) Posts ---
        const existingIds = personalizedPosts.map((p: any) => p.id);
        // If no personalized posts found for some reason, just fallback to empty array for exclude logic
        const excludeIds = existingIds.length > 0 ? existingIds : ['dummy_id']; 
        const excludePlaceholders = excludeIds.map(() => '?').join(',');

        const wildcardQuery = `
          SELECT 
            p.id, p.image_url, p.user_id, p.created_at, p.tags, p.prompt_used,
            s.name as style_name,
            u.username, u.profile_image_url,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
            (SELECT COUNT(*) FROM post_views WHERE post_id = p.id) as views_count,
            0 as remix_count,
            0 as is_liked_by_me,
            0 as relevance_score,
            1 as is_wildcard
          FROM posts p
          LEFT JOIN styles s ON p.style_id = s.id
          LEFT JOIN users u ON p.user_id = u.id
          LEFT JOIN post_views pv ON pv.post_id = p.id AND pv.user_id = ?
          WHERE p.is_public = 1 
            AND p.user_id != ? 
            AND pv.id IS NULL -- User has NEVER seen this
            AND p.id NOT IN (${excludePlaceholders})
            AND (SELECT COUNT(*) FROM post_views WHERE post_id = p.id) < 50 -- Brand new content
          ORDER BY p.created_at DESC
          LIMIT 3
        `;

        const wildcardBinds = [currentUserId, currentUserId, ...excludeIds];
        const { results: wildcardPosts } = await db.prepare(wildcardQuery).bind(...wildcardBinds).all();

        // --- WEAVE THE FEED TOGETHER ---
        const mixedFeed = [...personalizedPosts];
        wildcardPosts.forEach((wildcard: any, index: number) => {
          // Inject wildcards at positions 3, 7, and 11 (0-indexed)
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
      // Fails silently and falls through to the Standard Query below
    }
  }

  // ============================================================================
  // 🌟 STANDARD QUERY: Guest Users, Search Results, & Specific Tabs
  // ============================================================================
  
  let orderBy = "p.created_at DESC";
  let whereExtra = "";

  if (activeTab === "trending") {
    orderBy = "((SELECT COUNT(*) FROM likes WHERE post_id = p.id) * 2 + (SELECT COUNT(*) FROM post_views WHERE post_id = p.id)) DESC, p.created_at DESC";
  }

  if (activeTab === "portraits") {
    whereExtra = " AND p.style_id != 'schnell'";
  }

  if (activeTab === "art") {
    whereExtra = " AND p.style_id = 'schnell'";
  }

  let baseQuery = `
    SELECT 
      p.id, p.image_url, p.user_id, p.created_at, p.tags, p.prompt_used,
      s.name as style_name,
      u.username, u.profile_image_url,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
      (SELECT COUNT(*) FROM post_views WHERE post_id = p.id) as views_count,
      0 as remix_count,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND user_id = ?) as is_liked_by_me,
      (
        ((SELECT COUNT(*) FROM likes WHERE post_id = p.id) * 10) + 
        ((SELECT COUNT(*) FROM post_views WHERE post_id = p.id) * 1)
      ) as interest_score,
      0 as is_wildcard
    FROM posts p
    LEFT JOIN styles s ON p.style_id = s.id
    LEFT JOIN users u ON p.user_id = u.id
    WHERE p.is_public = 1${whereExtra}
  `;

  const binds: any[] = [currentUserId === 'guest' ? 'none' : currentUserId];

  if (searchQuery && searchQuery.trim() !== "") {
    baseQuery += ` AND (LOWER(p.tags) LIKE LOWER(?) OR LOWER(p.prompt_used) LIKE LOWER(?) OR LOWER(u.username) LIKE LOWER(?))`;
    const searchWildcard = `%${searchQuery.trim()}%`;
    binds.push(searchWildcard, searchWildcard, searchWildcard);
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