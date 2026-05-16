# Internal Link Automation V2

## 1. Global SmartLinker Engine
The manual `SEMANTIC_LINKS` array from Phase 1 is unscalable for 1,000+ nodes. The `SmartLinker` must be upgraded to dynamically query the edge cache for the full programmatic graph.

### The Semantic Fetcher
```typescript
export const getGlobalSemanticLinks = unstable_cache(
  async () => {
    try {
      const db = await getD1();
      // Fetches all active glossary terms, use-cases, and comparisons
      const { results } = await db.prepare(
        "SELECT name as keyword, slug, type FROM p_entities WHERE is_active = 1"
      ).all();
      
      return results.map(r => ({
        keyword: r.keyword,
        url: `/${r.type}/${r.slug}`
      })).sort((a, b) => b.keyword.length - a.keyword.length); // Sort to prevent partial matching
    } catch (e) {
      return [];
    }
  },
  ['global-semantic-links'],
  { revalidate: 86400, tags: ['programmatic'] }
);
```

### The Anchor Governance Rules
The `SmartLinker` component must enforce these rules:
1. **No Recursive Linking:** Do not link the keyword "Lawyer" if the user is already on `/use-case/lawyer`.
2. **Frequency Capping:** Only link the *first* instance of a keyword in a text block to prevent over-optimization penalties (spam).
3. **Safe Parsing Boundaries:** Only parse text nodes. Never parse inside `<h1>`, `<button>`, or existing `<a>` tags.

## 2. Contextual Related-Page Engine
Lateral crawling is essential. If Googlebot hits `/use-case/actor`, it needs a path to `/use-case/musician`.
* **Implementation:** The `p_entity_edges` table manages this.
```sql
SELECT e.name, e.slug 
FROM p_entities e
JOIN p_entity_edges edge ON e.id = edge.target_id
WHERE edge.source_id = ?
ORDER BY edge.weight DESC LIMIT 5
```
* This renders the `<RelatedIntents />` widget at the bottom of the page, ensuring PageRank flows smoothly across sibling nodes in the cluster.

## 3. Infinite Crawl-Path Systems (The Post Waterfall)
For Tier 4 nodes (`/post/[id]`), the crawler must never reach a dead end.
* **Component:** `<MoreFromThisStyle />`
* **Logic:** Fetch 4 random (but recent) public posts that share the same `style_id`.
* **Impact:** This transforms 10,000 isolated image pages into an infinitely connected neural net. Googlebot can enter through Post A and crawl 5,000 posts continuously without returning to the sitemap.