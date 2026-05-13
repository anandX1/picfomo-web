"use client";

import { useEffect, useRef, useState } from "react";

const DOCK_ITEMS = [
  { id: "home", label: "Home", icon: "P", type: "brand" },
  { 
    id: "feed", 
    label: "Creator Feed", 
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
      </svg>
    ) 
  },
  { 
    id: "pricing", 
    label: "Pricing", 
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
        <line x1="7" y1="7" x2="7.01" y2="7"></line>
      </svg>
    ) 
  },
  { 
    id: "login", 
    label: "Login", 
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    ) 
  },
  { 
    id: "upload", 
    label: "Upload Photo", 
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
    ),
    isGold: true
  },
];

export default function MacDock({ activePage, setActivePage }: { activePage: string; setActivePage: (p: string) => void }) {
  const dockRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;
    const dock = dockRef.current;
    if (!dock) return;

    const items = Array.from(dock.querySelectorAll<HTMLElement>('.dock-item'));
    const maxScale = 1.55;
    const influence = 160;

    const onMouseMove = (e: MouseEvent) => {
        let closest: HTMLElement | null = null;
        let closestDist = Infinity;

        items.forEach(item => {
            const rect = item.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const distance = Math.abs(e.clientX - centerX);
            if (distance < closestDist) {
                closestDist = distance;
                closest = item;
            }
        });

        items.forEach(item => {
            const icon = item.querySelector<HTMLElement>('.dock-icon');
            if (!icon) return;
            
            if (item !== closest || closestDist >= influence) {
                icon.style.transform = '';
                icon.style.boxShadow = '';
                return;
            }

            const normalized = 1 - (closestDist / influence);
            const scale = 1 + (Math.min(maxScale, 1.32) - 1) * Math.sin(normalized * Math.PI / 2);
            const lift = (scale - 1) * -10;
            
            icon.style.transform = `translate3d(0, ${lift}px, 0) scale(${scale})`;
            icon.style.boxShadow = `0 14px 28px rgba(0,0,0,0.65), 0 0 ${18 + (scale-1)*30}px rgba(212,175,55,0.18)`;
        });
    };

    const onMouseLeave = () => {
        items.forEach(item => {
            const icon = item.querySelector<HTMLElement>('.dock-icon');
            if (icon) {
                icon.style.transform = '';
                icon.style.boxShadow = '';
            }
        });
    };

    dock.addEventListener('mousemove', onMouseMove);
    dock.addEventListener('mouseleave', onMouseLeave);
    return () => {
        dock.removeEventListener('mousemove', onMouseMove);
        dock.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div className="mac-dock-wrapper fixed top-6 left-1/2 -translate-x-1/2 z-[200]">
      <div
        ref={dockRef}
        className="mac-dock flex items-start gap-4 p-2.5 px-3 bg-black/55 backdrop-blur-[22px] rounded-[24px] border border-white/12 shadow-[0_18px_50px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.08)]"
      >
        {DOCK_ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => setActivePage(item.id)}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`dock-item group relative flex flex-col items-center justify-start cursor-pointer w-[62px] h-[62px] shrink-0 ${item.type === 'brand' ? 'brand' : ''} ${item.id === activePage ? 'active' : ''}`}
          >
            <div className={`dock-tooltip absolute bottom-[-45px] bg-black/90 border border-white/15 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white transition-all duration-200 pointer-events-none whitespace-nowrap backdrop-blur-md shadow-xl z-[210] 
                ${hoveredId === item.id ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95'}`}
            >
              {item.label}
            </div>
            
            <div 
              className={`dock-icon w-full aspect-square rounded-2xl flex items-center justify-center transition-all duration-200 border border-white/10 shadow-lg 
                ${item.id === activePage ? 'bg-white text-black' : 'bg-white/5 text-gray-400'} 
                group-hover:bg-[var(--gold)] group-hover:text-black group-hover:border-white/20 
                ${item.isGold && item.id !== activePage ? 'text-[var(--gold)]' : ''}`}
            >
              {typeof item.icon === 'string' ? (
                <span className="text-xl font-extrabold font-plus">{item.icon}</span>
              ) : (
                <div className="w-[52%] h-[52%]">{item.icon}</div>
              )}
            </div>
            
            <div className={`dock-dot w-1 h-1 rounded-full mt-1.5 transition-all duration-300 ${item.id === activePage ? 'bg-[var(--gold)] shadow-[0_0_8px_var(--gold)]' : 'bg-transparent'}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
