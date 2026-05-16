# Rendering Architecture Map

## 1. Findings & Evidence
PicFOMO uses Next.js App Router deployed on Cloudflare Pages/Workers via `opennextjs/cloudflare`. 
* **Server Components (RSC):** Core routing and data fetching are handled by RSCs (`app/page.tsx`, `app/explore/page.tsx`, `app/blog/[slug]/page.tsx`).
* **Client Components (CSR):** Interactive elements are strictly delegated to client boundaries (`MarketingClient.tsx`, `FeedClient.tsx`, `GeneratorUI.tsx`) indicated by `use client` in their respective files.
* **Route Rendering Strategies:**
  * **Static / Programmatic SEO (`/compare/[slug]`, `/use-case/[slug]`, `/glossary/[slug]`):** Likely static since they rely on hardcoded TypeScript data dictionaries (`src/data/*.ts`).
  * **Dynamic (`/`, `/explore`, `/post/[id]`, `/style/[slug]`):** Forced dynamic rendering at the edge with inline Cloudflare D1 queries.
* **Metadata Flow:** Metadata is generated natively via Next.js `generateMetadata` exports, ensuring proper server-side `<head>` population before client hydration.

## 2. Root Causes
The architecture splits rendering strictly: layout and DB fetching on the Edge Server, and UI hydration on the Client. This is standard Next.js 14/15 practice to reduce JS bundle sizes.

## 3. Architectural Implications
* The HTML delivered to Googlebot contains the fully populated DOM (from RSCs) but interactive states wait for React hydration.
* Because dynamic data is passed as props from Server to Client (e.g., `<FeedClient initialPosts={initialPosts} />`), the initial HTML payload includes the JSON-serialized props.

## 4. Scalability Implications
* **Hydration Bloat:** Passing large arrays of posts or styles to client components serialization increases the HTML document size. If `initialPosts` contains heavy objects, it will slow down parsing and hydration.
* **Edge Execution:** D1 queries are fast, but running them on every render for `/` and `/explore` wastes compute.

## 5. SEO Impact
* **Crawlable HTML:** Excellent. Googlebot receives the exact DOM structure containing the images and text immediately.
* **Hydration Cost:** If the JSON serialized state is too large, it delays the Interactive (INP/TBT) metrics, negatively impacting Core Web Vitals.

## 6. Recommended Strategies
* **Payload Pruning:** Ensure `db.prepare("SELECT ...")` only requests fields necessary for the initial render. Do not `SELECT *`.
* **Component-Level Streaming:** Wrap heavy database queries in React `<Suspense>` boundaries. Let the shell render instantly (SSG) and stream the dynamic feed in chunks. This provides Googlebot an immediate 200 OK and TTFB, while the content streams in.

## 7. Implementation Priorities
1. **High:** Implement `<Suspense>` boundaries for `dynamicStyles` in `app/page.tsx` and `initialPosts` in `app/explore/page.tsx`.
2. **High:** Audit the props passed to `ClientLayout` and `FeedClient` to ensure minimal JSON serialization.

## 8. Risk Analysis
* **Risk of Action:** Streaming can sometimes confuse older scrapers, though Googlebot handles modern streaming SSR well.
* **Risk of Inaction:** Large DOM sizes due to serialized props and slow TTFB due to blocking DB queries.