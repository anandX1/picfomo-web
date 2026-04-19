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

  // 🌟 FIX: Removed the complex "LIKE" joins that caused the 500 error.
  // We now score purely on safe engagement metrics (Likes & Views).
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
      ) as interest_score
    FROM posts p
    LEFT JOIN styles s ON p.style_id = s.id
    LEFT JOIN users u ON p.user_id = u.id
    WHERE p.is_public = 1${whereExtra}
  `;

  const binds: any[] = [currentUserId];

  // 🌟 SEARCH FEATURE INTEGRATION
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
    console.error("Feed DB Error:", error);
    return [];
  }
}