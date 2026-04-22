"use client"; // Required for Framer Motion animations

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

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
    // FIX: Changed from overflow-hidden to overflow-x-hidden, added flex-col and pt-28 to prevent text from being cut off on small mobile screens
    <section className="relative mx-auto max-w-[1280px] px-6 pt-28 pb-12 lg:px-10 lg:py-20 overflow-x-hidden min-h-[90vh] flex flex-col justify-center">
      
      {/* 🌟 1. DYNAMIC AURORA BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[var(--color-gold)] opacity-[0.06] blur-[120px] rounded-full animate-aurora-drift" />
        <div className="absolute bottom-[-10%] right-[10%] w-[50%] h-[50%] bg-[var(--color-ink)] opacity-[0.04] blur-[100px] rounded-full animate-aurora-drift-reverse" />
      </div>

      {/* 🌟 CUSTOM MICRO-INTERACTION STYLES */}
      <style jsx>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.6); opacity: 0.6; box-shadow: 0 0 10px var(--color-red); }
        }
        .animate-heartbeat { animation: heartbeat 1.5s ease-in-out infinite; }

        @keyframes shimmer-sweep {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .text-shimmer {
          background: linear-gradient(to right, var(--color-gold) 20%, var(--color-gold-light) 50%, var(--color-gold) 80%);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shimmer-sweep 5s linear infinite;
        }

        @keyframes btn-shine {
          0% { left: -100%; opacity: 0; }
          20% { left: 100%; opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        .btn-magnetic {
          position: relative;
          overflow: hidden;
        }
        .btn-magnetic::after {
          content: '';
          position: absolute;
          top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.25), transparent);
          transform: skewX(-20deg);
          animation: btn-shine 4s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes aurora-drift {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(3%, -3%) scale(1.05); }
          66% { transform: translate(-2%, 4%) scale(0.95); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .animate-aurora-drift { animation: aurora-drift 15s ease-in-out infinite; }
        .animate-aurora-drift-reverse { animation: aurora-drift 20s ease-in-out infinite reverse; }

        /* Perfect fading edges that adapt to ANY theme (Light or Dark) */
        .mask-edges-y {
          mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
        }
        .mask-edges-x {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }

        /* 3D Spatial UI Container */
        .perspective-container { perspective: 1200px; }
        .wall-3d {
          transform: rotateY(-12deg) rotateX(4deg) translateZ(0);
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .perspective-container:hover .wall-3d {
          transform: rotateY(-4deg) rotateX(1deg) translateZ(30px);
        }
      `}</style>

      {/* FIX: Shifted breakpoints from md to lg to prevent text compression on tablets */}
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_500px] xl:grid-cols-[1fr_600px] w-full relative z-10">
        
        {/* --- LEFT COLUMN: The Pitch (Centered on Mobile, Left on Desktop) --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center lg:items-start lg:text-left w-full"
        >
          {/* Live Counter Eyebrow */}
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[var(--color-gold-border)] bg-[var(--color-gold-pale)] px-4 py-1.5 font-[family-name:var(--mono)] text-[10px] md:text-[11px] font-bold uppercase tracking-[3px] text-[var(--color-gold)] shadow-sm backdrop-blur-md transition-transform hover:scale-105">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-red)] animate-heartbeat"></span>
            28,398+ portraits created today
          </div>

          {/* Headline */}
          <h1 className="mb-5 font-[family-name:var(--display)] text-[clamp(46px,10vw,100px)] leading-[0.85] tracking-[-1.5px] text-[var(--color-ink)] flex flex-col items-center lg:items-start w-full">
            YOUR FACE.<br />
            <span className="flex items-center gap-2 md:gap-3 mt-1">
              <span className="text-shimmer font-sans text-[1.1em] font-light leading-none -mt-2">∞</span>
              <span className="text-[var(--color-gold)]">STYLES.</span>
            </span>
            <span className="block font-[family-name:var(--serif)] text-[0.65em] font-normal italic text-[var(--color-ink3)] mt-2">
              ALL IN ONE PLACE.
            </span>
          </h1>

          {/* Description */}
          <p className="mb-10 max-w-[500px] font-light leading-[1.7] md:leading-[1.8] text-[16px] md:text-[20px] text-[var(--color-ink2)]">
            Pick a trending style — Ghibli, IPL cricket card, Bollywood poster. Drop a selfie. Get a portrait so stunning you'll actually change your Profile Picture.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 w-full sm:w-auto">
            <Link
              href="/sign-up"
              className="btn-magnetic flex w-full sm:w-auto items-center justify-center gap-2 bg-[var(--color-ink)] px-8 py-4 md:px-10 md:py-4.5 font-[family-name:var(--display)] text-[16px] md:text-[18px] tracking-[1.5px] text-[var(--color-white)] shadow-[var(--shadow-lg)] transition-all hover:-translate-y-1 hover:bg-[var(--color-gold)] hover:text-black hover:shadow-[0_10px_40px_rgba(245,158,11,0.3)] rounded-[14px]"
            >
              Create Free Portrait <span className="hidden sm:inline">→</span>
            </Link>
            
            <Link 
              href="#how-it-works" 
              className="group flex items-center gap-2 bg-transparent py-2 text-[13px] md:text-[14px] font-medium text-[var(--color-ink3)] transition-colors hover:text-[var(--color-ink)]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--rule)] bg-[var(--color-cream)] transition-transform group-hover:scale-110 shadow-sm">
                <span className="text-[9px] translate-x-[1px]">▶</span>
              </div>
              <span className="underline decoration-[var(--rule)] underline-offset-4">See how it works</span>
            </Link>
          </div>

          {/* --- MOBILE ONLY: 3. CINEMATIC INFINITE MARQUEE --- */}
          {/* FIX: Changed from md:hidden to lg:hidden so it aligns with the grid breakpoints properly */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mt-12 block w-[calc(100%+3rem)] -mx-6 lg:hidden z-10"
          >
            <div className="mask-edges-x w-full overflow-hidden pb-8 pt-2">
              <div className="flex w-max animate-scroll-left gap-4 pl-4">
                {SCROLL_ITEMS.map((post, idx) => (
                  <div key={`mobile-scroll-${idx}`} className="w-[160px] shrink-0">
                    <LiveWallCard post={post} priority={idx < 4} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </motion.div>

        {/* --- DESKTOP RIGHT COLUMN: 2. SPATIAL UI 3D WALL --- */}
        {/* FIX: Changed from md:block to lg:block */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative hidden h-[700px] w-full lg:block perspective-container z-10"
        >
          {/* True Alpha Masks (Works perfectly in Dark Mode) */}
          <div className="mask-edges-y h-full w-full">
            <div className="grid h-full grid-cols-2 gap-5 wall-3d">
              {/* Column 1 */}
              <div className="animate-scroll-up flex flex-col gap-5 hover:[animation-play-state:paused] pt-10">
                {SCROLL_ITEMS.slice(0, SCROLL_ITEMS.length / 2).map((post, idx) => (
                  <LiveWallCard key={`col1-${idx}`} post={post} priority={idx < 3} />
                ))}
              </div>
              {/* Column 2 */}
              <div className="animate-scroll-down -mt-[350px] flex flex-col gap-5 hover:[animation-play-state:paused]">
                {SCROLL_ITEMS.slice(SCROLL_ITEMS.length / 2).map((post, idx) => (
                  <LiveWallCard key={`col2-${idx}`} post={post} priority={idx < 3} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

    </section>
  );
}

// 🌟 4. UPGRADED CARD SUB-COMPONENT
function LiveWallCard({ post, priority = false }: { post: any, priority?: boolean }) {
  return (
    <Link 
      href="/sign-up" 
      className="group relative aspect-[3/4] w-full cursor-pointer overflow-hidden shadow-[var(--shadow-md)] transition-all duration-500 hover:-translate-y-3 hover:scale-105 hover:shadow-[var(--shadow-2xl)] rounded-[18px] block hover:z-50 border border-[var(--rule)]"
    >
      <div className="absolute inset-0 h-full w-full bg-[var(--color-cream2)]">
        <Image 
          src={post.image_url} 
          alt={post.style} 
          fill
          priority={priority}
          sizes="(max-width: 768px) 160px, 300px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
      </div>
      
      {/* Sleeker Glassmorphism Label */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex justify-center">
        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full font-[family-name:var(--mono)] text-[10px] md:text-[11px] font-bold tracking-[1px] text-gray-900 shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-transform duration-300 group-hover:-translate-y-1">
          {post.style}
        </div>
      </div>

      {/* Deep Dark Mode Overlay Glow */}
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--color-ink)]/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
        <span className="bg-[var(--color-gold)] px-5 py-2 rounded-full font-[family-name:var(--display)] text-[13px] md:text-[15px] tracking-[1.5px] text-black shadow-[0_0_30px_rgba(245,158,11,0.5)] scale-90 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
          TRY THIS →
        </span>
      </div>
    </Link>
  );
}