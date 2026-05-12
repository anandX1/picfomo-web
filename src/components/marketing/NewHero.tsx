"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const COMMUNITY_POSTS = [
  { id: 1, style: "DSLR", image_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80" },
  { id: 2, style: "Ghibli", image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80" },
  { id: 3, style: "Cyberpunk", image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" },
  { id: 4, style: "Vogue", image_url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80" },
];

export default function NewHero() {
  const [dragState, setDragState] = useState<"idle" | "dragging" | "processing">("idle");

  return (
    <section id="hero-section" className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-140px)] pb-16 relative overflow-hidden">
      
      <div className="text-center mb-10 px-6 relative z-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-[var(--color-gold)] mb-5 uppercase backdrop-blur-md type-kicker">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] animate-pulse"></span>
          AI Portrait Studio + Creator Economy
        </div>
        <h1 className="font-extrabold mb-5 display-font type-h1 text-balance text-white">
          Identity‑Lock portraits.<br />One click. Viral aesthetics.
        </h1>
        <p className="text-gray-300/80 max-w-2xl mx-auto type-lead text-balance">
          PicFOMO turns a single selfie into studio‑grade portraits in ~20 seconds—no prompts, no “uncanny valley.”
          Browse a live style feed, hit Generate, then Remix the exact aesthetic you love.
        </p>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-4 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 relative z-10">
        
        {/* Left Flank */}
        <div className="hidden lg:flex flex-col gap-6 w-[260px] xl:w-[280px] shrink-0">
          <div className="flank-card aspect-[4/5] rounded-[1.5rem] border border-white/10 overflow-hidden bg-[#111] shadow-2xl transform rotate-[-8deg] translate-y-12 translate-x-4 relative">
            <Image src={COMMUNITY_POSTS[0].image_url} alt="DSLR" fill className="object-cover" />
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10 text-xs font-bold text-white shadow-lg">DSLR</div>
          </div>
          <div className="flank-card aspect-[4/5] rounded-[1.5rem] border border-white/10 overflow-hidden bg-[#111] shadow-2xl transform rotate-[-3deg] -translate-x-6 relative">
            <Image src={COMMUNITY_POSTS[1].image_url} alt="Ghibli" fill className="object-cover" />
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10 text-xs font-bold text-white shadow-lg">Ghibli</div>
          </div>
        </div>

        {/* Dropzone */}
        <div className="w-full max-w-xl lg:max-w-[500px] xl:max-w-[550px] relative group shrink-0">
          <div className="dropzone-glow absolute -inset-1.5 bg-gradient-to-r from-yellow-500 to-[var(--color-gold)] rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-40 transition duration-500"></div>
          
          <div id="dropzone-container" className="relative bg-[#0A0A0A] border-2 border-white/20 group-hover:border-[var(--color-gold)] rounded-[2rem] p-8 md:p-12 flex flex-col items-center justify-center min-h-[420px] transition-all duration-500 cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_60px_rgba(212,175,55,0.3)] overflow-hidden">
            <svg className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] pointer-events-none rounded-[1.5rem]" preserveAspectRatio="none">
              <rect x="0" y="0" width="100%" height="100%" rx="24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeDasharray="10 10" className="dropzone-dashed-border animate-dash group-hover:stroke-[var(--color-gold)] transition-colors duration-500"></rect>
            </svg>
            <div id="dropzone-icon" className="bg-white w-20 h-20 rounded-2xl border border-white/30 flex items-center justify-center mb-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] text-black group-hover:scale-110 group-hover:bg-[var(--color-gold)] group-hover:border-[var(--color-gold)] group-hover:shadow-[0_0_40px_rgba(212,175,55,0.8)] transition-all duration-500">
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
            <h3 id="dropzone-title" className="text-2xl md:text-3xl font-bold display-font mb-2 text-white group-hover:text-[var(--color-gold)] transition-colors duration-500">Upload a selfie</h3>
            <p id="dropzone-desc" className="text-gray-400 text-sm text-center px-4 mb-8">Drag & drop your photo here, or browse.</p>
            
            <button className="fluid-btn fluid-btn-gold px-8 py-3 rounded-xl font-bold text-sm">
                <span className="fluid-btn-bg"></span>
                <span className="fluid-text-wrapper">
                    <span className="fluid-text fluid-text-top">Select Photo</span>
                    <span className="fluid-text fluid-text-bottom">Select Photo</span>
                </span>
            </button>
            
            <div className="absolute bottom-6 flex items-center gap-2 text-gray-500 text-[11px] font-semibold uppercase tracking-wider group-hover:text-[var(--color-gold)] transition-colors duration-500">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              No signup required
            </div>
          </div>
        </div>

        {/* Right Flank */}
        <div className="hidden lg:flex flex-col gap-6 w-[260px] xl:w-[280px] shrink-0">
          <div className="flank-card aspect-[4/5] rounded-[1.5rem] border border-white/10 overflow-hidden bg-[#111] shadow-2xl transform rotate-[8deg] translate-y-12 -translate-x-4 relative">
            <Image src={COMMUNITY_POSTS[2].image_url} alt="Cyberpunk" fill className="object-cover" />
            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10 text-xs font-bold text-white shadow-lg">Cyberpunk</div>
          </div>
          <div className="flank-card aspect-[4/5] rounded-[1.5rem] border border-white/10 overflow-hidden bg-[#111] shadow-2xl transform rotate-[3deg] translate-x-6 relative">
            <Image src={COMMUNITY_POSTS[3].image_url} alt="Vogue" fill className="object-cover" />
            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10 text-xs font-bold text-white shadow-lg">Vogue</div>
          </div>
        </div>
      </div>

      {/* Mobile Feed */}
      <div className="flex lg:hidden w-full overflow-x-auto hide-scroll gap-4 px-6 mt-10 snap-x snap-mandatory pb-6">
        {COMMUNITY_POSTS.map((post) => (
          <div key={post.id} className="w-[160px] shrink-0 aspect-[4/5] rounded-2xl border border-white/10 overflow-hidden snap-center relative shadow-lg">
            <Image src={post.image_url} alt={post.style} fill className="object-cover" />
            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur px-2 py-1 rounded border border-white/10 text-[10px] font-bold text-white">{post.style}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
