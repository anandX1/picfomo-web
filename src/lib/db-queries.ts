import { unstable_cache } from 'next/cache';
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { CACHE_TAGS, REVALIDATE_TIMERS } from './cache';

/**
 * 🌟 PICFOMO SEMANTIC QUERY ENGINE
 * Wraps Cloudflare D1 calls in Next.js unstable_cache for sub-100ms TTFB.
 */

export const getProgrammaticEntity = unstable_cache(
  async (type: string, slug: string) => {
    try {
      const envCtx = await getCloudflareContext({ async: true });
      const db = envCtx.env.DB as any;
      if (!db) return null;

      const entity = await db.prepare(
        "SELECT * FROM p_entities WHERE type = ? AND slug = ? AND is_active = 1"
      ).bind(type, slug).first();
      
      if (!entity) return null;

      // Fetch mapped styles
      const { results: styleMap } = await db.prepare(
        "SELECT style_id FROM p_entity_styles WHERE entity_id = ?"
      ).bind(entity.id).all();
      
      const mappedStyles = styleMap.map((r: any) => r.style_id);

      // Parse JSON fields safely
      let faqs = [];
      try { faqs = JSON.parse((entity.schema_faqs as string) || '[]'); } catch (e) {}

      return {
        ...entity,
        faqs,
        mappedStyles
      };
    } catch (e) {
      console.error(`DB Error getProgrammaticEntity(${type}, ${slug}):`, e);
      return null;
    }
  },
  ['programmatic-entity'],
  { revalidate: 3600, tags: ['programmatic'] }
);

export const getRelatedPostsForEntity = unstable_cache(
  async (entityId: string, limit: number = 12) => {
    try {
      const envCtx = await getCloudflareContext({ async: true });
      const db = envCtx.env.DB as any;
      if (!db) return [];

      const { results } = await db.prepare(`
        SELECT p.id, p.image_url, p.title, u.username 
        FROM posts p
        JOIN users u ON p.user_id = u.id
        JOIN p_entity_styles es ON p.style_id = es.style_id
        WHERE es.entity_id = ? AND p.is_public = 1
        ORDER BY p.created_at DESC
        LIMIT ?
      `).bind(entityId, limit).all();

      return results;
    } catch (e) {
      console.error(`DB Error getRelatedPostsForEntity:`, e);
      return [];
    }
  },
  ['entity-posts'],
  { revalidate: 3600, tags: ['posts', 'programmatic'] }
);

export const getRelatedEntities = unstable_cache(
  async (entityId: string, limit: number = 5) => {
    try {
      const envCtx = await getCloudflareContext({ async: true });
      const db = envCtx.env.DB as any;
      if (!db) return [];

      const { results } = await db.prepare(`
        SELECT e.name, e.slug, e.type 
        FROM p_entities e
        JOIN p_entity_edges edge ON e.id = edge.target_id
        WHERE edge.source_id = ? AND e.is_active = 1
        ORDER BY edge.weight DESC LIMIT ?
      `).bind(entityId, limit).all();

      return results;
    } catch (e) {
      console.error(`DB Error getRelatedEntities:`, e);
      return [];
    }
  },
  ['related-entities'],
  { revalidate: 86400, tags: ['programmatic'] }
);

export const getActiveStyles = unstable_cache(
  async () => {
    try {
      const envCtx = await getCloudflareContext({ async: true });
      const db = envCtx.env.DB as any;
      if (!db) return [];

      const { results } = await db.prepare(
        "SELECT id, name, description, spark_cost, preview_image_url, preview_urls, badge FROM styles WHERE is_active = 1 AND id != 'schnell' ORDER BY sort_order ASC, created_at DESC"
      ).all();

      return results.map((style: any) => {
        let images: string[] = [];
        try { images = JSON.parse(style.preview_urls || '[]'); } catch(e) {}
        return { ...style, preview_image_url: images[0] || style.preview_image_url };
      });
    } catch (e) {
      console.error('getActiveStyles cache error:', e);
      return [];
    }
  },
  ['active-styles'],
  {
    revalidate: REVALIDATE_TIMERS.homepage,
    tags: [CACHE_TAGS.styles]
  }
);

