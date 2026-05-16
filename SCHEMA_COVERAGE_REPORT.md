# Schema Coverage Report

## 1. Findings & Evidence
* **Homepage (`/`):** Contains `WebSite`, `SearchAction`, and `Organization` schema injected dynamically via a `<script>` tag. Also renders `<SoftwareSchema />` (presumably `SoftwareApplication`).
* **Explore (`/explore`):** Contains `CollectionPage` schema injected dynamically.
* **Missing Schema:** There is no evidence of `FAQPage` schema on programmatic pages, `Product`/`Offer` schema for pricing, or `BreadcrumbList` for deep links.

## 2. Root Causes
Structured data was implemented manually on top-level pages for immediate branding (Organization) and Search Box benefits. Deep schema generation was likely deferred during the MVP phase.

## 3. Architectural Implications
Injecting JSON-LD via `dangerouslySetInnerHTML` in server components works perfectly for Googlebot. However, without a systematic, reusable schema factory, adding structured data to hundreds of dynamic pages (`/post/[id]`, `/style/[slug]`) requires repetitive boilerplate.

## 4. Scalability Implications
As the entity graph grows, manually maintaining schema structures is brittle. If a post's structure changes, the schema might not update automatically unless deeply coupled with the data fetching layer.

## 5. SEO Impact
* **Missed Rich Snippets:** Google cannot display rich results (star ratings, price, FAQs) for PicFOMO without the exact corresponding schema (`Product`, `FAQPage`, etc.).
* **Entity Understanding:** Without `ItemPage` or `ImageObject` schema on the `/post/[id]` routes, Google treats the page as generic HTML rather than a specific piece of AI-generated art.

## 6. Recommended Strategies
* **Schema Factory Utility:** Create a `lib/seo/schema.ts` file with typed generator functions (e.g., `generateFAQSchema(faqs)`, `generateImageSchema(post)`).
* **FAQ Schema:** Implement `FAQPage` schema on all `/compare` and `/use-case` pages to capture "People Also Ask" SERP real estate.
* **ImageObject Schema:** Add robust `ImageObject` structured data to every `/post/[id]` page, including `creator`, `contentUrl`, and `description` (the prompt/style).

## 7. Implementation Priorities
1. **Critical:** Implement `FAQPage` schema on all programmatic SEO pages (`/use-case`, `/compare`).
2. **High:** Create an `ImageObject` and `ItemPage` schema generator for `/post/[id]` pages.
3. **Medium:** Add `BreadcrumbList` schema to all non-root pages.

## 8. Risk Analysis
* **Risk of Action:** Malformed JSON-LD can cause Google Search Console errors. All schema must be strictly typed and validated.
* **Risk of Inaction:** Lower Click-Through Rates (CTR) on SERPs due to lack of rich results.