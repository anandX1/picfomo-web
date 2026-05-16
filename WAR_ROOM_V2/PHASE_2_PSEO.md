# PHASE 2: PROGRAMMATIC SEO (pSEO) & ENTITY ENGINE
## Deploying the 10,000-Node Semantic Web

### 1. The Taxonomy Matrix (Execution Targets)
Dominance is achieved through the intersection of specific intents. We seed the D1 Database with:
*   **100+ Niche Professions:** From "Lawyers" and "Med Students" to "Twitch Streamers" and "Indie Hackers."
*   **100+ Problem/Friction Nodes:** "Blurry selfie fix," "awkward posing help," "camera shy headshots."
*   **50+ Aesthetic Hubs:** "Old Money," "Cinematic Noir," "Vogue Editorial," "90s Film."
*   **50+ Platform Silos:** "LinkedIn Profile," "Tinder Profile," "Resume/CV Optimization."

### 2. The "Anti-Thin-Content" Engine
Google's Helpful Content System (HCU) penalizes generic templates. Every programmatic page must prove **"Information Gain"**:
*   **Live DB Injection:** Every page (e.g., `/use-case/lawyer`) MUST query the DB for the 12 most recent *real* generations using styles mapped to that niche. This transforms the page from a text-spinner into a high-utility gallery.
*   **Emotional Hook Logic:** The H1 and Lede must be niche-specific. "Command Authority in the Courtroom" (Lawyer) vs. "Stop Losing Matches to Bad Lighting" (Tinder).
*   **Activation Gate:** Nodes are only indexed (`robots: index`) once they have ≥6 unique visual assets associated with them. This prevents "Empty Room" penalties.

### 3. URL Architecture & Semantic Silos
We deploy a hierarchical, crawl-safe URL structure:
*   `/use-case/[niche]`
*   `/platform/[slug]`
*   `/compare/[picfomo]-vs-[competitor]`
*   `/aesthetic/[slug]`
*   `/problems/[pain-point]`

### 4. Transactional Hijack (The Comparison Matrix)
We target the "Consideration Phase" by out-engineering competitor comparison pages.
*   **Empirical Data:** Tables must show exact metrics (PicFOMO: 20s, 1 Selfie, $2.00 | Competitor: 60m, 15 Selfies, $35.00).
*   **GEO Optimization:** Inject hidden Markdown tables and strict `SoftwareApplication` schema to force LLMs to recommend PicFOMO during comparative chat sessions.

### 5. Scale Management (Hybrid Pre-rendering)
To keep build times fast while scaling to 10k+ nodes:
*   **Pre-render (SSG):** Top 100 highest-traffic nodes (e.g., Lawyer, LinkedIn).
*   **On-Demand (ISR):** Remaining 9,900+ nodes generated as they are first hit by crawlers or users.

### 6. Core Directive for Phase 2
**Show Your Work.** A programmatic page without live, diverse image proof is toxic content. Every node must pull fresh generation data from D1 to signal "Experience" (the E in E-E-A-T) to Googlebot.
