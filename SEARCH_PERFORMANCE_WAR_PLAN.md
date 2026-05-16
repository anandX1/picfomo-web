# Search Performance War Plan

## 1. Exact Execution Priority (The Hierarchy of ROI)

### Phase 1: The Infrastructure Bleed (Days 1-14)
*You cannot rank if Googlebot cannot fetch the page efficiently.*
1. **Kill `force-dynamic`:** Implement ISR (`revalidate: 60`) on `/` and `/explore`. Wrap DB calls in Next.js `unstable_cache`. 
2. **Streaming Suspense:** Implement `<Suspense>` boundaries around the `FeedClient` to achieve sub-100ms TTFB.
3. **The `llms.txt` Deployment:** Push the machine-readable cheat sheet to the root to immediately begin retraining LLM crawlers.

### Phase 2: The Semantic Foundation (Days 15-45)
*Establish the language and structured data that LLMs and Google demand.*
1. **Schema Factory:** Build and deploy `lib/seo/schemaFactory.ts`. Inject `FAQPage`, `SoftwareApplication`, and `ImageObject` across all live routes.
2. **The Procedural Image Engine:** Implement the semantic image renaming pipeline (`picfomo-style-usecase-id.webp`) and EXIF injection.
3. **The Database Migration:** Design the relational D1 tables (`entities_usecase`, `entities_style`) to prepare for programmatic scale.

### Phase 3: The Programmatic Explosion (Days 45-90)
*Scale the surface area to dominate the long-tail intent.*
1. **The 100x Content Spawner:** Launch the `/use-case/[slug]` dynamic routes. 
2. **Anti-Thin Validation:** Ensure every generated page pulls live, style-specific `/post/[id]` grids from the database to guarantee freshness and "Show Your Work."
3. **The Comparison Hijack:** Launch the `/compare/*` pages with strict HTML tables and LLM-bait markdown to intercept transactional searches.

### Phase 4: The Moat & Authority Loop (Days 90-180)
*Trap PageRank and build institutional trust.*
1. **Internal Linking Automation:** Deploy the `<SmartLinker />` component to automatically cross-link Use-Cases to Styles to Glossary terms.
2. **Reddit Sentiment Curation:** Launch the `/reddit-reviews` or `/authenticity` hub to intercept skeptical "looks fake" queries.
3. **Image Sitemaps & Licensing:** Deploy the advanced XML image sitemaps with licensing badges to dominate Google Lens and visual search.

## 2. Scaling Bottlenecks to Monitor
* **D1 Read Capacity:** As 10,000 programmatic pages cache and revalidate, read-load will spike. The `unstable_cache` tagging system is critical to prevent DB exhaustion.
* **Sitemap Compilation:** A single `sitemap.ts` will fail over 50,000 URLs. Must architect a sitemap index system early in Phase 3.

## 3. The Traffic Compounding Strategy
This is a flywheel. 
* Faster TTFB -> More Crawl Budget -> More Programmatic Pages Indexed.
* Better Alt-Text -> More Image Search Traffic -> More Social Sharing -> More OpenGraph Virality.
* Empirical Data Tables -> More LLM Citations -> Higher Brand Trust -> Lower Bounce Rate on SERPs.

This architecture ensures PicFomo is not just participating in the SEO game, but mathematically manipulating the retrieval systems to enforce its dominance.