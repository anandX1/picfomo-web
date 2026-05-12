"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
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
    image: "/hero/4.png",
    side: "left"
  },
  {
    id: 4,
    title: "4. Remix & Earn Sparks",
    desc: "Publish to the Creator Feed. When someone hits Remix, you earn Sparks to generate more premium looks.",
    image: "/hero/3.png",
    side: "right",
    isSpecial: true
  }
];

function TimelineStep({ step, index }: { step: any; index: number }) {
  return (
    <div className={`w-full flex ${step.side === 'left' ? 'justify-start' : 'justify-end'} relative mb-24 md:mb-32`}>
      {/* Node */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#111] border-2 border-white/20 z-20 hidden md:block" />
      
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full md:w-[45%] relative z-20"
      >
        <div className={`step-label absolute top-[-1rem] z-30 bg-[#1A1A1A] border border-white/10 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-xl ${step.side === 'left' ? 'right-8' : 'left-8'}`}>
          {step.title}
        </div>

        <div className="tilt-card group">
          <div className={`tilt-card__face step-card min-h-[288px] aspect-[5/3] rounded-[1.5rem] overflow-hidden border border-white/5 bg-[#111] shadow-2xl relative ${step.isGold ? 'bg-[var(--color-gold)]' : ''}`}>
             <div className="tilt-card__shine" />
             <div className="tilt-card__parallax w-full h-full relative p-6 flex flex-col justify-end">
                {step.isGold ? (
                   <div className="flex h-full">
                      <div className="w-[45%] flex flex-col justify-center pr-4">
                        <p className="text-black font-bold text-sm leading-snug">{step.desc}</p>
                      </div>
                      <div className="w-[55%] relative rounded-xl overflow-hidden border-l border-white/20">
                        <Image src={step.image} alt={step.title} fill className="object-cover object-top" />
                      </div>
                   </div>
                ) : step.isSpecial ? (
                  <div className="absolute inset-0 p-0 overflow-hidden flex flex-col items-center justify-center">
                    <div className="absolute inset-0 bg-black z-0" />
                    <div className="absolute inset-0 opacity-20 mix-blend-screen bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                    
                    <div className="relative z-10 flex flex-col items-center px-8">
                       <div className="w-16 h-16 rounded-full border-2 border-[var(--color-gold)] overflow-hidden mb-4 relative shadow-lg">
                          <Image src="https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=200" alt="Avatar" fill className="object-cover" />
                       </div>
                       <h4 className="text-white font-bold mb-2">Your aesthetic is live.</h4>
                       <p className="text-gray-400 text-xs text-center mb-6 leading-relaxed">{step.desc}</p>
                       <div className="w-full bg-[#151515] p-3 rounded-xl border border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <span className="w-5 h-5 rounded-full bg-[var(--color-gold)] flex items-center justify-center text-[10px] text-black font-black">⚡</span>
                             <span className="text-xs font-bold text-white">55 Sparks</span>
                          </div>
                          <div className="bg-[var(--color-gold)] text-black px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wide">Generate</div>
                       </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <Image src={step.image} alt={step.title} fill className="object-cover object-top opacity-60" />
                    <div className="absolute top-4 right-4 bg-white text-black text-[10px] font-bold p-3 w-40 rounded-md shadow-2xl leading-snug z-10">
                      {step.desc}
                    </div>
                  </>
                )}
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function NewTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section ref={containerRef} className="max-w-5xl mx-auto px-6 py-32 flex flex-col items-center relative">
      <div className="text-center mb-24">
        <h2 className="font-bold mb-3 display-font type-h2 text-balance text-white">How <span className="font-black text-[var(--color-gold)]">picfomo.com</span> works</h2>
        <p className="text-gray-300/70 font-semibold uppercase text-sm tracking-[0.22em]">One selfie → any aesthetic → remix culture → Sparks</p>
      </div>

      <div className="relative w-full">
        {/* Progress Line */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-white/10 -translate-x-1/2 z-0" />
        <motion.div 
          style={{ scaleY, transformOrigin: "top" }}
          className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-[var(--color-gold)] -translate-x-1/2 z-10 shadow-[0_0_15px_rgba(212,175,55,0.8)]" 
        />

        <div className="flex flex-col">
          {STEPS.map((step, i) => (
            <TimelineStep key={step.id} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
