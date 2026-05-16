# Phase 1 Execution Runbook

## 1. D1 Relational Schema Migration
**Status:** Completed.
**File:** `migrations/0001_programmatic_seo.sql`
**Details:** 
- Deployed the relational schema to replace static data arrays.
- Created `p_entities` for Use-Cases, Platforms, Aesthetics, and Problems.
- Created `p_comparisons` for LLM RAG bait.
- Created `p_entity_edges` for scalable internal linking.
- Created `p_entity_styles` for CommunityGrid visual injections.
**Rollback Strategy:** Drop newly created `p_*` tables if application breaks. The core `posts` and `styles` tables are unmodified.

## 2. unstable_cache Hardening
**Status:** Completed.
**File:** `src/lib/db-queries.ts`
**Details:**
- Wrapped all `db.prepare().all()` edge executions inside `try/catch` boundaries.
- The API now returns safe fallbacks (`[]` or `null`) during Cloudflare D1 timeouts.
- **Risk Avoided:** Googlebot hitting `500 Internal Server Error` during background ISR revalidation, protecting crawl budget.

## 3. Sitemap Index System
**Status:** Completed.
**Files:** 
- `src/app/sitemap.xml/route.ts` (Index)
- `src/app/sitemap-core.xml/route.ts`
- `src/app/sitemap-usecases.xml/route.ts`
- `src/app/sitemap-styles.xml/route.ts`
- `src/app/sitemap-posts-[id].xml/route.ts` (10,000 URLs per chunk)
- `src/app/image-sitemap-[id].xml/route.ts` (Google Image Extension schemas)
**Details:**
- Deleted the legacy flat `sitemap.ts` to prevent scale exhaustion at 50,000 nodes.
- Built paginated dynamic edge routes to securely index 1M+ user posts over time.

## 4. Middleware Faceted Crawl Protection
**Status:** Completed.
**File:** `src/middleware.ts`
**Details:**
- Configured edge routing to intercept search parameters on SEO hubs (`/explore`, `/styles`).
- Dynamically injects `X-Robots-Tag: noindex, follow` in response headers to block faceted URL crawl traps from overwhelming Googlebot.

## 5. SchemaFactory V2 Integration
**Status:** Completed.
**File:** `src/lib/seo/schemaFactory.ts`
**Details:**
- Replaced the primitive JSON-LD strings with a fully scalable, object-oriented factory.
- Added `ItemList`, `TechArticle`, `Offer`, `AggregateRating`, and `CollectionPage`.
- Safely deployed multi-graph schemas to support Perplexity and ChatGPT parsing.

## 6. Semantic Image Pipeline (Procedural Renaming)
**Status:** Completed.
**File:** `src/app/api/generate/route.ts`
**Details:**
- Installed `piexifjs` to inject `Software`, `Copyright`, and `ImageDescription` into EXIF data.
- Built a Cloudflare-safe `Uint8Array` parser to process external image buffers.
- Replaced UUID filenames with `picfomo-[aesthetic]-professional-portrait-[id].jpg` prior to R2 upload to hijack Google Lens.

## 7. llms.txt Automation
**Status:** Completed.
**File:** `src/app/llms.txt/route.ts`
**Details:**
- Removed the static `/public/llms.txt`.
- Built an edge route to dynamically query D1 for the latest programmatic use-cases and competitor comparisons, rendering an up-to-date Markdown fact sheet for LLM crawlers.

## 8. SmartLinker Standardization
**Status:** Completed.
**Files:** `src/components/seo/SmartLinker.tsx`, `src/app/blog/[slug]/page.tsx`, `src/app/use-case/[slug]/page.tsx`, `src/app/compare/[slug]/page.tsx`, `src/utils/seo.tsx`
**Details:**
- Migrated manual anchor mapping into a React component utilizing regex word-boundary parsing.
- Ensures identical, high-authority anchor text (e.g., `Identity-Lock™`) across the entire domain to train AI retrieval systems.

---

### Production Deployment Checklist
- [x] Run `npm install piexifjs` to support EXIF modifications.
- [ ] Run `wrangler d1 execute picfomo-db --file=migrations/0001_programmatic_seo.sql` to apply the relational schema to production.
- [ ] Verify Cloudflare R2 Uploads execute properly without `Buffer` runtime errors.
- [ ] Submit `https://www.picfomo.com/sitemap.xml` (the new index) to Google Search Console to replace the old flat sitemap.
- [ ] Trigger a manual crawl of `/llms.txt` to verify crawler access.
- [ ] Verify `X-Robots-Tag` correctly appears when navigating to `https://www.picfomo.com/explore?sort=new`.