export const getRemixPost = unstable_cache(
  async (remixId: string) => {
    try {
      const envCtx = await getCloudflareContext({ async: true });
      const db = envCtx.env.DB as any;
      if (!db || !remixId) return null;

      return await db.prepare(`
        SELECT posts.id, posts.image_url, styles.name as style_name, users.username
        FROM posts 
        LEFT JOIN styles ON posts.style_id = styles.id
        LEFT JOIN users ON posts.user_id = users.id
        WHERE posts.id = ?
      `).bind(remixId).first();
    } catch (e) {
      console.error('getRemixPost cache error:', e);
      return null;
    }
  },
  ['remix-post'],
  {
    revalidate: REVALIDATE_TIMERS.post,
    tags: [CACHE_TAGS.posts]
  }
);

export const getExploreFeed = unstable_cache(
  async (offset: number = 0, limit: number = 15) => {
    try {
      const envCtx = await getCloudflareContext({ async: true });
      const db = envCtx.env.DB as any;
      if (!db) return [];

      const query = `
        SELECT 
          p.id, p.image_url, p.user_id, p.created_at, p.style_id,
          p.title, p.description,
          s.name as style_name, u.username, u.profile_image_url,
          COALESCE(l.likes_count, 0) as likes_count,
          COALESCE(v.views_count, 0) as views_count,
          0 as remix_count,
          0 as is_liked_by_me,
          0 as is_wildcard
        FROM posts p
        LEFT JOIN styles s ON p.style_id = s.id
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN (SELECT post_id, COUNT(*) as likes_count FROM likes GROUP BY post_id) l ON p.id = l.post_id
        LEFT JOIN (SELECT post_id, COUNT(*) as views_count FROM post_views GROUP BY post_id) v ON p.id = v.post_id
        WHERE p.is_public = 1
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
      `;

      const { results } = await db.prepare(query).bind(limit, offset).all();
      return results as any[];
    } catch (e) {
      console.error('getExploreFeed cache error:', e);
      return [];
    }
  },
  ['explore-feed-guest'],
  {
    revalidate: REVALIDATE_TIMERS.explore,
    tags: [CACHE_TAGS.posts]
  }
);

export const getStyleSpecificPosts = unstable_cache(
  async (cleanName: string) => {
    try {
      const envCtx = await getCloudflareContext({ async: true });
      const db = envCtx.env.DB as any;
      if (!db) return [];

      const { results } = await db.prepare(`
        SELECT posts.id, posts.image_url, posts.title, users.username, users.display_name,
        (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) as likes_count
        FROM posts 
        JOIN users ON posts.user_id = users.id
        LEFT JOIN styles ON posts.style_id = styles.id
        WHERE posts.is_public = 1 AND (LOWER(styles.name) LIKE ? OR LOWER(posts.tags) LIKE ?)
        ORDER BY posts.created_at DESC
        LIMIT 16
      `).bind(`%${cleanName.toLowerCase()}%`, `%${cleanName.toLowerCase()}%`).all();

      return results;
    } catch (e) {
      console.error('getStyleSpecificPosts cache error:', e);
      return [];
    }
  },
  ['style-posts'],
  {
    revalidate: REVALIDATE_TIMERS.style,
    tags: [CACHE_TAGS.posts, CACHE_TAGS.styles]
  }
);

export const getSinglePost = unstable_cache(
  async (postId: string) => {
    try {
      const envCtx = await getCloudflareContext({ async: true });
      const db = envCtx.env.DB as any;
      if (!db) return null;

      return await db.prepare(`
        SELECT 
          posts.id, posts.image_url, posts.created_at, posts.prompt_used, posts.user_id as creator_id,
          posts.title, posts.description, posts.tags,
          users.username, users.display_name, users.profile_image_url,
          styles.name as style_name,
          (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) as likes_count,
          (SELECT COUNT(*) FROM post_views WHERE post_views.post_id = posts.id) as views_count,
          (SELECT COUNT(*) FROM follows WHERE follows.following_id = posts.user_id) as followers_count
        FROM posts
        JOIN users ON posts.user_id = users.id
        LEFT JOIN styles ON posts.style_id = styles.id
        WHERE posts.id = ? AND posts.is_public = 1
      `).bind(postId).first<any>();
    } catch (e) {
      console.error('getSinglePost cache error:', e);
      return null;
    }
  },
  ['single-post'],
  {
    revalidate: REVALIDATE_TIMERS.post,
    tags: [CACHE_TAGS.posts]
  }
);

