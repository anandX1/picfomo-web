# Database Semantic Schema

## 1. Relational Entity Model (D1 Architecture)
To support 10,000+ programmatic pages and automated internal linking, the static `src/data/*.ts` files must migrate to a relational Cloudflare D1 schema.

### Core Tables
* **`entities_usecase`**: `id`, `slug`, `title`, `h1`, `emotional_hook`, `meta_description`, `schema_faqs` (JSON).
* **`entities_style`**: `id`, `slug`, `name`, `lora_weights`, `category_id`, `is_active`.
* **`entities_glossary`**: `id`, `slug`, `term`, `definition`, `deep_dive`.
* **`entities_compare`**: `id`, `slug`, `competitor_name`, `metrics_json` (Speed, Cost, etc.).

### Mapping Tables (The Semantic Graph)
* **`map_usecase_style`**: `usecase_id`, `style_id`, `relevance_score`. (Allows `/use-case/lawyer` to pull `corporate-dslr`).
* **`map_post_style`**: Handled natively in `posts.style_id`.
* **`map_glossary_relation`**: `source_term_id`, `target_term_id`. (e.g., `Identity-Lock` relates to `PuLID`).

## 2. Tagging & Taxonomy Architecture
* **Vector Tagging:** Every `post` must inherit the semantic tags of its `style` and the associated `usecase`.
* **Freshness Signal Logic:** Create a materialized view or scheduled worker that calculates the "Trending Score" of a style based on post velocity. The `/explore` feed sorts by this score, ensuring Googlebot always sees highly dynamic, fresh content on hub pages.

## 3. Automated Internal-Link Graph Generation
With the relational mapping, internal linking becomes deterministic:
1. When rendering `/style/[slug]`, the server queries `map_usecase_style`. It loops through results and injects: `<a href="/use-case/lawyer">Used for Lawyer Headshots</a>`.
2. When rendering `/use-case/[slug]`, the server queries `entities_glossary` using a simple text-match against the `deep_dive` content. If the use-case mentions "facial accuracy", it automatically wraps it in a link to `/glossary/identity-lock`.

## 4. Algorithmic Rationale
Google's PageRank is a Markov chain. By creating a dense, strictly mapped relational database, we programmatically guarantee that PageRank flows symmetrically. No entity is ever orphaned. Every new post reinforces a style, which reinforces a use-case, signaling massive topical density to the crawler.