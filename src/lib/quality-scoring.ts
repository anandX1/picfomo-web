import { unstable_cache } from 'next/cache';
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Calculates a dynamic quality score for a programmatic node.
 * Used to determine whether a page should be indexed, canonicalized, or noindexed 
 * by evaluating Information Gain (unique images) and freshness.
 */
export async function calculateNodeQuality(slug: string, type: string = 'use-case'): Promise<number> {
  let score = 0;
  
  try {
    const envCtx = await getCloudflareContext({ async: true });
    const db = envCtx.env.DB as any;
    if (!db) return 50; // Safe default if DB is unreachable

    // 1. Fetch Entity Data
    const entity = await db.prepare("SELECT id, is_active FROM p_entities WHERE slug = ? AND type = ?").bind(slug, type).first();
    if (!entity || !entity.is_active) return 0; // Toxic/Inactive node
    
    // Base score for existing
    score += 20;

    // 2. Fetch Proof Count (Information Gain)
    // We check how many unique posts are associated with this entity's styles
    const proofCount = await db.prepare(`
      SELECT COUNT(*) as cnt FROM posts p
      JOIN p_entity_styles es ON p.style_id = es.style_id
      WHERE es.entity_id = ? AND p.is_public = 1
    `).bind(entity.id).first('cnt');

    const postsCount = (proofCount as number) || 0;

    // Scoring logic for images
    if (postsCount >= 12) score += 40; // Elite Information Gain
    else if (postsCount >= 6) score += 20; // Moderate Information Gain
    else score += 0; // Thin content warning

    // 3. Uniqueness Check
    // If the images are heavily reused across many entities, the score is lower.
    // (This is a simplified representation of the complex uniqueness query)
    const uniquePostsQuery = await db.prepare(`
        SELECT COUNT(p.id) as unique_cnt
        FROM posts p
        JOIN p_entity_styles es ON p.style_id = es.style_id
        WHERE es.entity_id = ? AND p.is_public = 1
        AND (SELECT COUNT(*) FROM p_entity_styles WHERE style_id = p.style_id) < 5
    `).bind(entity.id).first('unique_cnt');
    
    const uniqueCount = (uniquePostsQuery as number) || 0;
    if (uniqueCount >= 6) score += 20;

    // 4. Freshness
    // Are there recent posts?
    const freshnessQuery = await db.prepare(`
        SELECT created_at FROM posts p
        JOIN p_entity_styles es ON p.style_id = es.style_id
        WHERE es.entity_id = ? AND p.is_public = 1
        ORDER BY created_at DESC LIMIT 1
    `).bind(entity.id).first('created_at');

    if (freshnessQuery) {
        const daysOld = (Date.now() - new Date(freshnessQuery as string).getTime()) / (1000 * 3600 * 24);
        if (daysOld < 7) score += 20; // High freshness
        else if (daysOld < 30) score += 10;
    }

    return score;
  } catch (error) {
    console.error("Quality Scoring Error:", error);
    return 50; // Safe fallback
  }
}
