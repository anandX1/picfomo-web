"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/marketing/Navbar";
import NewHero from "@/components/marketing/NewHero";
import NewTimeline from "@/components/marketing/NewTimeline";
import NewPricing from "@/components/marketing/NewPricing";
import NewFAQ from "@/components/marketing/NewFAQ";
import NewFooter from "@/components/marketing/NewFooter";

export default function MarketingClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={`bg-[#050508] text-white min-h-screen selection:bg-[#FF4F81] selection:text-white transition-opacity duration-500 overflow-x-hidden ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <Navbar />

      <main className="relative z-10 w-full">
        <NewHero />
        <NewTimeline />
        <NewPricing />
        <NewFAQ />
      </main>

      <NewFooter />
    </div>
  );
}
