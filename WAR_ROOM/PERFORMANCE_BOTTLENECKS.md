# Performance Bottlenecks Report

## 1. Findings & Evidence
* **Images:** `next.config.ts` enforces AVIF/WebP with a 30-day cache. `browser-image-compression` is used on the client.
* **JS Bundle:** `next.config.ts` includes `optimizePackageImports: ['lucide-react', 'recharts']` to reduce bundle size.
* **Database:** Cloudflare D1 is queried synchronously in RSCs (`app/page.tsx`, `app/explore/page.tsx`).
* **Fonts:** `Plus_Jakarta_Sans` and `Inter` are loaded via `next/font/google` with `display: 'swap'`.

## 2. Root Causes
The architecture prioritizes edge rendering with Cloudflare Pages/Workers, taking advantage of D1's global distribution. However, synchronous DB calls on high-traffic routes (`/` and `/explore`) block the initial HTML response.

## 3. Architectural Implications
Because `force-dynamic` is used, the server cannot respond until the D1 query resolves. Even if D1 is fast (e.g., 50ms), the edge worker execution time adds up, affecting the Time to First Byte (TTFB).

## 4. Scalability Implications
* **LCP (Largest Contentful Paint):** If TTFB is slow, LCP is delayed. Images are optimized, but if the HTML arrives late, the image request is delayed.
* **Hydration:** Client components like `MarketingClient` and `FeedClient` must hydrate the serialized JSON props (`dynamicStyles`, `initialPosts`). Large JSON payloads will cause long Tasks and poor Interaction to Next Paint (INP).

## 5. SEO Impact
* Core Web Vitals (CWV) are a direct ranking factor. A poor TTFB or INP will throttle crawl budget and suppress rankings.
* Mobile performance is particularly vulnerable to large hydration payloads due to weaker CPU processing.

## 6. Recommended Strategies
* **React Suspense & Streaming:** Wrap the database-dependent UI sections in `<Suspense fallback={<Skeleton />}>`. This allows the server to flush the `<head>` and critical CSS immediately, ensuring a fast TTFB.
* **Edge Caching via Cache API:** Utilize Cloudflare's Cache API or Next.js `unstable_cache` to memoize D1 query results for 30-60 seconds, drastically reducing database load.
* **Prop Diet:** Ensure `SELECT` statements only fetch fields strictly required for rendering (e.g., `id`, `image_url`, `style_name`). Exclude large text blobs or unused metadata from the initial payload.

## 7. Implementation Priorities
1. **Critical:** Implement Edge Caching or ISR for the `db.prepare` calls in `app/page.tsx`.
2. **High:** Implement `<Suspense>` streaming for the explore feed.
3. **Medium:** Review network waterfall to ensure the LCP hero image (`/hero/8.webp` or similar) is preloaded.

## 8. Risk Analysis
* **Risk of Action:** Streaming SSR can complicate state management if not handled carefully, and caching introduces eventual consistency (stale data).
* **Risk of Inaction:** As the database grows, TTFB will degrade linearly, crashing Core Web Vitals scores.