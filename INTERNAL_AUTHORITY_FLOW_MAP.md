# Internal Authority Flow Map

## 1. PageRank Flow & Graph Theory
In a 1000-node network, PageRank (PR) dilution is the primary risk. The architecture must force PR into high-conversion semantic hubs rather than letting it bleed out across paginated feeds.

### The Flow Hierarchy
1. **The Root (Tier 1):** Homepage (`/`). Gathers 80% of external backlinks.
2. **The Commercial Hubs (Tier 2):** `/use-cases`, `/platforms`, `/aesthetics`, `/compare`. (Distributes PR downward).
3. **The Semantic Leaves (Tier 3):** `/use-case/lawyer`, `/platform/linkedin`, `/compare/picfomo-vs-aragon`. (Traps PR and converts).
4. **The Visual Proof Nodes (Tier 4):** `/post/[id]`. (Creates infinite crawl spaces and hits Google Images).

## 2. Contextual Cross-Linking Rules (The D1 Linker)
Static links fail at scale. We must use the D1 Database to create contextual bridges.

* **Rule 1 (Sibling Linking):** A Tier 3 node must link to 3-5 semantically related sibling nodes. 
  * *Example:* `/use-case/travel-nurse` queries D1 for other "Healthcare" nodes and outputs: *Related: [Doctor Headshots], [Therapist Portraits]*.
* **Rule 2 (Glossary Reinforcement):** Every programmatic page must use the `<SmartLinker />` to wrap technical terms (e.g., "Identity-Lock", "SDXL") to point to Tier 3 Glossary nodes. This proves topical authority to Google's NLP.
* **Rule 3 (The Proof Waterfall):** Tier 3 programmatic nodes MUST inject a `<CommunityGrid>` pointing to Tier 4 `/post/[id]` pages. This guarantees Googlebot finds deep, fresh image content.
* **Rule 4 (The Upward Gravity):** Every Tier 4 `/post/[id]` MUST link upward to its parent `/style/[slug]` and the user profile `/u/[username]`.

## 3. Crawl Depth & Orphan Prevention
Googlebot allocates crawl budget based on depth (clicks from Home).
* **The Problem:** Post #8,400 is 50 pagination clicks deep on the `/explore` feed. It becomes an orphan.
* **The Solution (The Matrix Sitemap):** 
  1. Generate `/sitemap-posts-[chunk].xml`.
  2. Implement a "Trending Related Posts" grid on every `/post/[id]` page. This creates a lateral web. If Googlebot lands on Post A, it can crawl laterally to Post B, C, D, and E without ever needing the `/explore` feed.

## 4. Semantic Hub Structure
We will build specific "Pillar Pages" to act as gravitational centers.
* **The "Professional Identity" Pillar:** A massive 3,000-word guide on the psychology of headshots, heavily backlinked. It contains zero product UI, just pure education. 
* **The Flow:** This pillar links out to all 100 `/identity/*` nodes. As the Pillar gains external backlinks, the PR flows perfectly down into the 100 commercial programmatic pages.