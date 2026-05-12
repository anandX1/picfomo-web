"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Re-using your local assets
const COMMUNITY_POSTS = [
  { id: 1, style: "Ghibli", image_url: "/hero/1.png" },
  { id: 2, style: "DSLR", image_url: "/hero/2.png" },
  { id: 3, style: "Cyberpunk", image_url: "/hero/3.png" },
  { id: 4, style: "Vogue", image_url: "/hero/4.png" },
];

// Duplicated for the seamless mobile infinite marquee
const MOBILE_SCROLL_ITEMS = [...COMMUNITY_POSTS, ...COMMUNITY_POSTS];

export default function Hero() {
  const [dragState, setDragState] = useState<"idle" | "dragging" | "processing">("idle");

  // Global Drag & Drop Handler (Primarily for Desktop)
  useEffect(() => {
    let dragTimer: NodeJS.Timeout;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      document.body.classList.add("is-dragging-file");
      setDragState("dragging");
      clearTimeout(dragTimer);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragTimer = setTimeout(() => {
        document.body.classList.remove("is-dragging-file");
        setDragState("idle");
      }, 100);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      document.body.classList.remove("is-dragging-file");
      setDragState("processing");
      
      // Reset back to idle after 3 seconds to simulate processing
      setTimeout(() => setDragState("idle"), 3000);
    };

    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

  // 3D Flanking Card Tilt Physics (Desktop Only)
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return; // Disables on touch devices to save battery

    const cards = document.querySelectorAll<HTMLElement>(".flank-card");
    const MAX_TILT = 15;
    const SCALE = 1.05;
    const PERSPECTIVE = 800;

    cards.forEach((card) => {
      let raf: number | null = null;

      const onMouseEnter = () => card.classList.remove("tilt-resetting");
      
      const onMouseMove = (e: MouseEvent) => {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
          const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
          
          const rotY = nx * MAX_TILT;
          const rotX = -ny * MAX_TILT;
          
          card.style.transform = `perspective(${PERSPECTIVE}px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(${SCALE},${SCALE},${SCALE})`;
          card.style.boxShadow = `${-rotY * 1.5}px ${rotX * 1.5}px 40px rgba(0,0,0,0.5), 0 0 30px rgba(212,175,55,0.15)`;
          card.style.borderColor = "rgba(212,175,55,0.6)";
        });
      };

      const onMouseLeave = () => {
        if (raf) {
          cancelAnimationFrame(raf);
          raf = null;
        }
        card.classList.add("tilt-resetting");
        card.style.transform = "";
        card.style.boxShadow = "";
        card.style.borderColor = "";
      };

      const onTransitionEnd = () => card.classList.remove("tilt-resetting");

      card.addEventListener("mouseenter", onMouseEnter);
      card.addEventListener("mousemove", onMouseMove);
      card.addEventListener("mouseleave", onMouseLeave);
      card.addEventListener("transitionend", onTransitionEnd);
      
      return () => {
        card.removeEventListener("mouseenter", onMouseEnter);
        card.removeEventListener("mousemove", onMouseMove);
        card.removeEventListener("mouseleave", onMouseLeave);
        card.removeEventListener("transitionend", onTransitionEnd);
      };
    });
  }, []);

  return (
    <section id="hero-section" className="w-full flex flex-col items-center justify-start md:justify-center min-h-[calc(100svh-80px)] pb-10 pt-4 md:pb-16 relative overflow-hidden">
      
      {/* Dynamic CSS for the Mobile Infinite Marquee */}
      <style jsx>{`
        @keyframes mobile-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-mobile-marquee {
          animation: mobile-marquee 20s linear infinite;
          will-change: transform;
        }
      `}</style>

      {/* HEADER */}
      <div className="text-center mb-6 md:mb-10 px-6 relative z-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-[var(--color-gold)] mb-4 md:mb-5 tracking-widest uppercase backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] animate-pulse"></span>
          Your Trendy AI Image Generator
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-3 md:mb-5 tracking-tight display-font leading-[1.1]">
          Turn One Selfie <br className="hidden md:block"/>Into Any Trend.
        </h1>
        <p className="text-gray-400 text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed px-2">
          Stay ahead of the curve. Choose from 120+ viral styles, upload your photo, hit generate, and watch the magic happen.
        </p>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-4 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 relative z-10">
        
        {/* DESKTOP ONLY: LEFT FLANK */}
        <div className="hidden lg:flex flex-col gap-6 w-[260px] xl:w-[280px] shrink-0">
          <div className="flank-card aspect-[4/5] rounded-[1.5rem] border border-white/10 overflow-hidden bg-[#111] shadow-2xl transform rotate-[-8deg] translate-y-12 translate-x-4">
            <Image src={COMMUNITY_POSTS[1].image_url} alt={COMMUNITY_POSTS[1].style} fill className="object-cover pointer-events-none" />
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10 text-xs font-bold text-white shadow-lg">
              {COMMUNITY_POSTS[1].style}
            </div>
          </div>
          <div className="flank-card aspect-[4/5] rounded-[1.5rem] border border-white/10 overflow-hidden bg-[#111] shadow-2xl transform rotate-[-3deg] -translate-x-6">
            <Image src={COMMUNITY_POSTS[0].image_url} alt={COMMUNITY_POSTS[0].style} fill className="object-cover pointer-events-none" />
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10 text-xs font-bold text-white shadow-lg">
              {COMMUNITY_POSTS[0].style}
            </div>
          </div>
        </div>

        {/* THE GLOWING DROPZONE (RESPONSIVE) */}
        <div className="w-full max-w-[90%] sm:max-w-xl lg:max-w-[500px] xl:max-w-[550px] relative group shrink-0">
          <div className="dropzone-glow absolute -inset-1.5 bg-gradient-to-r from-yellow-500 to-[var(--color-gold)] rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-40 transition duration-500 hidden md:block"></div>
          
          {/* Mobile Optimized Height (min-h-[320px] instead of 420px) */}
          <div id="dropzone-container" className="relative bg-[#0A0A0A] border-2 border-white/10 hover:border-[var(--color-gold)] rounded-[2rem] p-6 md:p-12 flex flex-col items-center justify-center min-h-[320px] md:min-h-[420px] transition-all duration-500 cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden active:scale-95 md:active:scale-100">
            <svg className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] pointer-events-none rounded-[1.5rem]" preserveAspectRatio="none">
              <rect x="0" y="0" width="100%" height="100%" rx="24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="10 10" className="dropzone-dashed-border animate-dash group-hover:stroke-[var(--color-gold)] transition-colors duration-500"></rect>
            </svg>
            
            <div id="dropzone-icon" className="bg-white w-16 h-16 md:w-20 md:h-20 rounded-2xl border border-white/30 flex items-center justify-center mb-4 md:mb-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] text-black group-hover:scale-110 group-hover:bg-[var(--color-gold)] group-hover:border-[var(--color-gold)] transition-all duration-500">
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="md:w-8 md:h-8">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            
            <h3 id="dropzone-title" className="text-xl md:text-3xl font-bold display-font mb-1 md:mb-2 text-white group-hover:text-[var(--color-gold)] transition-colors duration-500 text-center">
              {dragState === "dragging" ? "Drop it like it's hot!" : dragState === "processing" ? "Processing Magic..." : "Upload a selfie"}
            </h3>
            
            {/* Context-Aware Copy for Mobile vs Desktop */}
            <p id="dropzone-desc" className="text-gray-400 text-xs md:text-sm text-center px-4 mb-6 md:mb-8">
              {dragState === "dragging" 
                ? "Release to start the magic..." 
                : dragState === "processing" 
                ? "Analyzing facial geometry..." 
                : (
                  <>
                    <span className="block md:hidden">Tap here to select your photo.</span>
                    <span className="hidden md:block">Drag & drop your photo here, or browse.</span>
                  </>
                )
              }
            </p>
            
            <button className="relative overflow-hidden px-6 py-2.5 md:px-8 md:py-3 rounded-xl font-bold text-xs md:text-sm bg-white/10 border border-white/20 text-white transition-all duration-500 shadow-lg pointer-events-none group-hover:border-[var(--color-gold)] transform group-hover:scale-105 z-10">
              <span className="absolute inset-0 bg-[var(--color-gold)] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-[-1] rounded-xl"></span>
              <span className="grid relative overflow-hidden">
                  <span className="col-start-1 row-start-1 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[120%]">Select Photo</span>
                  <span className="col-start-1 row-start-1 translate-y-[120%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 text-black">Select Photo</span>
              </span>
            </button>
            
            <div className="absolute bottom-4 md:bottom-6 flex items-center gap-1.5 md:gap-2 text-gray-500 text-[9px] md:text-[11px] font-semibold uppercase tracking-wider group-hover:text-[var(--color-gold)] transition-colors duration-500">
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="md:w-3 md:h-3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              No signup required
            </div>
          </div>
        </div>

        {/* DESKTOP ONLY: RIGHT FLANK */}
        <div className="hidden lg:flex flex-col gap-6 w-[260px] xl:w-[280px] shrink-0">
          <div className="flank-card aspect-[4/5] rounded-[1.5rem] border border-white/10 overflow-hidden bg-[#111] shadow-2xl transform rotate-[8deg] translate-y-12 -translate-x-4">
            <Image src={COMMUNITY_POSTS[2].image_url} alt={COMMUNITY_POSTS[2].style} fill className="object-cover pointer-events-none" />
            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10 text-xs font-bold text-white shadow-lg">
              {COMMUNITY_POSTS[2].style}
            </div>
          </div>
          <div className="flank-card aspect-[4/5] rounded-[1.5rem] border border-white/10 overflow-hidden bg-[#111] shadow-2xl transform rotate-[3deg] translate-x-6">
            <Image src={COMMUNITY_POSTS[3].image_url} alt={COMMUNITY_POSTS[3].style} fill className="object-cover pointer-events-none" />
            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10 text-xs font-bold text-white shadow-lg">
              {COMMUNITY_POSTS[3].style}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE ONLY: CINEMATIC INFINITE MARQUEE */}
      <div className="flex lg:hidden w-full overflow-hidden mt-8 md:mt-10 relative">
        {/* Edge Fade Masks for clean entry/exit */}
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[var(--bg-color)] to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[var(--bg-color)] to-transparent z-10"></div>
        
        {/* The Marquee Track */}
        <div className="flex w-max animate-mobile-marquee gap-3 md:gap-4 pl-3">
          {MOBILE_SCROLL_ITEMS.map((post, idx) => (
            <div key={idx} className="w-[120px] md:w-[160px] shrink-0 aspect-[4/5] rounded-[1rem] border border-white/10 overflow-hidden relative shadow-lg">
              <Image src={post.image_url} alt={post.style} fill className="object-cover" sizes="160px" />
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10 text-[9px] md:text-[10px] font-bold text-white">
                {post.style}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}