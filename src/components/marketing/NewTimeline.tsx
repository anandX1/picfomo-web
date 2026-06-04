"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const STEPS = [
  {
    id: 1,
    title: "1. Upload one selfie",
    desc: "Privacy-first: uploads are automatically deleted right after processing.",
    image: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=800&auto=format&fit=crop&q=80",
    side: "left"
  },
  {
    id: 2,
    title: "2. Identity‑Lock™ Face Match",
    desc: "We map your facial structure so the output looks unmistakably like you—every time.",
    image: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=800&auto=format&fit=crop&q=80",
    side: "right",
    isGold: true
  },
  {
    id: 3,
    title: "3. Pick a trending aesthetic",
    desc: "Browse the Studio. What you see is exactly what you get—no prompt engineering required.",
    image: "/hero/4.webp",
    side: "left"
  },
  {
    id: 4,
    title: "4. Remix & Earn Sparks",
    desc: "Publish to the Creator Feed. When someone hits Remix, you earn Sparks to generate more premium looks.",
    image: "/hero/3.webp",
    side: "right",
    isSpecial: true
  }
];

function TimelineStep({ step, index, active }: { step: any; index: number; active: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const wrap = cardRef.current;
    if (!wrap) return;
    
    const face = wrap.querySelector<HTMLElement>('.tilt-card__face');
    const shine = wrap.querySelector<HTMLElement>('.tilt-card__shine');
    const parallax = wrap.querySelector<HTMLElement>('.tilt-card__parallax');
    if (!face) return;
    
    let raf: number | null = null;
    const onMouseMove = (e: MouseEvent) => {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
            const rect = face.getBoundingClientRect();
            const nx = (e.clientX - rect.left) / rect.width - 0.5;
            const ny = (e.clientY - rect.top) / rect.height - 0.5;
            const rotY = nx * 2 * 11;
            const rotX = -ny * 2 * 11;
            face.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;
            face.style.boxShadow = `${-rotY * 0.85}px ${rotX * 0.85}px 40px rgba(0,0,0,0.55), 0 0 48px rgba(212,175,55,0.26), 0 0 1px rgba(212,175,55,0.4)`;
            face.style.borderColor = 'rgba(212,175,55,0.38)';
            if (parallax) {
                parallax.style.transform = `translateZ(34px) translate3d(${-nx * 2 * 7}px,${-ny * 2 * 7}px,0)`;
            }
            if (shine) {
                shine.style.backgroundPosition = `${50 + nx * 110}% ${50 + ny * 110}%`;
            }
        });
    };
    
    const onMouseLeave = () => {
        if (raf) cancelAnimationFrame(raf);
        face.classList.add("tilt-resetting");
        face.style.transform = '';
        face.style.boxShadow = '';
        face.style.borderColor = '';
        if (parallax) parallax.style.transform = '';
        if (shine) shine.style.backgroundPosition = '';
    };

    wrap.addEventListener("mousemove", onMouseMove);
    wrap.addEventListener("mouseleave", onMouseLeave);
    wrap.addEventListener("mouseenter", () => face.classList.remove("tilt-resetting"));
    
    return () => {
        wrap.removeEventListener("mousemove", onMouseMove);
        wrap.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div className={`w-full flex ${step.side === 'left' ? 'justify-start' : 'justify-end'} relative mb-24 md:mb-32 transition-all duration-1000 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {/* Node */}
      <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-full bg-[#111] border-2 border-white/20 z-20 hidden md:block transition-all duration-500 ${active ? 'border-[var(--gold)] bg-[var(--gold)] shadow-[0_0_20px_var(--gold-glow)]' : ''}`} />
      
      <div className="w-full md:w-[45%] relative z-20">
        <div className={`step-label absolute top-[-1rem] z-30 bg-[#1A1A1A] border border-white/10 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-xl ${step.side === 'left' ? 'right-8' : 'left-8'} ${step.isSpecial ? '!text-[var(--gold)] border-[var(--gold)]/30' : ''}`}>
          {step.title}
        </div>

        <div ref={cardRef} className="tilt-card group">
          <div className={`tilt-card__face step-card min-h-[288px] aspect-[5/3] rounded-[1.5rem] overflow-hidden border border-white/5 bg-[#111] shadow-2xl relative ${step.isGold ? 'bg-[var(--gold)]' : ''}`}>
             <div className="tilt-card__shine" />
             <div className="tilt-card__parallax w-full h-full relative p-6 flex flex-col justify-end">
                {step.isGold ? (
                   <div className="flex h-full items-center">
                      <div className="w-[45%] flex flex-col justify-center pr-4">
                        <p className="text-black font-bold text-sm leading-snug">{step.desc}</p>
                      </div>
                      <div className="w-[60%] absolute right-0 inset-y-0 relative rounded-xl overflow-hidden border-l border-white/20">
                        <Image src={step.image} alt={step.title} fill className="object-cover object-top" />
                      </div>
                   </div>
                ) : step.isSpecial ? (
                  <div className="absolute inset-0 p-0 overflow-hidden flex flex-col items-center justify-center bg-[#050505]">
                    <div className="spectra-bg absolute inset-0">
                        <div className="spectra-gradient" />
                        <div className="spectra-noise" />
                        <div className="spectra-scanlines" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center px-8">
                       <div className="w-16 h-16 rounded-full border-2 border-[var(--gold)] overflow-hidden mb-3 relative shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                          <Image src="https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=200" alt="Avatar" fill className="object-cover" />
                          <div className="absolute -bottom-1 -right-1 bg-[var(--gold)] text-black text-[10px] font-black px-1.5 py-0.5 rounded-full border border-black">+2</div>
                       </div>
                       <h4 className="text-white font-bold mb-2">Your aesthetic is live.</h4>
                       <p className="text-gray-300/75 text-xs text-center mb-5 leading-relaxed text-balance">{step.desc}</p>
                       <div className="w-full bg-[#151515] p-2.5 rounded-lg border border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <span className="w-4 h-4 rounded-full bg-[var(--gold)] flex items-center justify-center text-[8px] text-black font-black">⚡</span>
                             <span className="text-xs font-bold text-white">55 Sparks</span>
                          </div>
                          <button className="fluid-btn fluid-btn-gold px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-wide">
                            <span className="fluid-btn-bg"></span>
                            <span className="fluid-text-wrapper">
                                <span className="fluid-text fluid-text-top">Generate</span>
                                <span className="fluid-text fluid-text-bottom">Generate</span>
                            </span>
                          </button>
                       </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col flex-1 min-h-0 w-full relative rounded-xl overflow-hidden">
                    <Image src={step.image} alt={step.title} fill className="object-cover object-top opacity-60" />
                    <div className="absolute top-4 right-4 bg-white text-black text-[10px] font-bold p-3 w-40 rounded-md shadow-2xl leading-snug z-10">
                      {step.desc}
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [percentage, setPercentage] = useState(0);
  const [activeSteps, setActiveSteps] = useState<boolean[]>(new Array(STEPS.length).fill(false));

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowMid = window.innerHeight / 2;
      let scrolled = windowMid - rect.top;
      let p = (scrolled / rect.height) * 100;
      setPercentage(Math.max(0, Math.min(100, p)));
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const idx = parseInt(entry.target.getAttribute('data-index') || '0');
                setActiveSteps(prev => {
                    const next = [...prev];
                    next[idx] = true;
                    return next;
                });
            }
        });
    }, { threshold: 0.3, rootMargin: "0px 0px -10% 0px" });

    if (containerRef.current) {
      const stepElements = containerRef.current.querySelectorAll('.timeline-step-wrapper');
      stepElements.forEach(el => observer.observe(el));
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
        window.removeEventListener("scroll", handleScroll);
        observer.disconnect();
    };
  }, []);

  return (
    <section ref={containerRef} className="max-w-5xl mx-auto px-6 py-32 flex flex-col items-center relative">
      <div className="text-center mb-24">
        <h2 className="font-bold mb-3 display-font type-h2 text-balance text-white">How <span className="font-black text-[var(--gold)]">picfomo.com</span> works</h2>
        <p className="text-gray-300/70 font-semibold uppercase text-sm tracking-[0.22em]">One selfie → any aesthetic → remix culture → Sparks</p>
      </div>

      <div className="relative w-full">
        {/* Progress Line */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-white/10 -translate-x-1/2 z-0" />
        <div 
          style={{ height: `${percentage}%` }}
          className="hidden md:block absolute left-1/2 top-0 w-[2px] bg-[var(--gold)] -translate-x-1/2 z-10 shadow-[0_0_15px_rgba(212,175,55,0.8)] transition-all duration-100 ease-out" 
        />

        <div className="flex flex-col">
          {STEPS.map((step, i) => (
            <div key={step.id} className="timeline-step-wrapper" data-index={i}>
                <TimelineStep step={step} index={i} active={activeSteps[i]} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
