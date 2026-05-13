"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    q: "Is this tool completely free to use?",
    a: "Absolutely. PicFOMO offers free daily generations, and there are zero ads. We built it to help you nail the perfect profile picture every single time."
  },
  {
    q: "Are my photos safe and private?",
    a: "100%. We never track, store, or collect face data. All uploaded photos are automatically deleted immediately after processing — no exceptions."
  },
  {
    q: "What photo formats are supported?",
    a: "We support all major photo formats — .jpg, .jpeg, .png, .webp, and .heic. If you're shooting on any modern device or camera, you're covered."
  },
  {
    q: "How does the AI generate styles while keeping my face?",
    a: "Our proprietary Identity-Lock™ engine extracts your unique facial geometry before applying any style. This means the aesthetic changes completely — Studio Ghibli, Cyberpunk, Old Money — but your face stays unmistakably you."
  },
  {
    q: "What makes a good photo for the best results?",
    a: "For the best output: use a front-facing photo with good lighting, a simple background, and no heavy filters. The cleaner the input, the more stunning the result."
  },
  {
    q: "Where can I use my generated profile pictures?",
    a: "Everywhere. LinkedIn, Twitter/X, Instagram, Discord, Slack, WhatsApp, your CV, personal website — any platform where first impressions matter. The outputs are high-resolution and ready to drop in."
  },
  {
    q: "What are Sparks?",
    a: "⚡ Sparks are our in-app currency for generating new styles. You earn Sparks every time another creator remixes one of your published looks. The more your style gets shared, the more you generate — for free."
  }
];

function FAQItem({ item, index, isOpen, onToggle }: { item: any; index: number; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className={`faq-item bg-[#111111] border ${isOpen ? 'border-[rgba(212,175,55,0.3)]' : 'border-white/5'} rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/10`}>
      <button 
        onClick={onToggle}
        className="faq-trigger w-full flex items-center justify-between gap-4 p-6 md:p-7 text-left group"
      >
        <span className="flex items-center gap-4">
          <span className={`text-[var(--gold)] font-black text-xs tracking-widest transition w-6 shrink-0 ${isOpen ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
            0{index + 1}
          </span>
          <span className="text-white font-semibold text-base leading-snug">{item.q}</span>
        </span>
        <span className={`faq-icon shrink-0 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 transition-all duration-300 ${isOpen ? 'border-[var(--gold)] text-[var(--gold)] rotate-180' : ''}`}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
        </span>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-gray-400 leading-relaxed text-sm pb-7 px-7 pl-[4.5rem]">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function NewFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-[#0A0A0A] py-32 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <p className="text-[var(--gold)] text-xs font-bold uppercase tracking-[0.3em] mb-4">Got Questions?</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5 display-font text-white">Frequently Asked <span className="text-[var(--gold)]">Questions</span></h2>
        </div>
        
        <div className="flex flex-col gap-4">
          {FAQS.map((faq, i) => (
            <FAQItem 
              key={i} 
              item={faq} 
              index={i} 
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
