"use client";

import { motion } from "framer-motion";
// 🌟 FIX: We aliased 'Infinity' to 'InfinityIcon' so it doesn't collide with JavaScript's global math Infinity!
import { X, Check, Clock, Zap, Shirt, Infinity as InfinityIcon, Camera, Smartphone, Calendar, Sparkles, Heart, Repeat, MessageCircle } from "lucide-react";

export default function StylePalette() {
  return (
    <section className="mx-auto max-w-[1120px] px-6 py-16 md:px-10 md:py-24" id="features">
      
      {/* 🌟 PREMIUM HEADER */}
      <div className="mb-4 flex items-center gap-3 font-[family-name:var(--mono)] text-[10px] uppercase tracking-[4px] text-[var(--color-gold)]">
        <Sparkles size={14} className="text-[var(--color-gold)]" />
        [ THE UNFAIR ADVANTAGE ]
      </div>
      
      <h2 className="mb-4 font-[family-name:var(--display)] text-[clamp(36px,4vw,60px)] leading-[0.9] tracking-[-0.5px] text-[var(--color-ink)] uppercase">
        The Studio is now<br />
        in your pocket.
      </h2>
      
      <p className="mb-12 max-w-[540px] text-[15px] md:text-[18px] font-light leading-[1.7] text-[var(--color-ink2)]">
        Stop paying $500 for headshots. Stop buying outfits for one Instagram post. Generate world-class portraits from your bed.
      </p>

      {/* 🌟 THE BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 md:gap-6 h-auto md:h-[600px]">
        
        {/* =========================================
            BOX 1: THE DISRUPTION (Span 2 cols, 1 row)
            ========================================= */}
        <div className="md:col-span-2 md:row-span-1 rounded-2xl border border-[var(--rule)] bg-white shadow-[var(--shadow-sm)] overflow-hidden flex flex-col md:flex-row group transition-shadow hover:shadow-[var(--shadow-md)]">
          
          {/* Left: The Old Way */}
          <div className="flex-1 p-8 bg-[var(--color-cream)] flex flex-col justify-center border-b md:border-b-0 md:border-r border-[var(--rule)]">
            <h3 className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[2px] text-[var(--color-ink3)] mb-6">The Old Way</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-[14px] text-[var(--color-ink2)]">
                <X size={16} className="text-red-400" /> $500+ for a photoshoot
              </li>
              <li className="flex items-center gap-3 text-[14px] text-[var(--color-ink2)]">
                <Clock size={16} className="text-red-400" /> 2 weeks for edits
              </li>
              <li className="flex items-center gap-3 text-[14px] text-[var(--color-ink2)]">
                <Shirt size={16} className="text-red-400" /> Max 2 outfit changes
              </li>
              <li className="flex items-center gap-3 text-[14px] text-[var(--color-ink2)]">
                <Camera size={16} className="text-red-400" /> Awkward posing
              </li>
            </ul>
          </div>

          {/* Right: The PicFOMO Way */}
          <div className="flex-1 p-8 bg-[var(--color-ink)] text-white flex flex-col justify-center relative overflow-hidden">
            {/* Subtle glow effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-gold)] opacity-10 blur-3xl rounded-full"></div>
            
            <h3 className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[2px] text-[var(--color-gold)] mb-6">PicFOMO</h3>
            <ul className="space-y-4 relative z-10">
              <li className="flex items-center gap-3 text-[15px] text-white font-medium">
                <Check size={18} className="text-[var(--color-gold)]" /> $0 to start
              </li>
              <li className="flex items-center gap-3 text-[15px] text-white font-medium">
                <Zap size={18} className="text-[var(--color-gold)]" /> Ready in 20 seconds
              </li>
              <li className="flex items-center gap-3 text-[15px] text-white font-medium">
                {/* 🌟 FIX: Applied the aliased component here */}
                <InfinityIcon size={18} className="text-[var(--color-gold)]" /> Infinite outfits & worlds
              </li>
              <li className="flex items-center gap-3 text-[15px] text-white font-medium">
                <Smartphone size={18} className="text-[var(--color-gold)]" /> Done from your bed
              </li>
            </ul>
          </div>
        </div>

        {/* =========================================
            BOX 2: STATUS ELEVATION (Span 1 col, 2 rows)
            ========================================= */}
        <div className="md:col-span-1 md:row-span-2 rounded-2xl border border-[var(--rule)] bg-[var(--color-cream)] shadow-[var(--shadow-sm)] overflow-hidden flex flex-col relative group">
          <div className="p-6 relative z-20 bg-gradient-to-b from-[var(--color-cream)] via-[var(--color-cream)] to-transparent pb-10">
            <h3 className="font-[family-name:var(--display)] text-[22px] tracking-[1px] text-[var(--color-ink)] mb-2">Algorithm Ready</h3>
            <p className="text-[13px] text-[var(--color-ink3)] leading-relaxed">Instantly upgrade your LinkedIn, Instagram, and dating profiles.</p>
          </div>

          {/* Vertical Auto-Scrolling Social Feed */}
          <div className="relative flex-1 overflow-hidden -mt-4 px-6 mask-vertical-fade">
            <motion.div 
              animate={{ y: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
              className="flex flex-col gap-4 pb-4"
            >
              {/* Duplicate the items to create a seamless infinite loop */}
              {[1, 2].map((loop) => (
                <div key={loop} className="flex flex-col gap-4">
                  
                  {/* Fake LinkedIn Card */}
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-[var(--rule)]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">IN</div>
                      <div>
                        <div className="text-[10px] font-bold">New Profile Photo</div>
                        <div className="text-[8px] text-gray-400">1h • 🌐</div>
                      </div>
                    </div>
                    <div className="w-full h-32 bg-gray-200 rounded-md mb-2 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="https://pub-ad6276faad1f4954ad679b43ef8c4afd.r2.dev/1775308557046-canqft.png" className="w-full h-full object-cover object-top" alt="Pro" />
                    </div>
                    <div className="text-[9px] text-gray-500 flex gap-3">
                      <span className="flex items-center gap-1"><Heart size={10}/> 412</span>
                      <span className="flex items-center gap-1"><MessageCircle size={10}/> 28</span>
                    </div>
                  </div>

                  {/* Fake IG Card */}
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-[var(--rule)]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-[1.5px]">
                        <div className="w-full h-full bg-white rounded-full"></div>
                      </div>
                      <div className="text-[10px] font-bold">your_username</div>
                    </div>
                    <div className="w-full h-32 bg-gray-200 rounded-md mb-2 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="https://pub-ad6276faad1f4954ad679b43ef8c4afd.r2.dev/Gemini_Generated_Image_7jfy047jfy047jfy.png" className="w-full h-full object-cover" alt="Casual" />
                    </div>
                    <div className="text-[9px] text-gray-500 flex gap-3">
                      <span className="flex items-center gap-1 text-red-500"><Heart size={10} className="fill-red-500"/> 1,843</span>
                      <span className="flex items-center gap-1"><MessageCircle size={10}/> 156</span>
                    </div>
                  </div>

                </div>
              ))}
            </motion.div>
          </div>
          
          {/* Bottom Fade Mask */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--color-cream)] to-transparent z-10"></div>
        </div>

        {/* =========================================
            BOX 3: ZERO EFFORT (Span 1 col, 1 row)
            ========================================= */}
        <div className="rounded-2xl border border-[var(--rule)] bg-white shadow-[var(--shadow-sm)] p-6 md:p-8 flex flex-col justify-between group transition-shadow hover:shadow-[var(--shadow-md)]">
          <div>
            <h3 className="font-[family-name:var(--display)] text-[22px] tracking-[1px] text-[var(--color-ink)] mb-2">Zero Friction</h3>
            <p className="text-[13px] text-[var(--color-ink3)]">No complex prompt engineering required. Just click and go.</p>
          </div>
          
          <div className="mt-6 flex items-center justify-center h-full">
            <div className="relative w-full max-w-[200px]">
              <div className="absolute inset-0 bg-[var(--color-gold)] blur-xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
              <button className="relative w-full bg-[var(--color-ink)] text-[var(--color-gold-light)] font-[family-name:var(--display)] tracking-[2px] py-4 rounded-xl shadow-xl flex items-center justify-center gap-2 transition-transform group-hover:scale-105">
                <Sparkles size={16} /> GENERATE
              </button>
            </div>
          </div>
        </div>

        {/* =========================================
            BOX 4: ALWAYS FRESH (Span 1 col, 1 row)
            ========================================= */}
        <div className="rounded-2xl border border-[var(--rule)] bg-[var(--color-ink)] text-white shadow-[var(--shadow-sm)] p-6 md:p-8 flex flex-col justify-between group transition-shadow hover:shadow-[var(--shadow-md)] relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-[family-name:var(--display)] text-[22px] tracking-[1px] text-[var(--color-gold)] mb-2">Always Fresh</h3>
            <p className="text-[13px] text-gray-300">New premium aesthetics drop every single week. Never miss a trend.</p>
          </div>
          
          <div className="mt-6 flex items-end gap-2 relative z-10">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full text-[10px] font-[family-name:var(--mono)] uppercase tracking-[1px]">Ghibli</div>
            <div className="bg-[var(--color-gold)] text-black px-3 py-1.5 rounded-full text-[10px] font-bold font-[family-name:var(--mono)] uppercase tracking-[1px] shadow-[0_0_15px_rgba(250,204,21,0.4)] animate-pulse">New Drop 🔥</div>
          </div>

          {/* Background decor */}
          <Calendar size={120} className="absolute -bottom-6 -right-6 text-white/5 group-hover:text-white/10 transition-colors transform -rotate-12" />
        </div>

      </div>

      <style jsx>{`
        .mask-vertical-fade {
          mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
    </section>
  );
}