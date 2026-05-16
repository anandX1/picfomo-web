# Execution Order

## Phase 1: The Infrastructure Prerequisites (Week 1)
*Must be completed before adding any programmatic content to prevent 500 errors and crawl traps.*
1. **D1 Relational Migration:** Deploy the new `p_entities`, `p_entity_edges`, and `p_comparisons` tables.
2. **Cache Wrapper Overhaul:** Implement `try/catch` safety nets in `src/lib/db-queries.ts` across all `unstable_cache` wrappers.
3. **Sitemap Sharding:** Delete `sitemap.ts` and deploy the `sitemap.xml/route.ts` index architecture with paginated SQL queries.

## Phase 2: The Semantic Core (Week 2-3)
*Establishing the language LLMs and Google will retrieve.*
1. **Schema Factory V2:** Expand `src/lib/seo/schemaFactory.ts` with strict Zod types for `CollectionPage`, `SoftwareApplication`, and nested `FAQPage`.
2. **The Procedural Image Pipeline:** Hook `piexifjs` and the `getSemanticFilename` logic into `/api/generate` to hijack Google Lens.
3. **SmartLinker Global Deployment:** Activate the D1-driven `getGlobalSemanticLinks` and deploy the `<SmartLinker />` across the blog, glossary, and new templates.

## Phase 3: The Programmatic Explosion (Month 2)
*Deploying the 1,000+ nodes.*
1. **The Component Engine:** Build the `ProgrammaticTemplate.tsx`, `<LLMCitationBlock />`, and `<DynamicFAQ />` components.
2. **Route Generation:** Deploy the catch-all dynamic routes (`/use-case/[slug]/page.tsx`, `/platform/[slug]/page.tsx`).
3. **Data Seeding:** Run the seeding script to populate D1 with the 1,000 long-tail query nodes, mapped to their specific styles.

## Phase 4: Validation & Scale (Month 3)
*Monitoring the aftermath and reinforcing authority.*
1. **Log Analysis:** Monitor Cloudflare logs to ensure Googlebot is hitting the new nodes with `200 OK` and sub-100ms TTFB. Check for 500 errors indicating DB timeouts.
2. **RAG Bait Monitoring:** Search Perplexity for "PicFomo vs Aragon" to verify that the LLM has ingested the hidden markdown blocks and is citing the 20-second speed metric.
3. **Pillar Page Deployment:** Launch the heavy, 3,000-word guides to begin capturing external backlinks and funneling PageRank down into the programmatic network.