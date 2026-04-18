"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Lock, ScanFace, Sparkles } from "lucide-react";

// 🌟 THE REAL R2 ASSETS WITH FRAMING OFFSETS
const RESULTS_DATA = [
  {
    id: "kohli",
    name: "Virat Kohli",
    style: "Mythic Marble",
    beforeImage: "https://pub-ad6276faad1f4954ad679b43ef8c4afd.r2.dev/Screenshot%202026-04-18%20211937.png",
    afterImage: "https://pub-ad6276faad1f4954ad679b43ef8c4afd.r2.dev/Gemini_Generated_Image_m4gtnjm4gtnjm4gt.png",
    match: "99.8%",
    time: "14.2s",
    objectPos: "object-center"
  },
  {
    id: "cr7",
    name: "Cristiano Ronaldo",
    style: "Old Money Luxury",
    beforeImage: "https://pub-ad6276faad1f4954ad679b43ef8c4afd.r2.dev/OIP.webp",
    afterImage: "https://pub-ad6276faad1f4954ad679b43ef8c4afd.r2.dev/Gemini_Generated_Image_ufc3etufc3etufc3.png",
    match: "99.6%",
    time: "16.1s",
    objectPos: "object-top" // 🌟 FIX 1: Lowers CR7's face perfectly into frame
  },
  {
    id: "vintage",
    name: "Historical Photo",
    style: "Colorized Legacy",
    beforeImage: "https://pub-ad6276faad1f4954ad679b43ef8c4afd.r2.dev/McHugh-KIA-760x570.jpg",
    afterImage: "https://pub-ad6276faad1f4954ad679b43ef8c4afd.r2.dev/PicFOMO_1776528188854.jpg",
    match: "99.9%",
    time: "18.5s",
    objectPos: "object-center"
  }
];

export default function ResultsGrid() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % RESULTS_DATA.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + RESULTS_DATA.length) % RESULTS_DATA.length);

  return (
    <section className="mx-auto max-w-[1120px] px-6 py-16 md:px-10 md:py-24" id="results">
      
      {/* 🌟 HIGH-TECH HEADER */}
      <div className="mb-4 flex items-center gap-3 font-[family-name:var(--mono)] text-[10px] uppercase tracking-[4px] text-[var(--color-gold)]">
        <Lock size={14} className="text-[var(--color-gold)]" />
        [ PuLID IDENTITY PRESERVATION ]
      </div>
      
      <h2 className="mb-4 font-[family-name:var(--display)] text-[clamp(36px,4vw,60px)] leading-[0.9] tracking-[-0.5px] text-[var(--color-ink)]">
        UNREAL QUALITY.<br />
        100% YOU.
      </h2>
      
      <p className="mb-12 max-w-[540px] text-[15px] md:text-[18px] font-light leading-[1.7] text-[var(--color-ink2)]">
        Most AI makes you look like a plastic video game character. Our Identity-Lock tech maps 120+ facial points so you look exactly like you — just in a different universe.
      </p>

      {/* --- DESKTOP VIEW: 3 Sliders Side-by-Side --- */}
      <div className="hidden md:grid grid-cols-3 gap-6">
        {RESULTS_DATA.map((item) => (
          <BeforeAfterSlider key={item.id} item={item} />
        ))}
      </div>

      {/* --- MOBILE VIEW: Interactive Swipe Deck --- */}
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
              <BeforeAfterSlider item={RESULTS_DATA[currentIndex]} isMobile={true} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Controls */}
        <div className="mt-6 flex items-center justify-between px-2">
          <div className="font-[family-name:var(--mono)] text-[12px] uppercase tracking-[2px] text-[var(--color-ink3)]">
            {currentIndex + 1} / {RESULTS_DATA.length}
          </div>
          <div className="flex gap-3">
            <button onClick={prevSlide} className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--rule)] bg-white shadow-sm transition-all hover:bg-[var(--color-gold-pale)] hover:text-[var(--color-ink)] active:scale-95">
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextSlide} className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--rule)] bg-[var(--color-ink)] text-white shadow-md transition-all hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)] active:scale-95">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

    </section>
  );
}

