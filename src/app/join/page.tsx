import { Metadata } from "next";
import { Suspense } from "react";
import { Loader2, Sparkles } from "lucide-react";
import JoinTrackerClient from "./JoinTrackerClient";

// 🌟 SEO BOOST 1: CANONICAL URL & VIRAL SOCIAL GRAPH
// This ensures that when 1,000 users share 1,000 different ?ref= links, 
// Google only indexes the single master /join page, saving your crawl budget.
export const metadata: Metadata = {
  title: "You've been invited to PicFOMO! ✨",
  description: "Accept your invite to claim 55 free Sparks. Drop your photo, pick a trending style, and generate stunning AI portraits instantly.",
  alternates: {
    canonical: "https://www.picfomo.com/join",
  },
  openGraph: {
    title: "You've been invited to PicFOMO! ✨",
    description: "Accept your invite to claim 55 free Sparks. Drop your photo, pick a trending style, and generate stunning AI portraits instantly.",
    url: "https://www.picfomo.com/join",
    type: "website",
    siteName: "PicFOMO",
  },
  twitter: {
    card: "summary_large_image",
    title: "You've been invited to PicFOMO! ✨",
    description: "Accept your invite to claim 55 free Sparks.",
  }
};

export default function JoinPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-cream)] relative overflow-hidden">
      
      {/* Subtle Premium Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[400px] h-[400px] bg-[var(--color-gold)] opacity-10 blur-[100px] rounded-full animate-pulse"></div>
      </div>

      <div className="flex flex-col items-center gap-5 relative z-10 p-8 bg-[var(--color-white)] rounded-3xl shadow-xl border border-[var(--rule)]">
        <div className="h-16 w-16 bg-[var(--color-ink)] rounded-2xl shadow-inner flex items-center justify-center border border-[var(--color-gold-border)]">
          <Sparkles className="text-[var(--color-gold)]" size={32} />
        </div>
        
        <div className="text-center">
          <h1 className="font-[family-name:var(--display)] text-2xl text-[var(--color-ink)] mb-2">Claiming Invite...</h1>
          <p className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-widest text-[var(--color-ink3)] flex items-center justify-center gap-2">
            <Loader2 className="animate-spin text-[var(--color-gold)]" size={14} />
            Redirecting to Studio
          </p>
        </div>
      </div>

      {/* The invisible client component that handles local storage and routing */}
      <Suspense fallback={null}>
        <JoinTrackerClient />
      </Suspense>
    </div>
  );
}