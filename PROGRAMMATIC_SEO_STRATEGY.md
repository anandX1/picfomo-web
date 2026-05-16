# Programmatic SEO Strategy

## 1. Findings & Evidence
PicFOMO implements a multi-pronged programmatic SEO (pSEO) strategy utilizing static dictionaries (`src/data/`):
* **Use Cases:** 20+ pages (e.g., `/use-case/real-estate-headshots`) targeting intent-based long-tail queries.
* **Comparisons:** 10+ pages (e.g., `/compare/picfomo-vs-aragon-ai`) targeting high-conversion competitor alternative queries.
* **Glossary:** 10+ pages (e.g., `/glossary/identity-lock`) targeting informational, top-of-funnel queries and establishing topical authority on AI generation.

## 2. Root Causes
This structure was likely built to rapidly deploy landing pages without the overhead of a headless CMS, aiming to capture long-tail search volume quickly.

## 3. Architectural Implications
* The current setup relies heavily on Next.js dynamic routing (`app/[slug]/page.tsx`) mapping over static arrays. This is extremely fast but requires developer intervention for every new page.
* Content on these pages may be "thin" if not sufficiently augmented with dynamic assets (e.g., live examples of posts related to the use-case).

## 4. Scalability Implications
* Creating 1,000 comparison pages or use-cases manually via TypeScript dictionaries is not scalable and bloats the codebase.
* The content within these programmatic pages is identical in structure; without injecting dynamic DB content (e.g., real user generations), they risk being flagged as doorway pages or thin content by Google.

## 5. SEO Impact
* **Intent Coverage:** Excellent. The strategy maps perfectly to the user journey (Informational -> Glossary, Consideration -> Use Case, Transactional -> Compare).
* **Thin Content Risk:** High. If `/compare/picfomo-vs-aragon-ai` and `/compare/picfomo-vs-headshotpro` only differ by a few text strings, the "Helpful Content System" may demote them.

## 6. Recommended Strategies
* **Dynamic Asset Injection:** Query the D1 database within the `use-case` and `compare` pages to pull in live, real-world generation examples associated with the featured styles.
* **Content Diversification:** Use AI to generate unique, long-form editorial content for the bottom half of each comparison page to avoid boilerplate footprints.
* **Shift to CMS/DB:** Move programmatic generation logic to D1 or a CMS to allow the marketing team to spin up new nodes dynamically.

## 7. Implementation Priorities
1. **Critical:** Add a dynamic "Recent Generations" grid to all `/use-case/[slug]` pages by querying the `posts` table based on the mapped `styles`.
2. **High:** Add unique FAQ structured data to every programmatic page.

## 8. Risk Analysis
* **Risk of Action:** Injecting DB queries into previously static programmatic pages will increase edge compute load.
* **Risk of Inaction:** Google's anti-spam algorithms may deindex the programmatic pages if they appear too template-driven.