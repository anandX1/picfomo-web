# PicFOMO Frontend UI & Style Guidelines

These are the core architectural and stylistic mandates for building the PicFOMO UI. **Always adhere to these principles** when creating or modifying frontend components.

## 1. Aesthetic & Vibe (Luxury AI)
- **Theme:** High-end, hyper-modern, "cinematic".
- **Colors:** Predominantly ultra-dark backgrounds (`bg-black` or `#050505`) with high-contrast stark white (`bg-white`) for primary focal points (like the Upload Box).
- **Accents:** Use `var(--gold)` and `var(--gold-glow)` for hover states, active states, and premium highlights. Do not overuse gold; it should feel earned and intentional.
- **Backgrounds:** Use subtle animated WebGL/CSS gradients and noise textures (e.g., `spectra-bg`) strictly behind the UI (`z-index: -1`). The background must never compete with the content.

## 2. Typography
- **Font Family:** `Plus Jakarta Sans` for headers (Display), `Inter` for body text.
- **Hierarchy:** 
  - **Hero Titles:** Massive, bold, and tracking-tight (`text-5xl` to `text-8xl`, `font-extrabold`, `tracking-tighter`, `leading-none` or `leading-[0.9]`).
  - **Subtitles:** Readable and slightly muted (`text-gray-300`, `text-lg` to `text-xl`, `leading-relaxed`).
  - **Labels:** Tiny, uppercase, wide tracking (`text-[10px]` or `text-xs`, `uppercase`, `tracking-widest`, `font-black`).

## 3. UI Components (Structure & `cn` Utility)
- Always use the `cn` utility (`src/lib/utils.ts`) to safely merge tailwind classes:
  ```typescript
  import { cn } from "@/lib/utils";
  <div className={cn("base-classes", isHovered && "hover-classes", className)}>
  ```
- **Cards & Surfaces:** Use large border radii (`rounded-[2rem]`, `rounded-[1.5rem]`). Use deep shadows (`shadow-2xl`, `shadow-[0_40px_100px_rgba(0,0,0,0.6)]`) to create physical depth. 
- **Buttons:** Use the `fluid-btn` pattern for primary CTAs. Buttons should have clear states (idle, hover, active).

## 4. Interactions & Animations
- **Motion:** Use `framer-motion` for complex entering/exiting animations, or CSS transitions for simple hover states. Keep animations tight (duration around `300ms` to `500ms`) and use customized easing (e.g., `cubic-bezier(0.16, 1, 0.3, 1)`).
- **Hover Effects:** Interactive elements must have a clear visual change. Use intense glows (`blur-[80px]`), scale effects (`group-hover:scale-[1.02]`), and border color shifts (`group-hover:border-[var(--gold)]`).
- **Tactility:** 3D Tilt effects (based on mouse position) should be used on showcase cards to make the interface feel alive. Disable these on mobile using `window.matchMedia("(hover: none)").matches`.

## 5. Layout & Spacing
- **Mobile First:** Ensure perfect rendering on smartphone screens. Use `flex-col` for mobile and `lg:flex-row` for desktop.
- **Cognitive Load:** Keep interfaces sparse. Emphasize one primary action (e.g., the White Upload Box) and mute secondary actions.
- **Scroll:** Utilize `Lenis` for smooth scrolling where applicable to maintain a premium feel. Use scroll-driven animations for "How it works" or timeline sections.

## 6. CSS Specificity & Layering
- **Isolation:** Always use `isolation: isolate` and explicit `z-index` (e.g., `z-[50]`) on foreground text and interactive cards to ensure they are never covered by background glows or pseudo-elements.
- **Utility Override:** When standard tailwind utilities fail against custom CSS, use hardcoded styles or the `!important` flag sparingly (e.g., `!bg-white`) to enforce critical visibility.

---

# 🚀 Technical Memory & Project Achievements
*This section is a persistent ledger of PicFOMO's technical evolution. Update this section after every major feature implementation.*

## Current Phase: Content Velocity & Viral Growth (May 2026)

### 1. Data-Driven Use-Case Engine
- **Achievement:** Implemented a scalable pSEO architecture for targeting specific user niches.
- **Implementation:** Centralized repository at `src/data/use-cases.ts` supporting 14 niches (Lawyers, Twitch Streamers, Real Estate, etc.).
- **Impact:** Dynamic route `/use-case/[slug]` renders hyper-targeted landing pages with custom SEO metadata and recommended styles.

### 2. Viral Backlink Magnet: AI Selfie Grader
- **Achievement:** Built a free utility to drive viral traffic and attract high-quality backlinks.
- **Implementation:** `/grader` route featuring a cinematic scanning UI and client-side canvas heuristics for lighting/composition analysis.
- **Impact:** High-visibility Navbar link with pulsing notification; provides a "Professionalism Score" that funnels directly into the AI generation flow.

