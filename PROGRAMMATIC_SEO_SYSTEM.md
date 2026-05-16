# Programmatic SEO Architecture

## 1. Structural Overview
The goal is to generate 10,000+ highly relevant, non-thin, contextually rich landing pages that target every conceivable long-tail search intent. This requires shifting from static arrays to a headless CMS or D1-backed dynamic routing system with aggressive ISR caching.

## 2. URL Architecture & Semantic Silos
* `/use-case/[niche]` (Top-level commercial intent)
* `/styles/[category]/[aesthetic]` (Visual/Inspiration intent)
* `/compare/[picfomo]-vs-[competitor]` (Aggressive transactional intent)
* `/glossary/[term]` (Technical/Informational intent)
* `/industry/[vertical]` (B2B/Enterprise intent)
* `/problems/[pain-point]` (Problem-aware DIY intent)
* `/alternatives/[competitor]-alternatives` (Competitor hijack intent)

## 3. The 100x Taxonomy Arrays (Execution Targets)

### A. 100 Niche Professions (`/ai-headshots-for/` or `/use-case/`)
*Real Estate Agent, Lawyer, Therapist, Tech Founder, Indie Hacker, Travel Nurse, Yoga Instructor, DJ, Software Engineer, Product Manager, Scrum Master, UX Designer, Financial Advisor, Wealth Manager, Life Coach, Keynote Speaker, Author, Fiction Writer, Pastor, Dentist, Surgeon, Med Student, Law Student, PhD Candidate, TikTok Creator, Twitch Streamer, OnlyFans Creator, Cosplayer, E-sports Athlete, Personal Trainer, Nutritionist, Chef, Sommelier, Somatic Healer, Reiki Practitioner, VC Partner, Angel Investor, Sales Executive, SDR, Account Executive, Customer Success Manager... (Expand to 100).*

### B. 100 Emotional/Problem Concepts (`/problems/`)
*Blurry selfie fix, unphotogenic headshot solutions, hate taking pictures, awkward posing fixes, camera shy headshots, urgent headshot needed tomorrow, cheap headshot alternatives, DIY linkedin photo, bad lighting selfie fix, double chin headshot fix, asymmetrical face headshot, older professional headshots, ageism in tech headshots, fatphobic camera angles fix, sweaty headshot fix... (Expand to 100).*

### C. 50 Style Taxonomy Concepts (`/styles/[category]/[aesthetic]`)
*Categories: Corporate, Cinematic, Vintage, Creative, Lifestyle, Dating.*
*Aesthetics: 90s Yearbook, Old Money, Cyberpunk, Neon Noir, Golden Hour, 35mm Film, Disposable Camera, Studio Grey, Executive Blue, Tech Bro Vest, Silicon Valley Casual, Wall Street Suit, Startup Hoodie, Coffee Shop Natural, Sun-drenched, Moody Studio, High Fashion, Vogue Editorial, GQ Cover, Forbes List... (Expand to 50).*

### D. 50 Comparison Page Concepts (`/compare/` & `/alternatives/`)
*PicFomo vs Aragon, PicFomo vs HeadshotPro, PicFomo vs BetterPic, PicFomo vs Remini, PicFomo vs Canva AI, PicFomo vs TryItOn, PicFomo vs PhotoAI, PicFomo vs Secta AI, PicFomo vs StudioShot, PicFomo vs ProPhotos, Aragon AI alternatives, HeadshotPro free alternatives, Remini professional alternatives, Canva headshot alternative... (Expand to 50).*

## 4. Page Anatomy: The "Anti-Thin" Template
To avoid Google's Helpful Content penalties, programmatic pages cannot just swap out H1 tags. Every programmatic page must include:
1. **Dynamic H1 & Lede:** "AI Headshots for [Niche]".
2. **Contextual Emotional Hook:** "Why [Niche] needs a great headshot (e.g., Trust in Healthcare, Authority in Law)."
3. **Live DB Injection (Crucial):** A grid of 6-12 *real* `/post/[id]` generations that used the specific styles recommended for this niche. (e.g., Lawyer page pulls Corporate styles).
4. **Empirical Data Table:** Speed vs Cost vs Output metrics.
5. **Dynamic FAQ Schema:** 3-5 unique FAQs tailored to the niche. ("Can I use an AI headshot on the State Bar registry?").
6. **Internal Links:** "Recommended Styles for [Niche]", "Related Professions".

## 5. Canonicalization & Indexation Logic
* **Pagination:** `/explore?page=2` must use `<link rel="next">` and `<link rel="prev">`.
* **Faceted Search:** If users can filter `/styles?color=dark`, those URLs must be `noindex` or canonicalized to `/styles` to prevent infinite crawl spaces.
* **Orphan Prevention:** All programmatic nodes must be listed in dynamically generated, paginated HTML sitemaps (`/sitemap/professions`, `/sitemap/styles`), linked from the footer.

## 6. GEO Optimized Schema Strategy
Every programmatic page receives:
1. `WebPage` -> `ItemPage`
2. `FAQPage` (For AI Overviews)
3. `SoftwareApplication` (Reinforcing the engine)
4. `BreadcrumbList` (Mapping the hierarchy for LLMs)
5. `ItemList` (If displaying a grid of styles/posts)