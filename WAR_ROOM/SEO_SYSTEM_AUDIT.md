# SEO System Audit

## 1. Executive Summary
The PicFOMO architecture demonstrates an aggressive, modern approach to technical SEO, utilizing Cloudflare edge rendering (`@opennextjs/cloudflare`) and Next.js 15+ App Router. However, the heavy reliance on `force-dynamic` across critical indexing paths (e.g., `/` and `/explore`) introduces systemic risks for search engine crawlers regarding Time to First Byte (TTFB) and rendering timeouts. While programmatic SEO foundations are robust, semantic depth across dynamic entities requires structural reinforcement.

## 2. Findings & Evidence
* **Aggressive Dynamic Rendering:** Both `app/page.tsx` and `app/explore/page.tsx` use `export const dynamic = "force-dynamic"; export const revalidate = 0;`.
* **Inline Database Queries:** D1 database calls (e.g., `db.prepare("SELECT ...")`) are executed directly inside the server components during the request lifecycle.
* **Canonical Protection:** `/explore` correctly enforces canonical URLs (`https://www.picfomo.com/explore`) to prevent tracking parameter duplicate content.
* **Aggressive Bot Protection:** `robots.ts` explicitly blocks AI scrapers (`GPTBot`, `CCBot`, `Google-Extended`) from consuming `/style/`, `/post/`, and `/u/` routes.

## 3. Root Causes
The desire for real-time fresh content (e.g., live feed of AI generation styles and exploring recent community posts) has led to the adoption of `force-dynamic` and inline edge DB calls. While Cloudflare D1 is fast, bypassing the Next.js Data Cache entirely forces every Googlebot crawl request to block on the database.

## 4. Architectural Implications
By abandoning Static Site Generation (SSG) and Incremental Static Regeneration (ISR) for core hubs, the architecture shifts the performance burden entirely to the edge database. This prevents CDN caching of HTML documents.

## 5. Scalability Implications
As traffic grows or Googlebot increases crawl velocity, the D1 database will experience high read concurrency. If D1 latency spikes, Googlebot will experience slow TTFB, leading to crawl budget depletion and potential soft-404s.

## 6. SEO Impact
* **Pros:** Content is always perfectly fresh. Tracking parameters won't cause duplicate indexation due to strict canonicals.
* **Cons:** Google relies heavily on LCP and TTFB. If the dynamic execution exceeds 200-300ms, crawl capacity drops. Furthermore, Google may throttle crawls if it detects dynamic strain.

## 7. Recommended Strategies
* **Implement Edge Caching with ISR:** Shift from `force-dynamic` to ISR (e.g., `revalidate = 60` or `3600`) for the homepage and `/explore`. The feed does not need to be millisecond-accurate for search crawlers.
* **Stale-While-Revalidate (SWR):** Use SWR cache control headers if keeping `force-dynamic`, allowing Cloudflare CDN to serve stale HTML while updating in the background.

## 8. Implementation Priorities
1. **Critical:** Remove `force-dynamic` from `app/page.tsx` and implement a 5-15 minute `revalidate` timer.
2. **High:** Refactor `app/explore/page.tsx` to use ISR. The feed can be hydrated client-side (CSR) or cached for 60 seconds (ISR).
3. **Medium:** Monitor D1 TTFB specifically for Googlebot user-agents.

## 9. Risk Analysis
* **Risk of Action:** Switching to ISR might cause slight delays in new styles appearing on the homepage.
* **Risk of Inaction:** Severe crawl budget limitations and Core Web Vitals (TTFB) penalties as the database scales.