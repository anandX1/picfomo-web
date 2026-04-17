"use client"; // Required for Framer Motion animations

import { motion } from "framer-motion";
import Link from "next/link";

// MOCK DATA: Using local paths. Drop your sample images into the `public/images/` folder!
const COMMUNITY_POSTS = [
  { id: 1, style: "Ghibli", bgClass: "c-ghibli", image_url: "/images/ghibli.jpg" },
  { id: 2, style: "IPL Card", bgClass: "c-ipl", image_url: "/images/ipl.jpg" },
  { id: 3, style: "Bollywood", bgClass: "c-bolly", image_url: "/images/bollywood.jpg" },
  { id: 4, style: "Action Fig", bgClass: "c-action", image_url: "/images/action.jpg" },
  { id: 5, style: "Wedding", bgClass: "c-wedding", image_url: "/images/wedding.jpg" },
  { id: 6, style: "Cyber Desi", bgClass: "c-cyber", image_url: "/images/cyber.jpg" },
];

// We duplicate the array so the CSS infinite scroll loops perfectly
const SCROLL_ITEMS = [...COMMUNITY_POSTS, ...COMMUNITY_POSTS];

export default function Hero() {
  return (
    <section className="relative mx-auto max-w-[1120px] px-6 py-16 md:px-10 md:py-20">
      <div className="grid items-center gap-12 md:grid-cols-[1fr_480px] md:gap-16">
        
        {/* --- LEFT COLUMN: The Pitch --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Live Counter Eyebrow */}
          <div className="mb-6 inline-flex items-center gap-2 border border-[var(--color-gold-border)] bg-[var(--color-gold-pale)] px-3.5 py-1.5 font-[family-name:var(--mono)] text-[10px] uppercase tracking-[3px] text-[var(--color-gold)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-red)]"></span>
            14,837 portraits created today
          </div>

          {/* Headline */}
          <h1 className="mb-5 font-[family-name:var(--display)] text-[clamp(52px,7vw,96px)] leading-[0.86] tracking-[-1px] text-[var(--color-ink)]">
            YOUR FACE.<br />
            <span className="text-[var(--color-gold)]">47 WORLDS.</span><br />
            <span className="block font-[family-name:var(--serif)] text-[0.72em] font-normal italic text-[var(--color-ink3)]">
              no photographer needed.
            </span>
          </h1>

          <p className="mb-9 max-w-[440px] text-[16px] font-light leading-[1.75] text-[var(--color-ink2)]">
            Drop a selfie. Pick a trending style — Ghibli, IPL cricket card, Bollywood poster. Get a portrait so stunning you'll actually change your DP.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/sign-up"
              className="flex items-center gap-2.5 bg-[var(--color-ink)] px-8 py-3.5 font-[family-name:var(--display)] text-[18px] tracking-[2px] text-[var(--color-gold-light)] shadow-[var(--shadow-md)] transition-all hover:-translate-y-0.5 hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)] hover:shadow-[var(--shadow-lg)]"
            >
              Create Free Portrait <span>→</span>
            </Link>
            <button className="flex items-center gap-1.5 bg-transparent text-[12px] font-medium text-[var(--color-ink2)] transition-colors hover:text-[var(--color-ink)]">
              <span>▶</span> See how it works
            </button>
          </div>
        </motion.div>

        {/* --- RIGHT COLUMN: The Live Wall --- */}
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
              {SCROLL_ITEMS.map((post, idx) => (
                <LiveWallCard key={`col1-${idx}`} post={post} />
              ))}
            </div>

            {/* Column 2: Scrolls Down (Offset margin to stagger the start) */}
            <div className="animate-scroll-down -mt-[300px] flex flex-col gap-4 hover:[animation-play-state:paused]">
              {SCROLL_ITEMS.map((post, idx) => (
                <LiveWallCard key={`col2-${idx}`} post={post} />
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

// Sub-component for individual portrait cards
function LiveWallCard({ post }: { post: any }) {
  return (
    <div className="group relative aspect-[3/4] w-full cursor-pointer overflow-hidden shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)] rounded-xl">
      {/* Background with CSS Gradient Fallback */}
      <div className={`absolute inset-0 h-full w-full ${post.bgClass || 'bg-gray-200'}`}>
        {/* Actual Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={post.image_url} 
          alt={post.style} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { 
            // If the image doesn't exist yet, hide the broken img icon and show the CSS gradient instead
            e.currentTarget.style.display = 'none'; 
          }} 
        />
      </div>

      {/* Style Badge */}
      <div className="absolute bottom-3 right-3 z-20 bg-[var(--color-gold)] px-3 py-1 font-[family-name:var(--display)] text-[12px] tracking-[1px] text-[var(--color-ink)] shadow-sm">
        {post.style}
      </div>

      {/* Hover Overlay: "Try this style" */}
      <div className="absolute inset-0 z-10 flex items-center justify-center border-2 border-[var(--color-gold)] bg-[rgba(200,151,31,0.12)] opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
        <span className="bg-[var(--color-gold)] px-4 py-1.5 font-[family-name:var(--display)] text-[14px] tracking-[1.5px] text-[var(--color-ink)] shadow-lg">
          TRY THIS →
        </span>
      </div>
    </div>
  );
}