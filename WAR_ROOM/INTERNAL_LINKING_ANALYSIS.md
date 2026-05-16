# Internal Linking Analysis

## 1. Findings & Evidence
* **Global Navigation:** Handled by `Navbar.tsx` and `Footer.tsx` (and their `New*` variants), providing links to `/explore`, `/styles`, `/blog`, `/use-case`, and `/compare`.
* **Programmatic Links:** `sitemap.ts` successfully maps all dynamic and programmatic routes.
* **Contextual Links:** There is a lack of deep, contextual cross-linking. E.g., `app/style/[slug]` does not dynamically link to related `/use-case/[slug]` pages.
* **Orphan Pages:** With the sheer volume of generated posts (`/post/[id]`), many posts may become orphans once they fall off the main `/explore` feed unless they are pinned to a user profile or style page.

## 2. Root Causes
The architecture treats programmatic SEO pages (static data) and user-generated content (D1 database) as separate silos. There is no automated graph linking them together contextually.

## 3. Architectural Implications
PageRank (link equity) flows efficiently through the global navigation but pools at the top level. Deep pages (individual styles, older blog posts, specific use-cases) rely heavily on the XML sitemap rather than internal contextual links.

## 4. Scalability Implications
As the number of styles and posts grows to the tens of thousands, relying on the `/explore` feed for discoverability will fail. Crawlers will not paginate endlessly through infinite scroll or "Load More" feeds.

## 5. SEO Impact
* **Poor Crawl Depth:** Posts not featured on the homepage or top of the explore feed will rarely be crawled or indexed.
* **Topical Authority Dilution:** If a Use Case page doesn't link to the Styles that power it, and the Styles don't link back, Google struggles to build a semantic relationship between the entities.

## 6. Recommended Strategies
* **Semantic Breadcrumbs:** Implement `BreadcrumbList` schema and UI on all deep pages (e.g., `Home > Styles > Corporate > Post`).
* **Related Entities Component:** Create a "Related Styles" or "Used In" component on the `/style/[slug]` page that injects links to the relevant `/use-case/[slug]` pages.
* **HTML Pagination Fallback:** Ensure that `/explore` and `/styles` have standard `<a href="?page=2">` pagination for crawlers, even if the user experience is infinite scroll.

## 7. Implementation Priorities
1. **Critical:** Implement bi-directional contextual linking between `/style/[slug]`, `/use-case/[slug]`, and `/glossary/[slug]`.
2. **High:** Ensure all user profiles (`/u/[username]`) link to the styles they frequently use.
3. **Medium:** Implement standard HTML pagination links for crawlers on feed pages.

## 8. Risk Analysis
* **Risk of Action:** Over-linking can look spammy. Links must be highly contextual and relevant.
* **Risk of Inaction:** Orphaned pages, wasted crawl budget, and failure to establish a cohesive topical entity graph.