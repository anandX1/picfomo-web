"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import PublicFunnelModal from "./PublicFunnelModal"; // 🌟 IMPORT THE NEW MODAL

const HERO_IMAGES = [
  { id: 1, style: "Ghibli", url: "/hero/1.webp" },
  { id: 2, style: "DSLR", url: "/hero/2.webp" },
  { id: 3, style: "Cyberpunk", url: "/hero/3.webp" },
  { id: 4, style: "Vogue", url: "/hero/4.webp" },
];

const MARQUEE_IMAGES = [...HERO_IMAGES, ...HERO_IMAGES];

export default function NewHero({ dynamicStyles = [] }: { dynamicStyles?: any[] }) {
  const [mounted, setMounted] = useState(false);
  const [dragState, setDragState] = useState<"idle" | "dragging">("idle");
  
  // 🌟 NEW STATE FOR THE MODAL & FILE
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // 🌟 ENHANCED 3D Tilt & Slide Effect
    if (window.matchMedia("(hover: hover)").matches) {
        const cards = document.querySelectorAll<HTMLElement>(".flank-card");
        cards.forEach((card) => {
            card.style.willChange = "transform, box-shadow, border-color";
            let raf: number | null = null;
            const handleMove = (e: MouseEvent) => {
                if (raf) cancelAnimationFrame(raf);
                raf = requestAnimationFrame(() => {
                    const r = card.getBoundingClientRect();
                    const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
                    const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
                    
                    const rotY = nx * 10; 
                    const rotX = -ny * 10;
                    const moveX = nx * 8;
                    const moveY = ny * 8;

                    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translate3d(${moveX}px, ${moveY}px, 30px) scale3d(1.05,1.05,1.05)`;
                    card.style.boxShadow = `${-nx * 15}px ${ny * 15}px 40px rgba(0,0,0,0.5), 0 0 30px rgba(212,175,55,0.15)`;
                    card.style.borderColor = 'rgba(212,175,55,0.4)';
                });
            };
            const handleLeave = () => {
                if (raf) cancelAnimationFrame(raf);
                card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translate3d(0,0,0) scale3d(1,1,1)";
                card.style.boxShadow = ""; 
                card.style.borderColor = "";
            };
            card.addEventListener("mousemove", handleMove);
            card.addEventListener("mouseleave", handleLeave);
        });
    }
  }, []);

  // 🌟 FILE CAPTURE LOGIC
  const handleFileCapture = (file: File | undefined | null) => {
    if (!file) return;
    setCapturedFile(file);
    setIsModalOpen(true); // Boom. Open the funnel.
    setDragState("idle");
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragState("dragging");
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragState("idle");
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragState("idle");
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileCapture(e.dataTransfer.files[0]);
    }
  };

  return (
    <>
      <section id="hero-section" className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden pb-4 pt-[100px] lg:pt-[120px] hero-gradient">
        
        <style jsx>{`
          @keyframes dash { to { stroke-dashoffset: -20; } }
          .animate-dash { animation: dash 1s linear infinite; }
          @keyframes mobile-marquee {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-50%, 0, 0); }
          }
          .animate-mobile-marquee {
            animation: mobile-marquee 25s linear infinite;
          }
        `}</style>

        {/* 🌟 PREMIUM TYPOGRAPHY */}
        <div className="relative z-30 mb-6 lg:mb-10 w-full max-w-5xl px-4 text-center shrink-0 will-change-transform">
          <h1 className="display-font mb-3 lg:mb-5 text-[2.2rem] sm:text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-white drop-shadow-2xl text-balance">
              Turn One Selfie<br className="hidden sm:block"/> Into Any Trend.
          </h1>
          <p className="mx-auto max-w-lg text-[13px] sm:text-base lg:text-lg font-medium leading-relaxed text-white/80 text-balance">
              Choose a style, upload your photo, and watch the magic.
          </p>
        </div>

        {/* 🌟 COMPACT WORKSPACE */}
        <div className="relative z-20 flex w-full max-w-[1200px] flex-col items-center justify-center gap-4 px-4 lg:flex-row lg:gap-8 shrink-0">
          
          {/* Left Flank */}
          <div className="hidden shrink-0 flex-col gap-4 lg:flex w-[180px] xl:w-[220px]">
            <div className="flank-card relative aspect-[4/5] translate-x-4 translate-y-4 rotate-[-8deg] overflow-hidden rounded-[1.5rem] border border-white/20 bg-[#111] shadow-2xl transition-all duration-300 will-change-transform">
              <Image 
                src={HERO_IMAGES[0].url} 
                alt={`${HERO_IMAGES[0].style} style AI portrait generator example - PicFOMO`} 
                fill 
                className="object-cover" 
                priority 
                fetchPriority="high"
                sizes="(max-width: 1200px) 180px, 220px" 
              />
              <div className="absolute bottom-3 left-3 rounded-lg border border-white/20 bg-black/80 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur shadow-lg">{HERO_IMAGES[0].style}</div>
            </div>
            <div className="flank-card relative aspect-[4/5] -translate-x-4 rotate-[-3deg] overflow-hidden rounded-[1.5rem] border border-white/20 bg-[#111] shadow-2xl transition-all duration-300 will-change-transform">
              <Image 
                src={HERO_IMAGES[1].url} 
                alt={`${HERO_IMAGES[1].style} photorealistic AI headshot generator - PicFOMO Identity-Lock™`} 
                fill 
                className="object-cover" 
                loading="lazy"
                sizes="(max-width: 1200px) 180px, 220px" 
              />
              <div className="absolute bottom-3 left-3 rounded-lg border border-white/20 bg-black/80 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur shadow-lg">{HERO_IMAGES[1].style}</div>
            </div>
          </div>

          {/* 🌟 HIGH-CONTRAST UPLOAD BOX */}
          <div className="group relative w-full max-w-[95%] sm:max-w-xl shrink-0 lg:max-w-[460px] min-h-[300px] will-change-transform">
            <div className="pointer-events-none absolute -inset-8 rounded-full bg-[var(--color-gold)]/10 blur-[80px] opacity-0 transition-opacity duration-1000 group-hover:opacity-100 hidden md:block"></div>
            
            <div id="dropzone-container" 
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`relative flex min-h-[300px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border-2 bg-[#080808]/90 p-6 lg:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-700 cursor-pointer group-active:scale-[0.98] will-change-transform ${dragState === "dragging" ? 'bg-[rgba(212,175,55,0.05)] border-[var(--color-gold)] scale-105' : 'border-white/30 hover:border-[var(--color-gold)]/80'}`}
            >
              {/* 🌟 INVISIBLE FILE INPUT FOR CLICKS */}
              <input 
                type="file" 
                accept="image/jpeg, image/png, image/webp" 
                onChange={(e) => handleFileCapture(e.target.files?.[0])}
                className="absolute inset-0 z-50 w-full h-full opacity-0 cursor-pointer" 
              />

              <svg className="absolute inset-3 h-[calc(100%-24px)] w-[calc(100%-24px)] pointer-events-none rounded-[1.5rem]" preserveAspectRatio="none">
                <rect x="0" y="0" width="100%" height="100%" rx="24" fill="none" 
                  strokeWidth="2" strokeDasharray="10 10" 
                  className={`transition-colors duration-500 ${dragState === "dragging" ? 'stroke-[var(--color-gold)] animate-dash' : 'stroke-white/30 group-hover:stroke-[var(--color-gold)]/80 group-hover:animate-dash'}`}>
                </rect>
              </svg>

              <div id="dropzone-icon" className={`mb-3 lg:mb-5 flex h-12 w-12 lg:h-16 lg:w-16 items-center justify-center rounded-[1rem] shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all duration-500 ${dragState === "dragging" ? 'scale-110 bg-[var(--color-gold)] text-black shadow-[0_0_30px_rgba(212,175,55,0.6)]' : 'bg-white text-black group-hover:scale-110 group-hover:bg-[var(--color-gold)]'}`}>
                <svg width="24" height="24" className="lg:h-7 lg:w-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              </div>

              <h3 className={`display-font mb-1 text-lg lg:text-2xl font-bold transition-colors duration-500 ${dragState === "dragging" ? 'text-[var(--color-gold)]' : 'text-white group-hover:text-[var(--color-gold)]'}`}>
                  {dragState === "dragging" ? "Drop it like it's hot!" : "Upload Photo"}
              </h3>
              
              <p className={`mb-5 lg:mb-6 px-4 text-center text-[11px] lg:text-xs font-medium transition-colors duration-300 ${dragState === "dragging" ? 'text-gray-400' : 'text-white/60 group-hover:text-white/90'}`}>
                  {dragState === "dragging" ? "Release to start the magic..." : "Drag & drop or click to browse."}
              </p>
              
              <button className="fluid-btn fluid-btn-gold z-10 rounded-xl px-10 py-3 lg:px-12 lg:py-3 font-bold uppercase tracking-widest shadow-xl transition-all duration-500 border border-white/20 group-hover:border-transparent pointer-events-none">
                  <span className="fluid-btn-bg"></span>
                  <span className="fluid-text-wrapper">
                      <span className="fluid-text fluid-text-top text-[9px] lg:text-[10px]">Select File</span>
                      <span className="fluid-text fluid-text-bottom text-[9px] lg:text-[10px]">Select File</span>
                  </span>
              </button>
            </div>
          </div>

          {/* Right Flank */}
          <div className="hidden shrink-0 flex-col gap-4 lg:flex w-[180px] xl:w-[220px]">
            <div className="flank-card relative aspect-[4/5] -translate-x-4 translate-y-4 rotate-[8deg] overflow-hidden rounded-[1.5rem] border border-white/20 bg-[#111] shadow-2xl transition-all duration-300">
              <Image 
                src={HERO_IMAGES[2].url} 
                alt={`${HERO_IMAGES[2].style} aesthetic AI portrait - PicFOMO Cinematic Synthesis`} 
                fill 
                className="object-cover" 
                loading="lazy"
                sizes="220px" 
              />
              <div className="absolute bottom-3 right-3 rounded-lg border border-white/20 bg-black/80 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur shadow-lg">{HERO_IMAGES[2].style}</div>
            </div>
            <div className="flank-card relative aspect-[4/5] translate-x-4 rotate-[3deg] overflow-hidden rounded-[1.5rem] border border-white/20 bg-[#111] shadow-2xl transition-all duration-300">
              <Image 
                src={HERO_IMAGES[3].url} 
                alt={`${HERO_IMAGES[3].style} high-fashion AI portrait generator example - PicFOMO Vogue Style`} 
                fill 
                className="object-cover" 
                loading="lazy"
                sizes="220px" 
              />
              <div className="absolute bottom-3 right-3 rounded-lg border border-white/20 bg-black/80 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur shadow-lg">{HERO_IMAGES[3].style}</div>
            </div>
          </div>
        </div>

        {/* 📱 MOBILE: ULTRA-COMPACT MARQUEE */}
        <div className="relative z-10 mt-5 flex w-full overflow-hidden lg:hidden shrink-0">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-black to-transparent"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-black to-transparent"></div>
          
          <div className="animate-mobile-marquee flex w-max gap-3 pl-3 will-change-transform">
            {MARQUEE_IMAGES.map((post, idx) => (
              <div key={idx} className="relative aspect-[4/5] w-[110px] shrink-0 overflow-hidden rounded-[1rem] border border-white/20 bg-[#111] shadow-lg">
                <Image 
                  src={post.url} 
                  alt={`${post.style} style AI portrait - Trending PicFOMO aesthetic`} 
                  fill 
                  className="object-cover" 
                  sizes="110px"
                  loading="lazy"
                />
                <div className="absolute bottom-1.5 left-1.5 rounded bg-black/80 px-1.5 py-0.5 text-[8px] font-bold text-white backdrop-blur-md border border-white/10">{post.style}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🌟 THE FUNNEL MODAL */}
      <PublicFunnelModal 
        isOpen={isModalOpen} 
        initialFile={capturedFile} 
        dynamicStyles={dynamicStyles}
        onClose={() => {
          setIsModalOpen(false);
          setCapturedFile(null);
        }} 
      />
    </>
  );
}