### 3. Competitor Comparison Engine (pSEO)
- **Achievement:** Architected a system to poach high-intent traffic from established competitors.
- **Implementation:** `src/data/comparisons.ts` mapping PicFOMO vs 10 major competitors (Aragon, HeadshotPro, etc.).
- **Impact:** Dynamic route `/compare/[slug]` displays side-by-side technical wins (Speed, Accuracy, Price), auto-indexed in the sitemap.

### 4. Technical SEO Foundation
- **Achievement:** Established a world-class indexing and metadata system.
- **Implementation:** Dynamic `sitemap.ts` that auto-discovers use-cases, comparisons, styles, and community posts. Comprehensive JSON-LD integration across all landing pages.

### 5. Performance & Bundle Optimization
- **Achievement:** Optimized initial load time and font rendering for "Luxury AI" speed.
- **Implementation:**
  - **LazyMotion:** Integrated `framer-motion`'s `LazyMotion` with `domMax` in `ClientLayout.tsx` to reduce the initial JS bundle size.
  - **Next.js Fonts:** Switched to `next/font/google` for `Plus_Jakarta_Sans` and `Inter`, implementing `display: swap` and CSS variables to eliminate layout shifts (CLS).
  - **Aggressive Code-Splitting:** Implemented `next/dynamic` in `MarketingClient.tsx` to lazy-load all below-the-fold components (FAQ, Pricing, Timeline, etc.).
  - **Hardware Acceleration:** Added `will-change` properties to all high-frequency animation elements (Hero cards, SVG paths, liquid backgrounds) to ensure 60fps smoothness.
  - **Responsive Image Assets:** Refined `sizes` attributes across the landing page to prevent downloading desktop-sized assets on mobile devices.

### 6. Information Gain: Deep-Dive AI Glossary
- **Achievement:** Established PicFOMO as a technical authority via a comprehensive AI Glossary.
- **Implementation:**
  - **Data Repository:** `src/data/glossary.ts` containing hyper-detailed technical definitions for 10+ core AI concepts (PuLID, LoRA, Identity-Lock, CFG Scale, etc.).
  - **Semantic SEO:** Fully implemented `DefinedTermSet` and `DefinedTerm` JSON-LD schemas to explicitly signal educational value to Googlebot.
  - **Dynamic Routing:** Scalable `/glossary/[slug]` architecture with a searchable, alphabetized index at `/glossary`.
  - **Conversion Pivot:** Every glossary term deep-dive concludes with a high-contrast CTA to use the "Zero-Prompt" generator, turning educational traffic into users.

---

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- ALWAYS read graphify-out/GRAPH_REPORT.md before reading any source files, running grep/glob searches, or answering codebase questions. The graph is your primary map of the codebase.
- IF graphify-out/wiki/index.md EXISTS, navigate it instead of reading raw files
- For cross-module "how does X relate to Y" questions, prefer `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` over grep — these traverse the graph's EXTRACTED + INFERRED edges instead of scanning files
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

---

# "Luxury AI" SEO Overhaul & Blog Strategy (2026 Mandate)

This section outlines the persistent strategy for PicFOMO's search engine dominance. All future development must align with these directives.

## 1. Core Principles: Depth Over Breadth
- **Technical Perfection:** Prioritize deep technical execution (JSON-LD, Schema.org Article/WebApplication schemas, semantic HTML5, server-side rendering) over volume.
- **Structural Integrity:** Every public route must have dynamic meta tags (`title`, `description`, `canonical`, `og:image`) and be auto-indexed in `src/app/sitemap.ts`.
- **Keyword Philosophy:** Target low-competition, high-intent long-tail keywords (e.g., "realistic eyes in AI headshots", "AI headshots for real estate agents") rather than high-competition generic terms.

## 2. Blog & Guide Architecture
- **Programmatic Scale:** Use dynamic routes (`/blog/[slug]`, `/guides/[slug]`, `/use-case/[slug]`) to generate targeted landing pages at scale while maintaining a unique, premium design.
- **Authority Signals (E-E-A-T):** 
  - Every article must be plagiarism-free and original.
  - Include 4-5 strategic outbound links to high Domain Authority (DA > 80) sites (academic journals, industry authorities, reputable tech news).
- **Internal Linking:** Every guide or blog post must naturally funnel the user back to the primary generation tools via high-contrast CTA sections.

## 3. SEO-Driven UX (2026 Authenticity Shift)
- Search trends for 2026 prioritize "authenticity" and "skin texture" over "plastic-looking AI".
- SEO content must reflect this shift, positioning PicFOMO's Identity-Lock™ technology as the solution for *realism*, not just generation.

