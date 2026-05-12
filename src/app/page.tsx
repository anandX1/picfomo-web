"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MacDock from "@/components/marketing/MacDock";
import NewHero from "@/components/marketing/NewHero";
import IdentityFlow from "@/components/marketing/IdentityFlow";
import NewTimeline from "@/components/marketing/NewTimeline";
import OrganicCarousel from "@/components/marketing/OrganicCarousel";
import NewFAQ from "@/components/marketing/NewFAQ";
import NewPricing from "@/components/marketing/NewPricing";
import NewFooter from "@/components/marketing/NewFooter";
import NewFeed from "@/components/marketing/NewFeed";

export default function Home() {
  const [activePage, setActivePage] = useState("home");
  const [mounted, setMounted] = useState(false);

  // 🌟 SEO BOOST: JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.picfomo.com/#website",
        "url": "https://www.picfomo.com/",
        "name": "PicFOMO",
        "description": "Your Best DP is 20 Seconds Away. Drop your photo, pick a trending style.",
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://www.picfomo.com/explore?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "Organization",
        "@id": "https://www.picfomo.com/#organization",
        "name": "PicFOMO",
        "url": "https://www.picfomo.com/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.picfomo.com/logo2.png"
        },
        "sameAs": [
          "https://twitter.com/picfomo",
          "https://instagram.com/picfomo"
        ]
      }
    ]
  };

  useEffect(() => {
    setMounted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activePage]);

  if (!mounted) return null;

  return (
    <div className="bg-[#030303] text-white min-h-screen selection:bg-[var(--color-gold)] selection:text-black">
      {/* 🌟 SEO JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 🌟 TOP NAVIGATION BAR */}
      <header className="fixed top-0 left-0 right-0 z-[150] px-6 py-8 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto cursor-pointer" onClick={() => setActivePage('home')}>
          <div className="w-9 h-9 bg-[var(--color-gold)] rounded-full flex items-center justify-center font-bold text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]">P</div>
          <span className="text-xl font-bold tracking-tight display-font">picfomo<span className="text-[var(--color-gold)]">.com</span></span>
        </div>
        
        <div className="pointer-events-auto flex items-center gap-4">
           <button className="text-xs font-bold text-gray-400 hover:text-white transition uppercase tracking-widest hidden md:block">Login</button>
           <button className="bg-white/5 border border-white/10 px-5 py-2 rounded-lg text-xs font-bold hover:bg-white/10 transition backdrop-blur-md">Try Free</button>
        </div>
      </header>

      {/* 🌟 PAGE CONTENT */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {activePage === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <NewHero />
              <IdentityFlow />
              <OrganicCarousel />
              <NewTimeline />
              <NewFAQ />
              <NewFooter setActivePage={setActivePage} />
            </motion.div>
          )}

          {activePage === "feed" && (
            <motion.div
              key="feed"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5 }}
              className="pt-24"
            >
              <NewFeed />
              <NewFooter setActivePage={setActivePage} />
            </motion.div>
          )}

          {activePage === "pricing" && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-24"
            >
              <NewPricing />
              <NewFAQ />
              <NewFooter setActivePage={setActivePage} />
            </motion.div>
          )}
          
          {(activePage === "login" || activePage === "upload") && (
             <motion.div
                key="redirect"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pt-24 flex items-center justify-center min-h-screen"
             >
                <div className="text-center">
                   <h2 className="text-2xl font-bold mb-4">Redirecting to Authentication...</h2>
                   <button onClick={() => setActivePage('home')} className="text-[var(--color-gold)] font-bold">Go Back</button>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 🌟 FLOATING MAC DOCK */}
      <MacDock activePage={activePage} setActivePage={setActivePage} />
      
      {/* 🌟 GLOBAL BACKGROUND GRAIN */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
