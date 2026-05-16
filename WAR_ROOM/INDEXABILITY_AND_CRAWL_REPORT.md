# Indexability & Crawl Report

## 1. Findings & Evidence
* **Robots.txt:** Effectively blocks `/admin`, `/dashboard`, and dynamic query parameters (`/*?*`). It also aggressively blocks specific AI bots (`GPTBot`, `CCBot`) from scraping images on `/style/`, `/post/`, and `/u/`.
* **Sitemap.xml:** Dynamically generated, mapping static pages, programmatic SEO pages, and database-driven entities (styles, posts, profiles). Uses `try/catch` and Cloudflare context safely.
* **Canonicalization:** Defined dynamically in `generateMetadata` (e.g., `/explore` sets canonical to prevent tracking param duplicate content).

## 2. Root Causes
The setup is built defensively to protect crawl budget from useless bot traffic (AI scrapers) while ensuring Googlebot can find all valuable database entities via the sitemap.

## 3. Architectural Implications
* The aggressive blocking of `/*?*` prevents faceted navigation from bloating the index (e.g., `/explore?sort=new` vs `/explore?sort=top`). This is an excellent, advanced technical SEO safeguard.
* The sitemap generates synchronously with a DB query.

## 4. Scalability Implications
* **Sitemap Size Limits:** Google limits sitemaps to 50,000 URLs or 50MB. Currently, the sitemap fetches `LIMIT 1000` for posts and `LIMIT 500` for users. As the platform scales, the sitemap must be split into a sitemap index (e.g., `sitemap-posts-1.xml`, `sitemap-posts-2.xml`).

## 5. SEO Impact
* **Crawl Efficiency:** The `robots.txt` configuration is highly efficient, guaranteeing Googlebot only crawls valuable nodes.
* **Index Bloat:** Safely mitigated via canonicals and disallows.

## 6. Recommended Strategies
* **Sitemap Pagination:** Architect a sitemap index system to handle future scale beyond 1,000 posts.
* **Dynamic Last-Modified Dates:** Ensure the `lastModified` date in the sitemap accurately reflects the `updated_at` DB column to tell Google exactly when to recrawl.
* **Orphan Page Rescue:** Since the sitemap limits posts to the latest 1,000, older posts will become orphans unless linked internally. Provide HTML pagination or archive hubs.

## 7. Implementation Priorities
1. **High:** Monitor Google Search Console for "Discovered - currently not indexed" which will indicate if the 1,000 post limit is causing indexing drops.
2. **Medium:** Implement a sitemap index architecture for posts and users.

## 8. Risk Analysis
* **Risk of Action:** Over-complicating the sitemap generation could lead to timeouts at the edge if DB queries take too long.
* **Risk of Inaction:** Older user-generated content will fall out of the sitemap and eventually be dropped from the index due to lack of internal links.