# D1 Database Implementation Layer

## 1. Relational Schema Architecture
To escape static arrays, we deploy a normalized, highly relational schema optimized for semantic edge traversal.

```sql
-- The Universal Entity Table (Handles Use-Cases, Platforms, Aesthetics, Problems)
CREATE TABLE p_entities (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL, -- 'use-case', 'platform', 'aesthetic', 'identity', 'problem'
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    meta_description TEXT,
    h1_formula TEXT,
    emotional_hook TEXT,
    schema_faqs TEXT, -- JSON Array
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_p_entities_type_slug ON p_entities(type, slug);

-- The Competitor Transactional Matrix
CREATE TABLE p_comparisons (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    competitor_name TEXT NOT NULL,
    picfomo_speed TEXT,
    competitor_speed TEXT,
    picfomo_cost TEXT,
    competitor_cost TEXT,
    picfomo_input TEXT,
    competitor_input TEXT,
    picfomo_accuracy TEXT,
    competitor_accuracy TEXT,
    llm_markdown_bait TEXT
);

-- Semantic Relationship Edge Table (Graph Links)
CREATE TABLE p_entity_edges (
    source_id TEXT,
    target_id TEXT,
    weight INTEGER DEFAULT 1, -- Determines ranking in "Related" widgets
    PRIMARY KEY (source_id, target_id)
);
CREATE INDEX idx_p_edges_source ON p_entity_edges(source_id);

-- Mapping Programmatic Entities to Visual Styles
CREATE TABLE p_entity_styles (
    entity_id TEXT,
    style_id TEXT,
    PRIMARY KEY (entity_id, style_id)
);
```

## 2. Query Optimization Patterns & `unstable_cache`
All edge queries must utilize `unstable_cache` with strict try/catch blocks to ensure 100% uptime for Googlebot, even during Cloudflare API turbulence.

```typescript
import { unstable_cache } from 'next/cache';

export const getProgrammaticEntity = unstable_cache(
  async (type: string, slug: string) => {
    try {
      const db = await getD1();
      return await db.prepare(
        "SELECT * FROM p_entities WHERE type = ? AND slug = ? AND is_active = 1"
      ).bind(type, slug).first();
    } catch (e) {
      console.error(`DB Error getProgrammaticEntity(${type}, ${slug}):`, e);
      return null; // Fallback prevents 500 error cascade
    }
  },
  ['programmatic-entity'],
  { revalidate: 3600, tags: ['programmatic'] }
);

export const getRelatedPostsForEntity = unstable_cache(
  async (entityId: string, limit: number = 12) => {
    try {
      const db = await getD1();
      // Join through the styles mapping to find relevant user posts
      return await db.prepare(`
        SELECT p.id, p.image_url, p.title, u.username 
        FROM posts p
        JOIN users u ON p.user_id = u.id
        JOIN p_entity_styles es ON p.style_id = es.style_id
        WHERE es.entity_id = ? AND p.is_public = 1
        ORDER BY p.created_at DESC
        LIMIT ?
      `).bind(entityId, limit).all();
    } catch (e) {
      console.error(`DB Error getRelatedPostsForEntity:`, e);
      return { results: [] }; // Safe fallback
    }
  },
  ['entity-posts'],
  { revalidate: 3600, tags: ['posts', 'programmatic'] }
);
```

## 3. Freshness & Trending Systems
Google de-indexes programmatic pages that decay.
* **The Freshness Injection:** Because `getRelatedPostsForEntity` pulls `ORDER BY p.created_at DESC`, every time a user generates a public post that matches the entity's styles, the HTML payload of the programmatic page changes.
* **Revalidation Loop:** The `['posts']` cache tag is invalidated via background cron every hour. This guarantees that Googlebot detects continuous DOM mutations, marking the page as "Fresh" and maintaining high crawl frequency.