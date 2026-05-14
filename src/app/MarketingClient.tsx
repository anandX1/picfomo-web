"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import NewHero from "@/components/marketing/NewHero";
import SmoothScroll from "@/components/marketing/SmoothScroll";
import Navbar from "@/components/marketing/Navbar";

// 🌟 LAZY LOADED COMPONENTS (Below the fold)
const IdentityFlow = dynamic(() => import("@/components/marketing/IdentityFlow"), { ssr: true });
const OrganicCarousel = dynamic(() => import("@/components/marketing/OrganicCarousel"), { ssr: true });
const NewTimeline = dynamic(() => import("@/components/marketing/NewTimeline"), { ssr: true });
const NewFAQ = dynamic(() => import("@/components/marketing/NewFAQ"), { ssr: true });
const NewPricing = dynamic(() => import("@/components/marketing/NewPricing"), { ssr: true });
const NewFooter = dynamic(() => import("@/components/marketing/NewFooter"), { ssr: true });
const NewFeed = dynamic(() => import("@/components/marketing/NewFeed"), { ssr: true });

export default function MarketingClient({ dynamicStyles }: { dynamicStyles: any[] }) {
  const [activePage, setActivePage] = useState("home");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only scroll to top if we're changing sub-pages, not on initial mount
    if (mounted) {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activePage, mounted]);

  return (
    <div className={`bg-black text-white min-h-svh selection:bg-[var(--color-gold)] selection:text-black transition-opacity duration-700 overflow-x-hidden ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* 🌟 PREMIUM SMOOTH SCROLL (LENIS) */}
      <SmoothScroll />

      {/* 🌟 THE NEW GLASSMORPHISM NAVBAR */}
      {/* This replaces the old broken floating logo and adds the navigation links */}
      <Navbar />

      {/* 🌟 PAGE CONTENT (Strict Containment) */}
      <main className="relative z-10 w-full">
        <AnimatePresence mode="wait">
          {activePage === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <NewHero dynamicStyles={dynamicStyles} />
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="pt-[100px] md:pt-[120px]"
            >
              <NewFeed />
              <NewFooter setActivePage={setActivePage} />
            </motion.div>
          )}

          {activePage === "pricing" && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="pt-[100px] md:pt-[120px]"
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
                className="pt-32 md:pt-40 flex items-center justify-center min-h-[70vh]"
             >
                <div className="text-center">
                   <h2 className="text-xl font-bold mb-4 uppercase tracking-widest text-gray-500">Redirecting to Auth...</h2>
                   <button onClick={() => setActivePage('home')} className="text-[var(--color-gold)] font-black uppercase tracking-[0.2em] text-xs">← Go Back</button>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* 🌟 GLOBAL BACKGROUND GRAIN */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
