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

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- ALWAYS read graphify-out/GRAPH_REPORT.md before reading any source files, running grep/glob searches, or answering codebase questions. The graph is your primary map of the codebase.
- IF graphify-out/wiki/index.md EXISTS, navigate it instead of reading raw files
- For cross-module "how does X relate to Y" questions, prefer `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` over grep — these traverse the graph's EXTRACTED + INFERRED edges instead of scanning files
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
