# Internal Linking & Authority Flow System

## 1. The Physics of PageRank Gravity
In a scalable programmatic architecture, PageRank (link equity) must be directed mathematically, not randomly. We must channel authority from high-traffic "Viral" nodes down to high-conversion "Money" nodes, and from high-authority "Pillar" nodes down to deep "Long-tail" nodes.

## 2. Hub-and-Spoke Semantic Silos
We will construct three primary silos. Cross-linking between silos is allowed but must be highly contextual to prevent semantic dilution.

### Silo A: The Commercial "Use-Case" Hub
* **Hub Page:** `/use-cases` (The Ultimate Guide to AI Headshots).
* **Spokes:** `/use-case/lawyer`, `/use-case/real-estate`, etc.
* **Authority Flow:** The Hub page accumulates external backlinks (PR, guides). It passes this authority equally to the spokes. The spokes link *up* to the Hub, and *laterally* to related spokes (e.g., Lawyer links to Financial Advisor).

### Silo B: The Transactional "Comparison" Hub
* **Hub Page:** `/alternatives` or `/compare` (The AI Headshot Market Matrix).
* **Spokes:** `/compare/picfomo-vs-aragon`, `/compare/picfomo-vs-headshotpro`.
* **Authority Flow:** These are "Money Pages." The Homepage and Footer must link directly to the Comparison Hub. The spokes link *out* to the Glossary (to prove technical superiority) but *never* link out to competitor sites (to trap PageRank).

### Silo C: The Technical "Glossary" Hub (Semantic Reinforcement)
* **Hub Page:** `/glossary` (The Encyclopedia of AI Generative Art).
* **Spokes:** `/glossary/identity-lock`, `/glossary/pulid`, `/glossary/latent-space`.
* **Authority Flow:** These pages exist purely for Semantic Reinforcement and LLM Citation. They attract organic backlinks from tech blogs. They heavily link *out* to the Commercial Hub (e.g., "See Identity-Lock in action for Real Estate Agents").

## 3. Dynamic Node Linking (The D1 Engine)
Static links are not enough. We must build contextual relevance pathways driven by the database:
* **Post-to-Style:** Every `/post/[id]` page links to its parent `/style/[slug]`.
* **Style-to-UseCase:** Every `/style/[slug]` page runs a DB query: "Which Use-Cases map to this style?" and renders links: "Perfect for: [Lawyers], [Founders]".
* **UseCase-to-Post:** Every `/use-case/[slug]` queries the DB for the 12 most recent public posts using its recommended styles, linking down to the deep `/post/[id]` nodes.

## 4. The "Orphan Prevention" Waterfall
With 10,000+ posts, older posts will lose internal links and fall out of Google's index.
* **The Fix:** Implement a `/sitemap/archive/` structure linked from the footer. Additionally, introduce a "Trending in this Style" widget on the `/post/[id]` page, creating an infinite lateral crawl path for Googlebot (Post A -> Post B -> Post C).

## 5. Strategic Target Allocation
* **Accumulate Backlinks:** Homepage, `/glossary/identity-lock`, `/research` (Data studies).
* **Target AI Overviews:** `/compare/*` (Empirical tables), `/glossary/*` (Definitions).
* **Target Image Packs:** `/post/[id]` and `/styles/[slug]` (High-res, Alt-text rich).
* **Target Reddit/Validation:** `/problems/*` and `/compare/*`.