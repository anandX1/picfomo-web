import { Star, Sparkles, ShieldCheck, Zap } from "lucide-react";

export default function TrustBar() {
  // 🌟 Sleek, icon-driven items replacing the old emojis
  const TrustItems = (
    <>
      <div className="flex items-center gap-2 text-[11px] font-[family-name:var(--mono)] uppercase tracking-[1.5px] text-[var(--color-ink2)]">
        <Star size={14} className="text-[var(--color-gold)]" /> 4.9/5 Average Rating
      </div>
      <div className="h-1 w-1 rounded-full bg-[var(--rule)] mx-2"></div>
      
      <div className="flex items-center gap-2 text-[11px] font-[family-name:var(--mono)] uppercase tracking-[1.5px] text-[var(--color-ink2)]">
        <Sparkles size={14} className="text-[var(--color-gold)]" /> 2.3M+ Portraits Created
      </div>
      <div className="h-1 w-1 rounded-full bg-[var(--rule)] mx-2"></div>
      
      <div className="flex items-center gap-2 text-[11px] font-[family-name:var(--mono)] uppercase tracking-[1.5px] text-[var(--color-ink2)]">
        <ShieldCheck size={14} className="text-[var(--color-gold)]" /> Auto-Deleted in 24H
      </div>
      <div className="h-1 w-1 rounded-full bg-[var(--rule)] mx-2"></div>
      
      <div className="flex items-center gap-2 text-[11px] font-[family-name:var(--mono)] uppercase tracking-[1.5px] text-[var(--color-ink2)]">
        <Zap size={14} className="text-[var(--color-gold)]" /> Results in ~20 Seconds
      </div>
      <div className="h-1 w-1 rounded-full bg-[var(--rule)] mx-2"></div>
    </>
  );

  return (
    // 🌟 Blends into the page background with a subtle border
    <div className="relative w-full border-b border-[var(--rule)] bg-[var(--color-white)] overflow-hidden py-3.5">
      
      {/* 🌟 Fade Masks: Makes the text smoothly disappear at the edges of the screen */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 md:w-24 bg-gradient-to-r from-[var(--color-white)] to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 md:w-24 bg-gradient-to-l from-[var(--color-white)] to-transparent"></div>

      {/* Infinite Scroll Track */}
      <div className="flex w-max animate-scroll-left items-center gap-4 px-4 hover:[animation-play-state:paused]">
        {TrustItems}
        {TrustItems}
        {TrustItems}
        {TrustItems}
      </div>
    </div>
  );
}