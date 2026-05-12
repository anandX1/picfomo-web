"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const CAROUSEL_ITEMS = [
  { id: 1, name: "Ghibli", cost: "⚡ 4.2k", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80" },
  { id: 2, name: "DSLR", cost: "⚡ 3.8k", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&q=80" },
  { id: 3, name: "Cyberpunk", cost: "⚡ 8.1k", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=80" },
  { id: 4, name: "Old Money", cost: "⚡ 2.4k", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80" },
  { id: 5, name: "Vogue", cost: "⚡ 5.5k", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&q=80" },
  { id: 6, name: "Fantasy", cost: "⚡ 1.9k", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&q=80" },
  { id: 7, name: "Editorial", cost: "⚡ 6.3k", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&q=80" },
];

export default function OrganicCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const next = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
  };

  const prev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + CAROUSEL_ITEMS.length) % CAROUSEL_ITEMS.length);
  };

  return (
    <section className="bg-[#050505] py-32 border-t border-white/5 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(212,175,55,0.05)] to-transparent" />
        <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-20 mb-12">
        <div className="text-center">
          <h2 className="font-bold mb-4 display-font type-h2 text-balance text-white">Trending Aesthetics</h2>
          <p className="text-gray-200/80 max-w-2xl mx-auto type-lead text-balance">
            Explore what’s viral right now. See a look you love? Remix it instantly onto your face.
          </p>
        </div>
      </div>

      <div className="relative h-[500px] flex items-center justify-center perspective-[1200px] touch-none">
        <div className="flex items-center justify-center relative w-full h-full">
          {CAROUSEL_ITEMS.map((item, i) => {
            const offset = (i - index + CAROUSEL_ITEMS.length) % CAROUSEL_ITEMS.length;
            const normalizedOffset = offset > CAROUSEL_ITEMS.length / 2 ? offset - CAROUSEL_ITEMS.length : offset;
            const absOffset = Math.abs(normalizedOffset);
            
            if (absOffset > 2) return null;

            return (
              <motion.div
                key={item.id}
                initial={false}
                animate={{
                  x: normalizedOffset * 300,
                  scale: 1 - absOffset * 0.15,
                  rotateY: normalizedOffset * -25,
                  z: -absOffset * 200,
                  opacity: 1 - absOffset * 0.4,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute w-[280px] h-[400px] rounded-[1.5rem] bg-[#111] border border-white/10 overflow-hidden shadow-2xl group cursor-pointer"
                style={{ zIndex: 10 - absOffset }}
              >
                <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black via-black/40 to-transparent">
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-lg text-white">{item.name}</span>
                    <span className="text-[var(--color-gold)] text-xs font-bold">{item.cost}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-8 mt-8 relative z-30">
        <button onClick={prev} className="fluid-btn fluid-btn-dark w-12 h-12 rounded-full text-white">
          <span className="fluid-btn-bg"></span>
          <span className="fluid-text-wrapper">
            <span className="fluid-text fluid-text-top">←</span>
            <span className="fluid-text fluid-text-bottom">←</span>
          </span>
        </button>
        
        <div className="flex gap-2">
          {CAROUSEL_ITEMS.map((_, i) => (
            <div 
              key={i} 
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === index ? 'bg-[var(--color-gold)] scale-150 shadow-[0_0_10px_var(--color-gold)]' : 'bg-white/20'}`} 
            />
          ))}
        </div>

        <button onClick={next} className="fluid-btn fluid-btn-dark w-12 h-12 rounded-full text-white">
          <span className="fluid-btn-bg"></span>
          <span className="fluid-text-wrapper">
            <span className="fluid-text fluid-text-top">→</span>
            <span className="fluid-text fluid-text-bottom">→</span>
          </span>
        </button>
      </div>
    </section>
  );
}
