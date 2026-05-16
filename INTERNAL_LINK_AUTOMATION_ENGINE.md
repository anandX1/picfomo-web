# Internal Link Automation Engine

## 1. Mathematical Authority Distribution
Internal links must not be treated as UX elements; they are vectors that distribute PageRank (PR) from high-traffic nodes to conversion nodes.

### The Flow Model
* **The Source:** The Homepage (`/`), `/explore` (highly shared), and top PR articles.
* **The Sinks:** The Comparison pages (`/compare/*`) and high-value Use Cases (`/use-case/linkedin`).
* **The Semantic Bridges:** The Glossary (`/glossary/*`) and Styles (`/styles/*`).

## 2. Automated Semantic Linking Algorithms
We must build a `<SmartLinker />` React component or a server-side text-parsing utility.

### A. The "Related Context" Engine
When a user views `/use-case/real-estate`:
* The DB queries for Use-Cases sharing similar Style mappings (e.g., both use `corporate-dslr`).
* It outputs: "People who generated Real Estate headshots also explored [Financial Advisor Headshots] and [Lawyer Headshots]."
* *Algorithmic Impact:* This clusters semantic entities perfectly for Google's NLP.

### B. The Text-Parsing Auto-Linker
In any long-form text (Glossary deep dives, Comparison analyses), if the exact string "Identity-Lock" or "PuLID" appears, the server automatically replaces it with `<a href="/glossary/identity-lock" class="semantic-link">Identity-Lock™</a>`.
* *Algorithmic Impact:* Ensures 100% exact-match anchor text consistency across the domain, aggressively signaling the meaning of the proprietary term to LLMs and search engines.

## 3. Crawl Depth & Orphan Prevention
Googlebot rarely crawls beyond a depth of 4 (clicks from the homepage).
* **The Infinite Lateral Crawl:** On a `/post/[id]` page, inject a `<MoreFromThisStyle styleId={style_id} />` component. This links to 4 other posts. Those 4 link to 4 more. 
* **Breadcrumbs:** Implement strictly hierarchical breadcrumbs (`Home > Styles > Corporate > Post 123`). This provides a guaranteed "upward" path for the crawler to return to the Hub.

## 4. PageRank Sculpting
* **No-Following the Junk:** Ensure links to `/sign-in`, `/privacy`, and external social media (unless deliberate) are de-prioritized or `nofollow`ed to preserve PR for the programmatic silos.
* **The Footer Matrix:** The footer should not contain 50 links. It should contain links to the *Hubs* (`/use-cases`, `/styles`, `/compare`, `/sitemaps`). The Hubs distribute the authority downward.