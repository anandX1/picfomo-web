"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

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

function DockItem({ item, mouseX, activeId, onClick }: { 
  item: any; 
  mouseX: any; 
  activeId: string;
  onClick: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [62, 100, 62]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      onClick={() => onClick(item.id)}
      className="dock-item group relative flex flex-col items-center justify-end cursor-pointer h-[62px] shrink-0"
    >
      <div className="dock-tooltip absolute top-[-45px] bg-black/90 border border-white/15 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 pointer-events-none whitespace-nowrap backdrop-blur-md shadow-xl z-[210]">
        {item.label}
      </div>
      
      <motion.div 
        className={`dock-icon w-full aspect-square rounded-2xl flex items-center justify-center transition-colors duration-200 border border-white/10 shadow-lg 
          ${item.id === activeId ? 'bg-white text-black' : 'bg-white/5 text-gray-400'} 
          group-hover:bg-[var(--color-gold)] group-hover:text-black group-hover:border-white/20 group-hover:shadow-[0_14px_28px_rgba(0,0,0,0.65),0_0_32px_rgba(212,175,55,0.35)]
          ${item.isGold ? 'text-[var(--color-gold)]' : ''}`}
      >
        {typeof item.icon === 'string' ? (
          <span className="text-xl font-extrabold font-plus">{item.icon}</span>
        ) : (
          <div className="w-[52%] h-[52%]">{item.icon}</div>
        )}
      </motion.div>
      
      <div className={`dock-dot w-1 h-1 rounded-full mt-1.5 transition-all duration-300 ${item.id === activeId ? 'bg-[var(--color-gold)] shadow-[0_0_8px_var(--color-gold)]' : 'bg-transparent'}`} />
    </motion.div>
  );
}

export default function MacDock({ activePage, setActivePage }: { activePage: string; setActivePage: (p: string) => void }) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="mac-dock-wrapper fixed bottom-8 left-1/2 -translate-x-1/2 z-[200]">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="mac-dock flex items-end gap-4 p-2.5 px-3 bg-black/55 backdrop-blur-[22px] rounded-[24px] border border-white/12 shadow-[0_18px_50px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.08)]"
      >
        {DOCK_ITEMS.map((item) => (
          <DockItem 
            key={item.id} 
            item={item} 
            mouseX={mouseX} 
            activeId={activePage}
            onClick={setActivePage}
          />
        ))}
      </motion.div>
    </div>
  );
}
