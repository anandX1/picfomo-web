"use client"; // Required for Framer Motion animations

import { motion } from "framer-motion";
import Link from "next/link";

// 🌟 REAL DATA: Using your actual Cloudflare R2 Studio assets!
const COMMUNITY_POSTS = [
  { id: 1, style: "Profile Break", image_url: "https://pub-ad6276faad1f4954ad679b43ef8c4afd.r2.dev/Gemini_Generated_Image_7jfy047jfy047jfy.png" },
  { id: 2, style: "Reins & Shadow", image_url: "https://pub-ad6276faad1f4954ad679b43ef8c4afd.r2.dev/1768355185519-cyd7mg.png" },
  { id: 3, style: "Sage & Still", image_url: "https://pub-ad6276faad1f4954ad679b43ef8c4afd.r2.dev/1775307126909-bd97sm.png" },
  { id: 4, style: "Rust & Rest", image_url: "https://pub-ad6276faad1f4954ad679b43ef8c4afd.r2.dev/1775308557046-canqft.png" },
  { id: 5, style: "Flock Selfie", image_url: "https://pub-ad6276faad1f4954ad679b43ef8c4afd.r2.dev/1775397538147-wbqu2l.png" },
  { id: 6, style: "Headlines", image_url: "https://pub-ad6276faad1f4954ad679b43ef8c4afd.r2.dev/1767951360678-4r7tke.png" },
  { id: 7, style: "Miniature Creation", image_url: "https://pub-ad6276faad1f4954ad679b43ef8c4afd.r2.dev/1775307048501-bki7ts.png" },
  { id: 8, style: "Self Creation", image_url: "https://pub-ad6276faad1f4954ad679b43ef8c4afd.r2.dev/Gemini_Generated_Image_k2973ik2973ik297.png" },
];

// We duplicate the array so the CSS infinite scroll loops perfectly
const SCROLL_ITEMS = [...COMMUNITY_POSTS, ...COMMUNITY_POSTS];

export default function Hero() {
  return (
    <section className="relative mx-auto max-w-[1120px] px-6 py-12 md:px-10 md:py-20 overflow-hidden">
      <div className="grid items-center gap-8 md:grid-cols-[1fr_480px] md:gap-16">
        
        {/* --- LEFT COLUMN: The Pitch --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Live Counter Eyebrow */}
          <div className="mb-6 inline-flex items-center gap-2 border border-[var(--color-gold-border)] bg-[var(--color-gold-pale)] px-3.5 py-1.5 font-[family-name:var(--mono)] text-[10px] md:text-[12px] uppercase tracking-[2px] md:tracking-[3px] text-[var(--color-gold)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-red)]"></span>
            28,398+ portraits created today
          </div>

          {/* Headline */}
          <h1 className="mb-5 font-[family-name:var(--display)] text-[clamp(44px,8vw,96px)] leading-[0.9] tracking-[-1px] text-[var(--color-ink)]">
            YOUR FACE.<br />
            <span className="text-[var(--color-gold)]">♾️ STYLES.</span><br />
            <span className="block font-[family-name:var(--serif)] text-[0.72em] font-normal italic text-[var(--color-ink3)]">
              ALL IN ONE PLACE.
            </span>
          </h1>

          {/* Responsive Font Size on Description */}
          <p className="mb-8 max-w-[440px] text-[16px] md:text-[20px] font-light leading-[1.6] md:leading-[1.75] text-[var(--color-ink2)]">
            Pick a trending style — Ghibli, IPL cricket card, Bollywood poster. Drop a selfie. Get a portrait so stunning you'll actually change your Profile Picture.
          </p>

          {/* CTAs - Mobile optimized flex behavior */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4">
            <Link
              href="/sign-up"
              className="flex w-full sm:w-auto items-center justify-center gap-2.5 bg-[var(--color-ink)] px-8 py-3.5 md:py-4 font-[family-name:var(--display)] text-[16px] md:text-[18px] tracking-[2px] text-[var(--color-gold-light)] shadow-[var(--shadow-md)] transition-all hover:-translate-y-0.5 hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)] hover:shadow-[var(--shadow-lg)]"
            >
              Create Free Portrait <span>→</span>
            </Link>
            <button className="flex w-full sm:w-auto justify-center sm:justify-start items-center gap-1.5 bg-transparent py-2 text-[13px] font-medium text-[var(--color-ink2)] transition-colors hover:text-[var(--color-ink)]">
              <span>▶</span> See how it works
            </button>
          </div>
        </motion.div>

        {/* --- DESKTOP RIGHT COLUMN: The Vertical Live Wall --- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative hidden h-[600px] w-full overflow-hidden md:block"
        >
          {/* Fade masks for smooth disappearance at top and bottom */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-[var(--color-white)] to-transparent"></div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-[var(--color-white)] to-transparent"></div>

          <div className="grid h-full grid-cols-2 gap-4">
            {/* Column 1: Scrolls Up */}
            <div className="animate-scroll-up flex flex-col gap-4 hover:[animation-play-state:paused]">
              {SCROLL_ITEMS.slice(0, SCROLL_ITEMS.length / 2).map((post, idx) => (
                <LiveWallCard key={`col1-${idx}`} post={post} />
              ))}
            </div>

            {/* Column 2: Scrolls Down (Offset margin to stagger the start) */}
            <div className="animate-scroll-down -mt-[300px] flex flex-col gap-4 hover:[animation-play-state:paused]">
              {SCROLL_ITEMS.slice(SCROLL_ITEMS.length / 2).map((post, idx) => (
                <LiveWallCard key={`col2-${idx}`} post={post} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* --- MOBILE ONLY: Horizontal Auto-Rotating Styles --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative mt-10 block w-[calc(100%+3rem)] -mx-6 overflow-hidden md:hidden"
      >
        {/* Left and Right Fade masks to make scrolling look natural edge-to-edge */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[var(--color-white)] to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[var(--color-white)] to-transparent"></div>

        {/* The horizontal infinite scroll container using our custom Tailwind animation */}
        <div className="flex w-max animate-scroll-left gap-3">
          {SCROLL_ITEMS.map((post, idx) => (
            <div key={`mobile-scroll-${idx}`} className="w-[140px] shrink-0">
              <LiveWallCard post={post} />
            </div>
          ))}
        </div>
      </motion.div>

    </section>
  );
}

// Sub-component for individual portrait cards
function LiveWallCard({ post }: { post: any }) {
  return (
    // 🌟 THE FIX: This entire card is now a Link that redirects to /sign-up when clicked!
    <Link href="/sign-up" className="group relative aspect-[3/4] w-full cursor-pointer overflow-hidden shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)] rounded-xl block">
      
      {/* Background container */}
      <div className="absolute inset-0 h-full w-full bg-gray-200">
        {/* Actual Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={post.image_url} 
          alt={post.style} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Style Badge */}
      <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 z-20 bg-[var(--color-gold)] px-2.5 py-1 md:px-3 font-[family-name:var(--display)] text-[10px] md:text-[12px] tracking-[1px] text-[var(--color-ink)] shadow-sm">
        {post.style}
      </div>

      {/* Hover Overlay: "Try this style" */}
      <div className="absolute inset-0 z-10 flex items-center justify-center border-2 border-[var(--color-gold)] bg-[rgba(200,151,31,0.12)] opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
        <span className="bg-[var(--color-gold)] px-4 py-1.5 font-[family-name:var(--display)] text-[12px] md:text-[14px] tracking-[1.5px] text-[var(--color-ink)] shadow-lg">
          TRY THIS →
        </span>
      </div>
    </Link>
  );
}