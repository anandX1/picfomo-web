"use client";

import { motion } from "framer-motion";
import { Sparkles, Briefcase, Shirt, ShoppingBag, TrendingUp, History, Coins, Repeat, ArrowRight, Zap } from "lucide-react";

export default function StylePalette() {
  return (
    <section className="mx-auto max-w-[1120px] px-6 py-16 md:px-10 md:py-24" id="features">
      
      {/* 🌟 PREMIUM HEADER */}
      <div className="mb-4 flex items-center gap-3 font-[family-name:var(--mono)] text-[10px] uppercase tracking-[4px] text-[var(--color-gold)]">
        <Sparkles size={14} className="text-[var(--color-gold)]" />
        [ THE PICFOMO ECOSYSTEM ]
      </div>
      
      <h2 className="mb-4 font-[family-name:var(--display)] text-[clamp(36px,4vw,60px)] leading-[0.9] tracking-[-0.5px] text-[var(--color-ink)] uppercase">
        Not just a studio.<br />
        A Visual Arsenal.
      </h2>
      
      <p className="mb-12 max-w-[580px] text-[15px] md:text-[18px] font-light leading-[1.7] text-[var(--color-ink2)]">
        From high-end virtual try-ons to magical photo restoration, backed by a revolutionary creator economy where your viral styles generate real revenue.
      </p>

      {/* 🌟 THE BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 md:gap-6 h-auto md:h-[600px]">
        
        {/* =========================================
            BOX 1: PHASE 1 USE CASES (Span 2 cols, 1 row)
            ========================================= */}
        <div className="md:col-span-2 md:row-span-1 rounded-2xl border border-[var(--rule)] bg-white shadow-[var(--shadow-sm)] p-6 md:p-8 flex flex-col justify-center group transition-shadow hover:shadow-[var(--shadow-md)]">
          
          <h3 className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[2px] text-[var(--color-ink3)] mb-6">Infinite Applications</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
            <div className="flex gap-4 items-start">
              <div className="bg-[var(--color-cream)] p-3 rounded-xl"><Briefcase size={20} className="text-[var(--color-gold)]" /></div>
              <div>
                <h4 className="font-bold text-[14px] mb-1">Pro Headshots</h4>
                <p className="text-[13px] text-[var(--color-ink3)] leading-relaxed">Turn casual selfies into crisp, studio-lit LinkedIn and corporate portraits.</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="bg-[var(--color-cream)] p-3 rounded-xl"><ShoppingBag size={20} className="text-[var(--color-gold)]" /></div>
              <div>
                <h4 className="font-bold text-[14px] mb-1">E-Commerce Ready</h4>
                <p className="text-[13px] text-[var(--color-ink3)] leading-relaxed">Generate perfect product modeling shots without hiring a photographer.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-[var(--color-cream)] p-3 rounded-xl"><Shirt size={20} className="text-[var(--color-gold)]" /></div>
              <div>
                <h4 className="font-bold text-[14px] mb-1">Virtual Try-On</h4>
                <p className="text-[13px] text-[var(--color-ink3)] leading-relaxed">Test luxury streetwear, tactical gear, or bespoke suits instantly.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-[var(--color-cream)] p-3 rounded-xl"><TrendingUp size={20} className="text-[var(--color-gold)]" /></div>
              <div>
                <h4 className="font-bold text-[14px] mb-1">Viral Aesthetics</h4>
                <p className="text-[13px] text-[var(--color-ink3)] leading-relaxed">Ride the algorithm. Become a PS2 character or a Ghibli anime hero.</p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            BOX 2: THE CREATOR FLYWHEEL (Span 1 col, 2 rows)
            ========================================= */}
        <div className="md:col-span-1 md:row-span-2 rounded-2xl border border-[var(--rule)] bg-[var(--color-ink)] shadow-[var(--shadow-sm)] overflow-hidden flex flex-col relative group">
          <div className="p-6 md:p-8 relative z-20 bg-gradient-to-b from-[var(--color-ink)] via-[var(--color-ink)] to-transparent pb-10">
            <h3 className="font-[family-name:var(--display)] text-[22px] tracking-[1px] text-[var(--color-gold)] mb-2">The Creator Loop</h3>
            <p className="text-[13px] text-gray-400 leading-relaxed">Design viral styles. When the community uses them, you earn Sparks. The ultimate monetization flywheel.</p>
          </div>

          {/* Animated Flywheel Visual */}
          <div className="relative flex-1 overflow-hidden px-6 pb-6 flex flex-col items-center justify-center mask-vertical-fade">
            
            {/* The Loop Icon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
              <Repeat size={180} className="text-[var(--color-gold)] animate-spin-slow" />
            </div>

            <motion.div 
              animate={{ y: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 10 }}
              className="flex flex-col gap-4 w-full relative z-10"
            >
              {/* Fake Earnings Stream */}
              {[1, 2].map((loop) => (
                <div key={loop} className="flex flex-col gap-3">
                  <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center"><UserAvatar /></div>
                      <div className="text-[10px] text-gray-300">Used <span className="text-white font-bold">Cyberpunk</span></div>
                    </div>
                    <div className="text-[11px] font-bold text-green-400 flex items-center gap-1">+2 <Zap size={10} className="fill-green-400"/></div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-xl flex items-center justify-between ml-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center"><UserAvatar /></div>
                      <div className="text-[10px] text-gray-300">Used <span className="text-white font-bold">Old Money</span></div>
                    </div>
                    <div className="text-[11px] font-bold text-green-400 flex items-center gap-1">+2 <Zap size={10} className="fill-green-400"/></div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center"><UserAvatar /></div>
                      <div className="text-[10px] text-gray-300">Used <span className="text-white font-bold">Ghibli</span></div>
                    </div>
                    <div className="text-[11px] font-bold text-green-400 flex items-center gap-1">+2 <Zap size={10} className="fill-green-400"/></div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* =========================================
            BOX 3: THE TIME MACHINE (Span 1 col, 1 row)
            ========================================= */}
        <div className="rounded-2xl border border-[var(--rule)] bg-white shadow-[var(--shadow-sm)] p-6 md:p-8 flex flex-col justify-between group transition-shadow hover:shadow-[var(--shadow-md)] overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="font-[family-name:var(--display)] text-[22px] tracking-[1px] text-[var(--color-ink)] mb-2">The Time Machine</h3>
            <p className="text-[13px] text-[var(--color-ink3)]">Restore the past. Turn blurry or old black & white family photos into crisp, 4K colorized reality.</p>
          </div>
          
          <History size={120} className="absolute -bottom-6 -right-6 text-[var(--rule2)] group-hover:text-[var(--rule)] transition-colors transform -rotate-12" />
          
          <div className="mt-6 flex items-center gap-2 relative z-10">
            <span className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[1px] font-bold text-[var(--color-ink2)]">Blurry 1990s</span>
            <ArrowRight size={14} className="text-[var(--color-gold)]" />
            <span className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[1px] font-bold text-[var(--color-gold)]">4K Masterpiece</span>
          </div>
        </div>

        {/* =========================================
            BOX 4: FIRST MOVER ADVANTAGE (Span 1 col, 1 row)
            ========================================= */}
        <div className="rounded-2xl border border-[var(--color-gold-border)] bg-[var(--color-gold-pale)] shadow-[var(--shadow-sm)] p-6 md:p-8 flex flex-col justify-between group transition-shadow hover:shadow-[var(--shadow-md)]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Coins size={18} className="text-[var(--color-gold)]" />
              <h3 className="font-[family-name:var(--display)] text-[22px] tracking-[1px] text-[var(--color-ink)]">First Mover</h3>
            </div>
            <p className="text-[13px] text-[var(--color-ink3)]">Join Phase 1 now. Early adopters get massive advantages when the Phase 2 Creator Economy fully unlocks.</p>
          </div>
          
          <div className="mt-6">
            <button className="w-full bg-[var(--color-ink)] text-[var(--color-gold-light)] font-[family-name:var(--display)] tracking-[2px] py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95">
              SECURE SPOT
            </button>
          </div>
        </div>

      </div>

      <style jsx>{`
        .mask-vertical-fade {
          mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
        }
        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }
      `}</style>
    </section>
  );
}

// Simple avatar SVG component for the fake social feed
function UserAvatar() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}