// 🌟 THE MAGIC SLIDER COMPONENT
function BeforeAfterSlider({ item, isMobile = false }: { item: any, isMobile?: boolean }) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    // 🌟 FIX 2: On mobile, we ONLY calculate slide position if the user is explicitly dragging the handle
    if (isMobile && !isDragging) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? (e as any).touches[0].clientX : (e as any).clientX;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setPosition(percent);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Name and Style Headers */}
      <div className="flex justify-between items-end px-1">
        <div>
          <div className="font-[family-name:var(--mono)] text-[9px] uppercase tracking-[2px] text-[var(--color-ink3)]">Input</div>
          <div className="font-medium text-[14px] text-[var(--color-ink)]">{item.name}</div>
        </div>
        <div className="text-right">
          <div className="font-[family-name:var(--mono)] text-[9px] uppercase tracking-[2px] text-[var(--color-gold)]">Output</div>
          <div className="font-medium text-[14px] text-[var(--color-ink)]">{item.style}</div>
        </div>
      </div>

      {/* The Actual Image Container */}
      <div 
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerUp={() => setIsDragging(false)}
        onPointerLeave={() => { setIsHovered(false); setIsDragging(false); }}
        onPointerCancel={() => setIsDragging(false)}
        onMouseEnter={() => setIsHovered(true)}
        className={`group relative aspect-[3/4] w-full overflow-hidden rounded-[16px] shadow-[var(--shadow-md)] bg-gray-900 border border-[var(--rule)] ${!isMobile ? 'cursor-ew-resize' : ''} ${isDragging ? 'touch-none' : ''}`}
      >
        {/* AFTER IMAGE (Bottom Layer) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.afterImage} alt="After" className={`absolute inset-0 h-full w-full object-cover ${item.objectPos}`} draggable={false} />
        
        {/* BEFORE IMAGE (Top Layer - Clipped) */}
        <div 
          className="absolute inset-0 h-full w-full object-cover" 
          style={{ clipPath: `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.beforeImage} alt="Before" className={`absolute inset-0 h-full w-full object-cover filter blur-[2px] md:blur-0 ${item.objectPos}`} draggable={false} />
          
          {/* Dark overlay on 'Before' side to make it clear it's the raw input */}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* 🌟 SLIDER LINE & INVISIBLE DRAG HANDLE FOR MOBILE */}
        <div 
          className="absolute inset-y-0 z-40 flex items-center justify-center touch-none"
          style={{ left: `${position}%`, width: '48px', marginLeft: '-24px' }}
          onPointerDown={(e) => {
            if (isMobile) {
              setIsDragging(true);
              e.currentTarget.setPointerCapture(e.pointerId);
            }
          }}
          onPointerUp={(e) => {
            if (isMobile) {
              setIsDragging(false);
              e.currentTarget.releasePointerCapture(e.pointerId);
            }
          }}
        >
          {/* Visual thin white line */}
          <div className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none z-10"></div>
          
          {/* Floating visual handle */}
          <div className={`relative z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-xl transition-transform ${isHovered || isDragging ? 'scale-110' : 'scale-100'}`}>
            <span className="font-[family-name:var(--mono)] text-[10px] font-black tracking-tighter">&lt;|&gt;</span>
          </div>
        </div>

        {/* 🌟 FLOATING TECH TAGS */}
        
        {/* Top Left: Raw Input */}
        <div className="absolute left-3 top-3 z-30 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 backdrop-blur-md border border-white/10 pointer-events-none">
          <ScanFace size={10} className="text-gray-300" />
          <span className="font-[family-name:var(--mono)] text-[8px] uppercase tracking-[1px] text-gray-200">Raw Input</span>
        </div>

        {/* Top Right: AI Output */}
        <div className="absolute right-3 top-3 z-30 flex items-center gap-1.5 rounded-full bg-[var(--color-gold)]/90 px-2.5 py-1 backdrop-blur-md shadow-lg border border-yellow-300/30 pointer-events-none">
          <Sparkles size={10} className="text-black" />
          <span className="font-[family-name:var(--mono)] text-[8px] font-bold uppercase tracking-[1px] text-black">AI Output</span>
        </div>

        {/* Bottom Tech Stats */}
        <div className="absolute bottom-3 left-3 right-3 z-30 flex justify-between items-end opacity-90 transition-opacity group-hover:opacity-100 pointer-events-none">
          <div className="flex flex-col gap-1">
            <div className="bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-[family-name:var(--mono)] text-green-400 border border-green-500/30 w-fit">
              Identity Match: {item.match}
            </div>
          </div>
          <div className="bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-[family-name:var(--mono)] text-white/80 border border-white/10 w-fit">
            Render: {item.time}
          </div>
        </div>

      </div>
    </div>
  );
}