"use client";

import { useEffect, useRef, useState } from "react";
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
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const state = useRef({
    currentX: 0,
    targetX: 0,
    lastX: 0,
    isDragging: false,
    startClientX: 0,
    startTargetX: 0,
  });

  const SPACING = 340;
  const COUNT = CAROUSEL_ITEMS.length;
  const LOOP_LENGTH = COUNT * SPACING;

  const mod = (n: number, m: number) => ((n % m) + m) % m;
  const wrapDelta = (d: number) => mod(d + LOOP_LENGTH / 2, LOOP_LENGTH) - LOOP_LENGTH / 2;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.querySelectorAll<HTMLElement>('.organic-card'));

    let rafId: number;

    const animate = () => {
      const { targetX, currentX, lastX } = state.current;
      const delta = wrapDelta(targetX - currentX);
      state.current.currentX += delta * 0.08;
      
      const newCurrentX = state.current.currentX;
      const dragSpeed = newCurrentX - lastX;
      state.current.lastX = newCurrentX;

      const currentActive = ((Math.round(newCurrentX / SPACING) % COUNT) + COUNT) % COUNT;
      setActiveIndex(currentActive);

      cards.forEach((card, i) => {
        let offset = (i * SPACING) - newCurrentX;
        offset = wrapDelta(offset);
        let normalizedOffset = offset / SPACING; 
        let absOffset = Math.abs(normalizedOffset);
        
        let z = absOffset < 1 ? Math.cos(absOffset * Math.PI/2) * 100 : 0;
        z -= absOffset * 200; 
        
        let y = Math.sin(Date.now() / 800 + i) * 15;
        let rotateY = normalizedOffset * -25; 
        let rotateZ = (normalizedOffset * 5) + (dragSpeed * -0.2); 
        
        card.style.transform = `translate3d(${offset}px, ${y}px, ${z}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
        card.style.zIndex = String(Math.round(100 - absOffset * 10));
        card.style.opacity = String(1 - (absOffset * 0.3));
        
        let shadowX = normalizedOffset * 20;
        card.style.boxShadow = `${shadowX}px 20px 50px rgba(0,0,0,${0.8 - absOffset*0.2})`;
      });

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    state.current.isDragging = true;
    state.current.startClientX = e.clientX;
    state.current.startTargetX = state.current.targetX;
    if (wrapperRef.current) wrapperRef.current.style.cursor = 'grabbing';
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!state.current.isDragging) return;
      const delta = state.current.startClientX - e.clientX;
      state.current.targetX = state.current.startTargetX + delta * 1.5;
    };

    const handlePointerUp = () => {
      if (!state.current.isDragging) return;
      state.current.isDragging = false;
      if (wrapperRef.current) wrapperRef.current.style.cursor = 'default';
      state.current.targetX = Math.round(state.current.targetX / SPACING) * SPACING;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  const next = () => { state.current.targetX += SPACING; };
  const prev = () => { state.current.targetX -= SPACING; };
  const goTo = (i: number) => {
    const currentActive = ((Math.round(state.current.currentX / SPACING) % COUNT) + COUNT) % COUNT;
    let diff = i - currentActive;
    const half = Math.floor(COUNT / 2);
    diff = ((diff + half) % COUNT) - half;
    state.current.targetX = Math.round(state.current.currentX / SPACING) * SPACING + diff * SPACING;
  };

  return (
    <section className="bg-[#050505] py-32 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-20 mb-12">
        <div className="text-center">
          <h2 className="font-bold mb-4 display-font type-h2 text-balance text-white">Trending Aesthetics</h2>
          <p className="text-gray-200/80 max-w-2xl mx-auto type-lead text-balance">
            Drag to explore what’s viral right now. See a look you love? Remix it instantly onto your face.
          </p>
        </div>
      </div>

      <div 
        ref={wrapperRef}
        onPointerDown={handlePointerDown}
        className="carousel-wrapper"
      >
        <div ref={trackRef} className="carousel-track">
          {CAROUSEL_ITEMS.map((item) => (
            <div key={item.id} className="organic-card group">
              <Image 
                src={item.image} 
                alt={`${item.name} style AI generated portrait - PicFOMO aesthetic showcase`} 
                fill 
                className="object-cover pointer-events-none" 
              />
              <div className="organic-card-info absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                <div className="flex justify-between items-end w-full">
                  <span className="font-bold text-lg text-white">{item.name}</span>
                  <span className="text-[var(--gold)] text-xs font-bold">{item.cost}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="carousel-controls relative z-30 flex items-center justify-center gap-8 mt-8">
        <button onClick={prev} className="fluid-btn fluid-btn-dark w-12 h-12 rounded-full text-white">
          <span className="fluid-btn-bg"></span>
          <span className="fluid-text-wrapper">
            <span className="fluid-text fluid-text-top">←</span>
            <span className="fluid-text fluid-text-bottom">←</span>
          </span>
        </button>
        
        <div className="carousel-dots flex gap-2">
          {CAROUSEL_ITEMS.map((_, i) => (
            <div 
              key={i} 
              onClick={() => goTo(i)}
              className={`carousel-dot cursor-pointer w-2 h-2 rounded-full transition-all duration-300 ${i === activeIndex ? 'bg-[var(--gold)] scale-150 shadow-[0_0_10px_var(--gold)]' : 'bg-white/20'}`} 
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
