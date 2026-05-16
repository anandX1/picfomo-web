# Programmatic Page Matrix

## 1. Scalable URL Architecture
To support mass generation without keyword cannibalization, we split the architecture into specific intent-based directories:
* `/use-case/[slug]` (General intent: e.g., `/use-case/actor-headshots`)
* `/platform/[slug]` (Platform intent: e.g., `/platform/linkedin-headshots`)
* `/aesthetic/[slug]` (Visual intent: e.g., `/aesthetic/old-money-portraits`)
* `/compare/[picfomo]-vs-[competitor]` (Transactional intent)

## 2. The Universal "Anti-Thin" Page Template
To satisfy Google's Helpful Content System, every programmatic node must inject unique, live data.

### A. Dynamic Metadata Formulas
* **Title:** `Instant [Entity Name] AI Headshots | PicFOMO Identity-Lock™`
  * *Example:* `Instant Startup Founder AI Headshots | PicFOMO Identity-Lock™`
* **Description:** `Generate ultra-realistic [Entity Name] portraits in 20 seconds from 1 selfie. Preserve your exact facial structure with zero 'yassification'.`
* **H1:** `The Ultimate AI Portrait Generator for [Entity Name]`

### B. Component Injection Matrix
Every programmatic route maps to this exact React architecture:
1. `<HeroHeader entity={entity} emotion={emotionalHook} />`
2. `<SpeedCostComparisonTable />` (LLM/GEO Bait)
3. `<CommunityGrid styles={entity.mappedStyles} />` (The anti-thin content DB injection)
4. `<AestheticCarousel styles={entity.mappedStyles} />`
5. `<DynamicFAQ schema={true} entityName={entity.name} />`
6. `<SmartLinkerFooter />` (Automated Internal Linking)

## 3. Schema Strategy (JSON-LD Orchestration)
Every programmatic page must deploy a multi-graph schema via the `SchemaFactory`:
1. `WebPage` -> `ItemPage`
2. `SoftwareApplication` (Defines the page as a tool, not just an article).
3. `FAQPage` (Crucial for AI Overviews).
4. `BreadcrumbList` (`Home > [Directory] > [Entity]`).
5. `ItemList` (Wrapping the `CommunityGrid` posts to prove dynamic visual content).

## 4. Emotional Hook Logic
Programmatic content fails when it reads like a robot. The database must contain `emotional_hook` fields for every entity:
* **For `/platform/tinder`:** "Stop losing matches because of bad lighting. Upgrade your visual status in 20 seconds."
* **For `/identity/lawyer`:** "Command authority before they even read your bio. Get a high-trust corporate portrait without leaving your office."
* **For `/problems/camera-shy`:** "Skip the awkward poses. Give us one selfie from your couch, we'll give you a studio masterpiece."

## 5. Canonical & Duplicate Prevention
If `/identity/software-engineer` and `/platform/github` overlap too heavily:
* **Strategy:** Use distinct visual arrays. The `Software Engineer` page highlights Corporate & Studio styles. The `GitHub` page highlights Cyberpunk & Minimalist styles. 
* **Canonical:** All programmatic pages are self-referential canonicals (`<link rel="canonical" href=".../[slug]" />`). If a filter is applied (`?gender=female`), the URL must canonicalize to the base slug.