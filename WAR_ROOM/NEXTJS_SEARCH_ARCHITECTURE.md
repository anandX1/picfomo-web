# Next.js Search Architecture

## 1. App Router Topology & Rendering Matrix
The current reliance on `force-dynamic` across the root and explore paths (`app/page.tsx`, `app/explore/page.tsx`) creates an unscalable Time-to-First-Byte (TTFB) bottleneck. Googlebot allocates crawl budget based on TTFB; a blocking D1 edge query starves crawl capacity.

### Recommended Rendering Strategy
| Route Type | Path Pattern | Strategy | Cache Invalidation | Reason |
| :--- | :--- | :--- | :--- | :--- |
| **Hub / Root** | `/`, `/explore` | **ISR (SWR Edge)** | `revalidate: 60` | Homepage does not need millisecond freshness. 60s ISR allows Cloudflare to serve cached HTML instantly globally while updating asynchronously. |
| **Programmatic** | `/use-case/[slug]`, `/compare/*` | **SSG / ISR** | `revalidate: 3600` | These are semantic nodes. They change rarely but depend on DB updates (e.g., new live examples). Hourly revalidation ensures freshness without compute waste. |
| **User Generated** | `/post/[id]` | **ISR** | `revalidate: 86400` | Once generated, posts rarely change. Cache heavily. If deleted/unlisted, trigger On-Demand Revalidation. |
| **Dynamic Entity** | `/style/[slug]` | **ISR** | `revalidate: 300` | Styles aggregate new posts. 5-minute cache strikes a balance between freshness and edge performance. |
| **Transactional** | `/dashboard/*` | **SSR / CSR** | None (`force-dynamic`) | Authenticated routes; completely blocked from crawlers via `robots.txt`. |

## 2. Force-Dynamic Elimination & Caching Hierarchy
Remove `export const dynamic = "force-dynamic";` and replace with fine-grained caching.
* **The `unstable_cache` Wrapper:** Wrap D1 queries in Next.js `unstable_cache`.
  ```typescript
  const getDynamicStyles = unstable_cache(
    async () => db.prepare("SELECT ...").all(),
    ['active-styles'],
    { revalidate: 3600, tags: ['styles'] }
  );
  ```
* **On-Demand Revalidation:** When an admin adds a new style or use-case, hit an internal API route that calls `revalidateTag('styles')`. This surgically purges the cache without waiting for timeouts.

## 3. Suspense Boundary Strategy (TTFB Optimization)
For `/explore`, the feed is heavy. Googlebot needs the `<head>` and layout HTML immediately.
* **Implementation:** Move `fetchFeedChunk` into a separate Server Component `<ExploreFeed />`.
* **Architecture:** Wrap it: `<Suspense fallback={<FeedSkeleton />}><ExploreFeed /></Suspense>`.
* **Algorithmic Impact:** The server responds with `200 OK` in <50ms. The `robots` meta tags and canonicals are parsed instantly. The streaming chunk containing the feed arrives shortly after. Googlebot perfectly executes streamed HTML.

## 4. Crawl-Safe Rendering Rules
* **Hydration State:** Never pass large JSON blobs to `use client` components if they aren't needed for interactivity. E.g., pass only `id`, `image_url`, and `style_name` to `<FeedClient />`, not the entire user object or internal DB fields. This prevents DOM bloat and speeds up Interaction to Next Paint (INP).
* **Faceted Navigation:** If `/explore` implements filters (e.g., `?sort=top`), intercept the request in middleware or edge config to inject `X-Robots-Tag: noindex` for parameterized URLs, forcing the crawler to only index the canonical root, preventing crawl traps.