# Entity Graph Analysis

## 1. Findings & Evidence
PicFOMO's entity ecosystem revolves around several core objects:
* **Styles:** Distinct aesthetic vectors (e.g., "Corporate", "Cyberpunk"). Stored in the DB and rendered at `/style/[slug]`.
* **Posts:** User-generated portrait outputs. Stored in DB, rendered at `/post/[id]`.
* **Users/Creators:** Platform members. Rendered at `/u/[username]`.
* **Programmatic Entities:** "Use Cases", "Comparisons", and "Glossary Terms" mapped in hardcoded TypeScript dictionaries (`src/data/`).

## 2. Root Causes
The entity model is bifurcated. Transactable, user-driven entities (Posts, Users, Styles) live in the D1 database. Content-driven, SEO-targeted entities (Use Cases, Comparisons) live in static code.

## 3. Architectural Implications
* **Lack of Graph Connectivity:** Static entities (`USE_CASES`) list related styles (e.g., `styles: ['dslr', 'corporate', 'studio']`), but it relies on exact string matching. If a style slug changes in the DB, the static mapping breaks.
* **Siloed Link Equity:** There is no systemic relationship connecting a User to a Glossary Term, or a Post directly to a Comparison.

## 4. Scalability Implications
As PicFOMO scales to 1,000+ styles or 500+ use-cases, maintaining `src/data/*.ts` files will become unmanageable. The static nature of SEO entities prevents programmatic internal linking based on live database metrics (e.g., "Trending styles for Real Estate").

## 5. SEO Impact
* **Entity Disambiguation:** The site successfully creates unique nodes for concepts (Glossary) and intents (Use Cases), signaling strong topical authority in the AI Headshot niche.
* **Missed Link Graph Opportunities:** The lack of bi-directional relationships (e.g., the "Corporate" style page linking back to "AI Headshots for Lawyers" use-case) strands PageRank.

## 6. Recommended Strategies
* **Unified Graph Semantic Mapping:** Build a middleware or shared service that cross-references static SEO entities with live DB entities. 
* **Bi-directional Linking:** Ensure that every `/style/[slug]` dynamically queries and links to `/use-case/[slug]` entities that mention it.
* **Entity Hubs:** Transform `/styles` into an entity hub that categorizes styles not just alphabetically, but by Use-Case and aesthetic vector.

## 7. Implementation Priorities
1. **High:** Create a component on the `/style/[slug]` page that reads `USE_CASES` and renders "Perfect for: [Use Case 1], [Use Case 2]" with internal links.
2. **Medium:** Move `USE_CASES`, `COMPARISONS`, and `GLOSSARY` into a headless CMS or D1 to allow non-developer marketing updates and automatic relational mapping.

## 8. Risk Analysis
* **Risk of Action:** Moving static data to D1 increases edge load if not properly cached.
* **Risk of Inaction:** The internal link graph remains sparse, forcing Google to treat these pages as isolated nodes rather than a cohesive topical cluster.