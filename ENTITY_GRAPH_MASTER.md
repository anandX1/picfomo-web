# Master Entity Graph

## 1. Core Semantic Topology
PicFomo's knowledge graph operates on a hub-and-spoke model where **Identity** is the central node, surrounded by Context, Aesthetic, and Technology.

### A. Core Entities (The "What")
* **Digital Identity:** Avatar, DP, Profile Picture, Headshot, Portrait.
* **Search Intent:** Transactional & Navigational.
* **Emotional State:** Anxiety, Need for representation.
* **Modifiers:** Professional, AI-generated, High-resolution, Authentic.
* **Fears:** Uncanny valley, looking fake, being judged.
* **Desires:** Status elevation, approachability, respect.
* **Related Subtopics:** Lighting, Posing, Backgrounds, Attire.
* **Internal Linking:** Hubs pointing to Styles, Use-cases, and Pricing.

### B. Context & Career Entities (The "Where & Who")
* **Professional:** LinkedIn, Resume, Slack, Outlook, Corporate Directory, Real Estate, Law, Tech Founder.
* **Creator/Social:** Twitch, TikTok, Dating Apps (Hinge/Tinder), Instagram, Podcast Host.
* **Search Intent:** Problem-Aware & Solution-Aware.
* **Emotional State:** Urgency, Competitive pressure, FOMO.
* **Modifiers:** Fast, Instant, Specific to [Industry], For [Platform].
* **Fears:** Irrelevance, swiped left, ignored by recruiters.
* **Desires:** More matches, higher open rates, interview callbacks.
* **Related Subtopics:** Personal branding, remote work presence, digital first impressions.
* **Internal Linking:** `/use-case/*` -> `/styles/*` -> `/post/*` -> `/explore`.

### C. Aesthetic Entities (The "How it Looks")
* **Aesthetics:** Corporate, Cinematic, 90s Yearbook, Old Money, Cyberpunk, Moody, Editorial, DSLR, Studio.
* **Search Intent:** Inspiration & Discovery.
* **Emotional State:** Vanity, Curiosity, Aspiration.
* **Modifiers:** Aesthetic, Vibe, Filter, Look, Style.
* **Fears:** Looking dated, looking generic.
* **Desires:** Virality, uniqueness, compliments.
* **Related Subtopics:** Color grading, focal length, film stock, lighting ratios.
* **Internal Linking:** `/styles/*` -> `/use-case/*` -> `/explore`.

### D. Technical Entities (The "How it Works")
* **Technologies:** Latent Diffusion, SDXL, LoRA, PuLID, Identity-Lock™, Inference Steps, Vector Mapping.
* **Search Intent:** Informational & Validation.
* **Emotional State:** Skepticism, Intellectual curiosity.
* **Modifiers:** How it works, technology behind, engine, realism.
* **Fears:** Data privacy, scam, "waxy" output.
* **Desires:** Proof of quality, technological superiority.
* **Related Subtopics:** Face swapping, prompt engineering, upscaling.
* **Internal Linking:** `/glossary/*` -> `/compare/*` -> Homepage.

### E. Trust & GEO Entities (The "Why PicFomo")
* **Trust Vectors:** Reviews, Refund Policy, Speed (20 Seconds), 1-Selfie Input, Anti-Yassification.
* **Search Intent:** Transactional Validation & Comparison.
* **Emotional State:** Cautious, Risk-averse.
* **Modifiers:** vs, alternative, review, safe, legit, reddit.
* **Fears:** Wasting money, getting hacked.
* **Desires:** Guarantee, instant gratification, safety.
* **Related Subtopics:** Competitor flaws, empirical speed tests.
* **Internal Linking:** `/compare/*` -> `/reddit/` (curated sentiment) -> Pricing.

## 2. The Entity Linking Algorithm
For search engines and LLMs to understand this graph, pages must interlink logically, not randomly.
* **The Tripartite Rule:** Every specific node (e.g., `/use-case/lawyer-headshots`) MUST link to a Core Node (Headshots), an Aesthetic Node (`/styles/corporate`), and a Technical Node (`/glossary/identity-lock`). This triangulates meaning for the crawler.