export const getRecommendedStyles = unstable_cache(
  async (styleIds: string[]) => {
    try {
      const envCtx = await getCloudflareContext({ async: true });
      const db = envCtx.env.DB as any;
      if (!db || styleIds.length === 0) return [];

      const placeholders = styleIds.map(() => '?').join(',');
      const { results } = await db.prepare(
          `SELECT id, name, slug, description, preview_image_url FROM styles WHERE slug IN (${placeholders}) OR id IN (${placeholders})`
      ).bind(...styleIds, ...styleIds).all();

      return results;
    } catch (e) {
      console.error('getRecommendedStyles cache error:', e);
      return [];
    }
  },
  ['recommended-styles'],
  {
    revalidate: REVALIDATE_TIMERS.useCase,
    tags: [CACHE_TAGS.styles]
  }
);

export const getUseCasePosts = unstable_cache(
  async (styleIds: string[]) => {
    try {
      const envCtx = await getCloudflareContext({ async: true });
      const db = envCtx.env.DB as any;
      if (!db || styleIds.length === 0) return [];

      const placeholders = styleIds.map(() => '?').join(',');
      const { results } = await db.prepare(`
        SELECT posts.id, posts.image_url, posts.title, users.username, users.display_name
        FROM posts 
        JOIN users ON posts.user_id = users.id
        LEFT JOIN styles ON posts.style_id = styles.id
        WHERE posts.is_public = 1 AND (styles.slug IN (${placeholders}) OR styles.id IN (${placeholders}))
        ORDER BY posts.created_at DESC
        LIMIT 12
      `).bind(...styleIds, ...styleIds).all();

      return results;
    } catch (e) {
      console.error('getUseCasePosts cache error:', e);
      return [];
    }
  },
  ['use-case-posts'],
  {
    revalidate: REVALIDATE_TIMERS.useCase,
    tags: [CACHE_TAGS.posts, CACHE_TAGS.styles]
  }
);

export const getPublicPostCount = unstable_cache(
  async () => {
    try {
      const envCtx = await getCloudflareContext({ async: true });
      const db = envCtx.env.DB as any;
      if (!db) return 0;

      const result = await db.prepare("SELECT COUNT(*) as count FROM posts WHERE is_public = 1").first('count');
      return result || 0;
    } catch (e) {
      console.error('getPublicPostCount cache error:', e);
      return 0;
    }
  },
  ['public-post-count'],
  {
    revalidate: 3600, // Sync with sitemap revalidation
    tags: [CACHE_TAGS.posts]
  }
);

export const getGlobalSemanticLinks = unstable_cache(
  async () => {
    try {
      const envCtx = await getCloudflareContext({ async: true });
      const db = envCtx.env.DB as any;
      if (!db) return [];

      // 🌟 SEMANTIC TRIANGULATION: Fetch all active retrieval surfaces
      const { results } = await db.prepare(`
        SELECT name as keyword, slug, type FROM p_entities WHERE is_active = 1
        UNION ALL
        SELECT term as keyword, slug, 'glossary' as type FROM (
            -- This handles the case where glossary terms aren't in p_entities yet
            SELECT 'Identity-Lock' as term, 'identity-lock' as slug
            UNION SELECT 'PuLID', 'pulid'
            UNION SELECT 'SDXL', 'sdxl'
        )
      `).all();

      return results.map((r: any) => ({
        keyword: r.keyword,
        url: r.type === 'glossary' ? `/glossary/${r.slug}` : `/${r.type}/${r.slug}`
      })).sort((a, b) => b.keyword.length - a.keyword.length); // Prevents partial match hijacking
    } catch (e) {
      console.error('getGlobalSemanticLinks error:', e);
      return [];
    }
  },
  ['global-semantic-links'],
  { revalidate: 86400, tags: ['programmatic'] }
);
