# Programmatic Page Generator

## 1. System Design for 10,000+ Pages
Generating massive page volume requires solving two problems: Thin Content Penalties and Route Compilation Limits.

### Dynamic Route Strategy (`app/use-case/[slug]/page.tsx`)
Do not use `generateStaticParams` for all 10,000 pages, as it will cause Vercel/Cloudflare build timeouts.
* **The Hybrid Approach:** Use `generateStaticParams` to pre-build the top 100 highest-traffic routes (e.g., `lawyer`, `linkedin`). 
* **Fallback (`dynamicParams = true`):** Allow the remaining 9,900 routes to be generated On-Demand (ISR) when the first user or crawler hits them.

## 2. The Anti-Thin-Content Engine
Google's Helpful Content System will deindex 10,000 pages if the only difference between `/lawyer` and `/dentist` is the H1 tag.

### Component-Level Dynamic Injection
1. **The Niche Introduction:** A unique text block generated via an internal LLM script during DB seeding (e.g., explaining why trust matters for dentists).
2. **The "Show Your Work" Grid:** Query the D1 database: `SELECT * FROM posts WHERE style_id IN (mapped_styles) ORDER BY created_at DESC LIMIT 12`. This proves to Google that the page is a live, functioning application surface, not a doorway page.
3. **The Empirical Hooks:** Embed the `Speed vs Cost` matrix.

## 3. Freshness Signals
Google detects "decay." If a programmatic page hasn't changed in 6 months, crawl frequency drops.
* **The Fix:** The "Show Your Work" grid must be wrapped in an ISR cache of 24 hours. Every day, as new users generate posts in that style, the grid updates. The HTML hash changes. Googlebot detects the change, marks the page as "Fresh," and maintains high crawl velocity.

## 4. Pagination & Faceted Navigation Handling
* **The Crawl Trap:** Programmatic filters (e.g., `/use-case/lawyer?gender=female&style=dark`) create infinite URL spaces.
* **The Solution:** 
  1. Enforce strict canonical tags back to the base `/use-case/[slug]`.
  2. Implement an Edge Middleware rule that strips non-essential query parameters before rendering, or explicitly sets `X-Robots-Tag: noindex` for filtered states.

## 5. Algorithmic Rationale
Competitors rely on static, manually written blog posts. By treating programmatic SEO as a software engineering problem—injecting live database state into cached HTML nodes—we create an evolving, self-updating entity graph that Google recognizes as a high-utility web application, shielding it from manual spam actions.