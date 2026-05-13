"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function IdentityFlow() {
  const sectionRef = useRef<HTMLElement>(null);
  const path1Ref = useRef<SVGPathElement>(null);
  const path2Ref = useRef<SVGPathElement>(null);
  const [lengths, setLengths] = useState<number[]>([0, 0]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Calculate path lengths for the scroll-draw effect
    if (path1Ref.current && path2Ref.current) {
      setLengths([
        path1Ref.current.getTotalLength(),
        path2Ref.current.getTotalLength()
      ]);
    }

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const r = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const anchor = r.top + r.height * 0.3;
      const start = vh * 0.9;
      const end = vh * 0.3;
      const t = (start - anchor) / (start - end);
      setProgress(Math.max(0, Math.min(1, t)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getPathStyle = (index: number) => {
    const len = lengths[index];
    if (!len) return { opacity: 0 };
    
    const stagger = index === 0 ? progress : Math.max(0, Math.min(1, (progress - 0.12) / 0.85));
    const ease = stagger * stagger * (3 - 2 * stagger);
    
    return {
      strokeDasharray: len,
      strokeDashoffset: len * (1 - ease),
    };
  };

  return (
    <section 
      ref={sectionRef} 
      className="py-24 border-y border-white/5 brand-gold-glow brand-gold-glow--section relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="font-bold mb-4 display-font type-h2 text-balance text-white">Zero prompts. Your identity stays you.</h2>
          <p className="text-gray-100/80 max-w-2xl mx-auto type-lead text-balance">
            Our Identity‑Lock™ tech preserves your real facial structure, while styles change completely—from Ghibli to Cyberpunk to DSLR realism.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-32 relative mt-8">
          <div className="text-5xl md:text-6xl font-bold tracking-tight z-10 relative text-center md:text-left display-font text-white">
            picfomo<span className="text-[var(--gold)]">.com</span>
            
            {/* Desktop Arrows */}
            <svg className="hidden md:block absolute -right-28 md:-right-32 -top-24 w-28 h-28 md:w-32 md:h-32 text-gray-500 pointer-events-none" viewBox="0 0 100 100">
              <path 
                ref={path1Ref}
                className="stroke-current fill-none stroke-[1.5] transition-all duration-100" 
                style={getPathStyle(0)}
                d="M 90,10 C 50,10 20,40 10,80 L 0,70 M 10,80 L 20,70"
              />
            </svg>
            <svg className="hidden md:block absolute -right-28 md:-right-32 -bottom-24 w-28 h-28 md:w-32 md:h-32 text-gray-500 pointer-events-none" viewBox="0 0 100 100">
              <path 
                ref={path2Ref}
                className="stroke-current fill-none stroke-[1.5] transition-all duration-100" 
                style={getPathStyle(1)}
                d="M 10,20 C 20,60 50,90 90,90 L 80,80 M 90,90 L 80,100"
              />
            </svg>
          </div>

          <div className="flex flex-col gap-12 md:gap-16 z-10">
            {/* Input Card */}
            <div className="relative group transition hover:-translate-y-1 duration-300">
              <div className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 bg-white text-black text-[10px] font-bold px-3 py-1.5 rounded shadow-lg z-20 lowercase tracking-wider border border-gray-200 uppercase">input</div>
              <div className="bg-black p-1.5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden">
                <Image 
                  src="/results/kohli-before.png" 
                  alt="Original" 
                  width={400} 
                  height={240} 
                  className="w-80 h-52 md:w-[26rem] md:h-60 lg:w-[28rem] lg:h-64 object-cover object-top rounded-xl grayscale-[20%]"
                />
              </div>
            </div>

            {/* Output Portraits */}
            <div className="relative group transition hover:-translate-y-1 duration-300 md:ml-12">
              <div className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 bg-[var(--gold)] text-black text-[10px] font-bold px-3 py-1.5 rounded shadow-lg z-20 lowercase tracking-wider border border-[var(--gold)] uppercase">output</div>
              <div className="flex -space-x-7 md:-space-x-8 relative z-10 pl-6 md:pl-10 justify-center md:justify-start">
                <div className="w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full border-4 border-[var(--gold)] overflow-hidden relative z-30 shadow-xl">
                  <Image src="/results/kohli-after.png" alt="Style 1" fill className="object-cover object-top" />
                </div>
                <div className="w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full border-4 border-[#3b82f6] overflow-hidden relative z-20 shadow-xl">
                  <Image src="/results/cr7-after.png" alt="Style 2" fill className="object-cover object-top saturate-[1.5] hue-rotate-[15deg]" />
                </div>
                <div className="w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full border-4 border-[#ec4899] overflow-hidden relative z-10 shadow-xl">
                  <Image src="/results/vintage-after.jpg" alt="Style 3" fill className="object-cover object-top contrast-[1.2]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
