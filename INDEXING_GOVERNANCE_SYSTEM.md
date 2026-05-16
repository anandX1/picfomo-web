# Indexing Governance System

## 1. Automated Crawler Governance Layer
With 100,000+ nodes, we cannot rely on manual Google Search Console checks. We must instrument the Edge to monitor crawler behavior autonomously.

### Cloudflare Logpush & Axiom Integration
1. Configure Cloudflare Logpush to forward all Edge request logs to Axiom or BigQuery.
2. **Filter Query:** `ClientRequestUserAgent CONTAINS 'Googlebot' OR ClientRequestUserAgent CONTAINS 'ChatGPT-User' OR ClientRequestUserAgent CONTAINS 'PerplexityBot'`.
3. **Alerting:** If Googlebot requests to `/use-case/*` drop by > 20% week-over-week, or if 404s spike, trigger a Slack/Discord webhook.

## 2. Orphan Detection & Mitigation
If a `/post/[id]` is pushed off page 10 of the `/explore` feed, it becomes an orphan and will be dropped from the index.
* **The "Archive Node" System:**
  * Create `/archive/styles/[slug]/[year]-[month]/page.tsx`.
  * An automated script generates thousands of flat HTML linking pages grouped by month and style (e.g., "Corporate Styles - May 2026").
  * This guarantees that every post generated on PicFOMO is perpetually reachable within 4 clicks from the Homepage.

## 3. Crawl-Depth Tracking & Soft-404 Detection
* **Execution:** Next.js Middleware tracking.
```typescript
// src/middleware.ts
export function middleware(req: NextRequest) {
  // Identify bots
  const isBot = /bot|crawler|spider|crawling/i.test(req.headers.get('user-agent') || '');
  
  if (isBot && req.nextUrl.pathname.startsWith('/post/')) {
    // D1 logging mechanism (batched via Cloudflare Analytics Engine to prevent latency)
    recordBotCrawl(req.nextUrl.pathname);
  }
  return NextResponse.next();
}
```
* **Soft-404 Pruning:** If the telemetry shows a node hasn't been crawled in 90 days, or if it renders a `CommunityGrid` with 0 images, update `p_entities.is_active = 0`. The next request returns a hard 410 (Gone) or 301 Redirect, actively sculpting Googlebot's crawl budget toward high-value pages.

## 4. Index Bloat & Query Parameter Sanitization
Faceted navigation causes index bloat.
* **Strict Canonical Enforcement:**
```typescript
// Enforce in layout.tsx or middleware
const cleanUrl = req.nextUrl.pathname;
const hasInvalidParams = ['sort', 'filter', 'page', 'remix'].some(p => req.nextUrl.searchParams.has(p));

if (hasInvalidParams) {
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  // OR 301 redirect to cleanUrl if the parameters don't change content significantly
}
```