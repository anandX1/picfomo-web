# Scale Safety Systems

## 1. Sitemap Index Architecture
A flat sitemap fails at 50,000 URLs. We implement a deeply sharded system.
* `/sitemap.xml` (The Index)
  * `/sitemap-core.xml` (Hubs)
  * `/sitemap-programmatic-[id].xml` (The 1000 nodes, chunked by 500)
  * `/sitemap-posts-[id].xml` (The 1M+ user posts, chunked by 10,000)
  * `/image-sitemap-[id].xml` (Dedicated Google Image Extension sitemaps)

## 2. Faceted Crawl Protection
A single parameter (`/styles?sort=new&color=dark`) creates infinite crawl spaces.
* **Edge Middleware (`src/middleware.ts`):**
  Intercept any request containing search parameters on non-interactive pages and strip them before rendering, or explicitly append `X-Robots-Tag: noindex` in the response headers.

## 3. D1 Timeout Resilience & ISR Fallbacks
When generating 1,000 pages during peak traffic, D1 read limits may be hit.
* **The "Graceful Degradation" Pattern:**
  If `getProgrammaticEntity` times out, do NOT throw an error that crashes the build or serves a 500 to Googlebot.
  ```typescript
  export const getEntity = unstable_cache(async () => {
    try {
      // DB call
    } catch (error) {
      // Log alert to Sentry
      return CACHE_FALLBACK_STATE; // Returns empty arrays, allowing the page shell to render
    }
  });
  ```

## 4. Crawl Budget Sculpting
* Use `robots.ts` to actively block legacy bots (`CCBot`, `Omgilibot`) from hitting `/post/[id]` routes. We only want high-value crawlers (Googlebot, Bingbot) indexing the millions of deep nodes to preserve the domain's crawl budget.