"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Lock, ScanFace, Sparkles } from "lucide-react";
import Image from "next/image"; 

// 🌟 THE LOCAL ASSETS FOR MAXIMUM SPEED (LCP)
const RESULTS_DATA = [
  {
    id: "kohli",
    name: "Virat Kohli",
    style: "Old Money Luxury",
    beforeImage: "/results/kohli-before.png",
    afterImage: "/results/kohli-after.png",
    match: "99.8%",
    time: "14.2s",
    objectPos: "object-center"
  },
  {
    id: "cr7",
    name: "Cristiano Ronaldo",
    style: "Luxury Mythic Marble",
    beforeImage: "/results/cr7-before.webp",
    afterImage: "/results/cr7-after.png",
    match: "99.6%",
    time: "16.1s",
    objectPos: "object-top" 
  },
  {
    id: "vintage",
    name: "Historical Photo",
    style: "Colorized Legacy",
    beforeImage: "/results/vintage-before.jpg",
    afterImage: "/results/vintage-after.jpg",
    match: "99.9%",
    time: "18.5s",
    objectPos: "object-center"
  }
];

export default function ResultsGrid() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % RESULTS_DATA.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + RESULTS_DATA.length) % RESULTS_DATA.length);

  // Auto-advance mobile carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Swaps every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden border-y border-white/5 py-16 md:py-24" id="results">
      
      {/* 🌟 1. BACKGROUND LIQUID GOLD AURA */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes liquidDrift {
            0% { transform: translate3d(0, 0, 0) scale(1); }
            50% { transform: translate3d(-2%, 1%, 0) scale(1.03); }
            100% { transform: translate3d(2%, -1%, 0) scale(1.02); }
        }
        .brand-gold-glow-section {
            background: radial-gradient(120% 100% at 50% 0%, rgba(8,8,8,0.32) 0%, rgba(8,8,8,0.82) 46%, #070707 78%, #050505 100%), #050505;
            position: absolute;
            inset: 0;
            z-index: 0;
            pointer-events: none;
        }
        .brand-gold-glow-section::before {
            content: "";
            position: absolute;
            inset: -20%;
            background: radial-gradient(42% 40% at 50% 2%, rgba(255, 220, 90, 0.78) 0%, rgba(255, 214, 74, 0.35) 38%, rgba(255, 214, 74, 0.0) 64%),
                        radial-gradient(34% 32% at 50% 8%, rgba(255, 236, 160, 0.52) 0%, rgba(255, 236, 160, 0.0) 66%),
                        radial-gradient(95% 70% at 50% -2%, rgba(212, 175, 55, 0.22) 0%, rgba(212, 175, 55, 0.0) 56%);
            filter: blur(40px);
            opacity: 0.92;
            animation: liquidDrift 16s ease-in-out infinite alternate;
        }
      `}} />
      <div className="brand-gold-glow-section"></div>

      <div className="mx-auto max-w-[1120px] px-6 md:px-10 relative z-10">
        
        {/* 🌟 HIGH-TECH HEADER */}
        <div className="mb-4 flex items-center gap-2 font-[family-name:var(--mono)] text-[10px] md:text-[11px] uppercase tracking-[4px] text-[var(--color-gold)] font-bold bg-white/5 border border-white/10 w-fit px-4 py-1.5 rounded-full backdrop-blur-md">
          <Lock size={12} className="text-[var(--color-gold)]" />
          PuLID IDENTITY PRESERVATION
        </div>
        
        <h2 className="mb-4 display-font text-[clamp(40px,5vw,64px)] font-extrabold leading-[1.0] tracking-tight text-white">
          UNREAL QUALITY.<br />
          <span className="text-[var(--color-gold)]">100% YOU.</span>
        </h2>
        
        <p className="mb-16 max-w-[540px] text-[15px] md:text-[18px] font-light leading-[1.7] text-gray-300">
          Most AI makes you look like a plastic video game character. Our Identity-Lock tech maps 120+ facial points so you look exactly like you — just in a different universe.
        </p>

        {/* --- DESKTOP VIEW: 3 Sliders Side-by-Side --- */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {RESULTS_DATA.map((item, idx) => (
            <BeforeAfterSlider 
              key={item.id} 
              item={item} 
              priority={idx < 3} 
              indexOffset={idx} // Passes index to stagger the autonomous animation
            />
          ))}
        </div>

        {/* --- MOBILE VIEW: Interactive Auto-Swipe Deck --- */}
        <div className="block md:hidden">
          <div className="relative w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <BeforeAfterSlider 
                  item={RESULTS_DATA[currentIndex]} 
                  isMobile={true} 
                  priority={true} 
                  indexOffset={0} 
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile Controls */}
          <div className="mt-8 flex items-center justify-between px-2">
            <div className="font-[family-name:var(--mono)] text-[12px] font-bold uppercase tracking-[2px] text-gray-400">
              {currentIndex + 1} / {RESULTS_DATA.length}
            </div>
            <div className="flex gap-3">
              <button onClick={prevSlide} className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white shadow-sm transition-all hover:bg-[var(--color-gold)] hover:text-black hover:border-[var(--color-gold)] active:scale-95">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextSlide} className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white shadow-sm transition-all hover:bg-[var(--color-gold)] hover:text-black hover:border-[var(--color-gold)] active:scale-95">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 🌟 THE AUTONOMOUS SLIDER COMPONENT
function BeforeAfterSlider({ item, isMobile = false, priority = false, indexOffset = 0 }: { item: any, isMobile?: boolean, priority?: boolean, indexOffset: number }) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isInteracting, setIsInteracting] = useState(false);

  // --- AUTONOMOUS IDLE ANIMATION ---
  useEffect(() => {
    if (isInteracting) return; // Stop animation if user takes control

    let animationFrameId: number;
    const startTime = Date.now();
    
    // Add a time offset based on column index so they sweep in a wave pattern
    const timeOffset = indexOffset * 1500; 

    const animate = () => {
      const elapsed = (Date.now() - startTime + timeOffset) / 1000;
      // Gently sweep between 35% and 65% using a sine wave
      const newPos = 50 + Math.sin(elapsed * 1.2) * 20; 
      setPosition(newPos);
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInteracting, indexOffset]);

  // --- MANUAL OVERRIDE ---
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    if (isMobile && !isInteracting) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? (e as any).touches[0].clientX : (e as any).clientX;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setPosition(percent);
  };

  return (
    <div className="flex flex-col gap-3 group">
      {/* Name and Style Headers */}
      <div className="flex justify-between items-end px-1">
        <div>
          <div className="font-[family-name:var(--mono)] text-[9px] uppercase tracking-[2px] text-gray-400">Input</div>
          <div className="font-semibold text-[14px] text-white">{item.name}</div>
        </div>
        <div className="text-right">
          <div className="font-[family-name:var(--mono)] text-[9px] font-bold uppercase tracking-[2px] text-[var(--color-gold)]">Output</div>
          <div className="font-semibold text-[14px] text-white">{item.style}</div>
        </div>
      </div>

      {/* The Actual Image Container */}
      <div 
        ref={containerRef}
        onPointerDown={(e) => {
          setIsInteracting(true);
          if (isMobile) e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={(e) => {
          setIsInteracting(false);
          if (isMobile) e.currentTarget.releasePointerCapture(e.pointerId);
        }}
        onPointerLeave={() => setIsInteracting(false)}
        onPointerCancel={() => setIsInteracting(false)}
        onMouseEnter={() => setIsInteracting(true)}
        className={`relative aspect-[3/4] w-full overflow-hidden rounded-[16px] shadow-[0_20px_40px_rgba(0,0,0,0.6)] bg-[#111] border border-white/10 ${!isMobile ? 'cursor-ew-resize' : ''} ${isInteracting ? 'touch-none border-[var(--color-gold)]' : 'hover:border-white/30'} transition-colors duration-300`}
      >
        {/* AFTER IMAGE (Bottom Layer) */}
        <Image 
          src={item.afterImage} 
          alt="After" 
          fill
          priority={priority}
          quality={85}
          sizes="(max-width: 768px) 100vw, 33vw"
          className={`object-cover ${item.objectPos}`} 
          draggable={false} 
        />
        
        {/* BEFORE IMAGE (Top Layer - Clipped) */}
        <div 
          className="absolute inset-0 h-full w-full" 
          style={{ clipPath: `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)` }}
        >
          <Image 
            src={item.beforeImage} 
            alt="Before" 
            fill
            priority={priority}
            quality={85}
            sizes="(max-width: 768px) 100vw, 33vw"
            className={`object-cover ${item.objectPos}`} 
            draggable={false} 
          />
          {/* Dark overlay on 'Before' side to separate it from the crisp AI output */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* SLIDER LINE & GLOWING HANDLE */}
        <div 
          className="absolute inset-y-0 z-40 flex items-center justify-center touch-none"
          style={{ left: `${position}%`, width: '48px', marginLeft: '-24px' }}
        >
          {/* Visual thin line with a gold tint */}
          <div className="absolute inset-y-0 w-[2px] bg-gradient-to-b from-white/20 via-white to-white/20 shadow-[0_0_15px_rgba(255,255,255,0.8)] pointer-events-none z-10"></div>
          
          {/* Floating visual handle */}
          <div className={`relative z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white bg-black/50 backdrop-blur-sm text-white shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-transform duration-300 ${isInteracting ? 'scale-125 border-[var(--color-gold)] text-[var(--color-gold)] shadow-[0_0_25px_rgba(212,175,55,0.6)]' : 'scale-100'}`}>
            <span className="font-[family-name:var(--mono)] text-[9px] font-black tracking-tighter">&lt;|&gt;</span>
          </div>
        </div>

        {/* FLOATING TECH TAGS */}
        <div className="absolute left-3 top-3 z-30 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 backdrop-blur-md border border-white/10 pointer-events-none">
          <ScanFace size={12} className="text-gray-300" />
          <span className="font-[family-name:var(--mono)] text-[9px] uppercase tracking-[1px] text-gray-200">Raw Input</span>
        </div>

        <div className="absolute right-3 top-3 z-30 flex items-center gap-1.5 rounded-full bg-[var(--color-gold)] px-2.5 py-1 backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.4)] border border-yellow-300/30 pointer-events-none">
          <Sparkles size={12} className="text-black" />
          <span className="font-[family-name:var(--mono)] text-[9px] font-bold uppercase tracking-[1px] text-black">AI Output</span>
        </div>

        {/* Bottom Tech Stats (Always visible but slightly faded until hover) */}
        <div className={`absolute bottom-3 left-3 right-3 z-30 flex justify-between items-end pointer-events-none transition-opacity duration-300 ${isInteracting ? 'opacity-100' : 'opacity-60'}`}>
          <div className="bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[9px] font-[family-name:var(--mono)] font-bold tracking-widest text-green-400 border border-green-500/30 w-fit">
            MATCH: {item.match}
          </div>
          <div className="bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[9px] font-[family-name:var(--mono)] tracking-widest text-white/90 border border-white/10 w-fit">
            {item.time}
          </div>
        </div>

      </div>
    </div>
  );
}