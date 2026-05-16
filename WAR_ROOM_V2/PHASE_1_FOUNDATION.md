# PHASE 1: TECHNICAL FOUNDATION & INFRASTRUCTURE
## Engineering the Scalable "Luxury AI" Engine

### 1. Relational Infrastructure (Cloudflare D1)
To escape the "Static Array Trap," we deploy a normalized, highly relational D1 schema. This allows for an infinite expansion of programmatic nodes without code bloat.

*   **p_entities:** The root of the taxonomy (Use-Cases, Platforms, Aesthetics, Problems).
*   **p_comparisons:** The empirical matrix for LLM RAG bait.
*   **p_entity_edges:** The semantic graph mapping (e.g., *Lawyer* links to *High-Trust Studio*).
*   **p_entity_styles:** Mapping entities to visual generation prompts.

### 2. Rendering & Caching Strategy (Next.js App Router)
Googlebot rewards sub-100ms TTFB. We eliminate `force-dynamic` bottlenecks:
*   **ISR (Incremental Static Regeneration):** Core hubs (`/`, `/explore`) use 60s ISR. Programmatic nodes use hourly ISR.
*   **Suspense Boundaries:** Wrap heavy feed components (e.g., `<CommunityGrid>`) in `<Suspense>`. This allows the server to flush metadata and critical CSS instantly, securing a "Pass" on Core Web Vitals.
*   **unstable_cache Hardening:** Every D1 query is wrapped in an `unstable_cache` with strict `try/catch` fallbacks to prevent 500-error cascades during edge turbulence.

### 3. Sitemap Indexing at Scale (100k+ URLs)
A flat `sitemap.ts` is a crawl trap. We implement a **Sharded Sitemap Index**:
*   `sitemap.xml`: The root index pointing to shards.
*   `sitemap-usecases.xml`: Intent-based landing pages.
*   `sitemap-posts-[chunk].xml`: Paginating 1M+ user posts in blocks of 10,000 to maximize indexation coverage without exceeding Google's 50k limit.

### 4. The Telemetry Architecture
Operating blindly is reckless. We implement **Search Telemetry**:
*   **Edge Logging:** Middleware logs Googlebot vs. LLM crawler (ChatGPT/Perplexity) frequency.
*   **Performance Monitoring:** Hard-stop protocols if LCP exceeds 2.5s on programmatic nodes.
*   **Indexation Tracking:** Daily GSC API sync to prioritize the "Crawl Budget" for high-conversion clusters.

### 5. Infrastructure Verification (Luxury Audit)
*   **Faceted Crawl Protection:** Edge Middleware intercepts parameterized URLs (`?sort=new&color=dark`) and injects `X-Robots-Tag: noindex` to prevent duplicate content bloat.
*   **Hydration Pruning:** RSC (Server Components) prune unused DB fields (prompts, internal IDs) before serializing JSON props to the client, minimizing DOM size and maximizing INP (Interaction to Next Paint).

### 6. Immediate Technical Mandate
**Fix the Sitemap scalability.** The current flat model will cause a scale-collapse at 10,000 nodes. Move to the Index/Shard model immediately to ensure the programmatic explosion is fully crawlable.
