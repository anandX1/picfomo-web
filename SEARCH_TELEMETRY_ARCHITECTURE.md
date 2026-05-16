# Observability & Search Telemetry

## 1. Production Monitoring Architecture
Operating 100k+ nodes blindly is reckless. We must implement real-time telemetry bridging Next.js, Cloudflare Edge, and Google Search Console.

## 2. Crawl Budget & LLM Retrieval Tracking
* **Cloudflare Analytics Engine Integration:**
  Deploy an Edge middleware that logs specific `User-Agent` strings directly to a time-series database.
  ```typescript
  // src/middleware.ts telemetry module
  const agent = request.headers.get('user-agent') || '';
  let botType = 'none';
  if (agent.includes('Googlebot')) botType = 'googlebot';
  else if (agent.includes('ChatGPT-User')) botType = 'chatgpt';
  else if (agent.includes('PerplexityBot')) botType = 'perplexity';
  
  if (botType !== 'none') {
    env.ANALYTICS.writeDataPoint({
      blobs: [botType, request.nextUrl.pathname, request.headers.get('cf-ipcountry')],
      doubles: [Date.now() - requestStartTime] // Log TTFB per bot
    });
  }
  ```
* **Dashboarding:** Build a Grafana or Cloudflare dashboard tracking "LLM Retrieval Frequency" vs "Googlebot Crawl Frequency". If LLMs stop fetching `/llms.txt`, we investigate immediately.

## 3. Indexing Rates & Sitemap Ingestion
* **Automated GSC Checking:** Utilize the Google Search Console API via a background worker to query the `indexStatus` of programmatic nodes daily.
* **Alert Thresholds:** If `Discovered - currently not indexed` exceeds 15% of the total `/use-case` or `/post` volume, the system automatically triggers a halt on the Entity Generation Engine to prevent further crawl-budget exhaustion, prioritizing indexation of existing nodes over generating new ones.

## 4. Semantic Cluster Performance Tracking
Instead of tracking URL by URL, track by `taxonomy_edges`.
* Use D1 to join GSC traffic data (imported via API) with `p_entities`.
* **Output:** "The 'Healthcare' cluster is generating 10,000 clicks. The 'Finance' cluster is generating 200 clicks." 
* **Action:** The system dynamically adjusts the `<SmartLinker>` weights to flow more internal PageRank into the underperforming 'Finance' cluster.

## 5. Core Web Vitals (CWV) Edge Enforcement
Google algorithmically punishes slow sites.
* **Implementation:** Utilize Next.js `useReportWebVitals` hooked into Sentry or Vercel Analytics.
* **Hard Stop Protocol:** If the 75th percentile LCP (Largest Contentful Paint) exceeds 2.5s on `/compare/*` pages, trigger a Slack P1 Alert. Programmatic nodes with heavy DB injection (`<CommunityGrid>`) are most susceptible to regression.