import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found — 404",
  description: "The page you're looking for doesn't exist. Return to PicFOMO and create your AI portrait.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#030303] overflow-hidden px-6">
      
      {/* Ambient gold glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 60%, rgba(212,175,55,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Grain texture */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        
        {/* 404 Number */}
        <div
          className="display-font mb-4 text-[10rem] font-extrabold leading-none tracking-tighter select-none"
          style={{
            color: "transparent",
            WebkitTextStroke: "1px rgba(212,175,55,0.3)",
            textShadow: "0 0 80px rgba(212,175,55,0.1)",
          }}
        >
          404
        </div>

        {/* Status badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)] animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">
            Page Not Found
          </span>
        </div>

        {/* Heading */}
        <h1 className="display-font mb-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          This look doesn&apos;t exist.
        </h1>

        {/* Sub text */}
        <p className="mb-10 text-base leading-relaxed text-white/50">
          The page you&apos;re searching for has moved, been deleted, or never existed.
          Let&apos;s get you back to creating something stunning.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="fluid-btn fluid-btn-gold rounded-xl px-8 py-3 text-sm font-bold uppercase tracking-widest shadow-xl"
          >
            <span className="fluid-btn-bg" />
            <span className="fluid-text-wrapper">
              <span className="fluid-text fluid-text-top">← Back to Home</span>
              <span className="fluid-text fluid-text-bottom">← Back to Home</span>
            </span>
          </Link>

          <Link
            href="/explore"
            className="text-sm font-semibold text-white/40 transition-colors hover:text-white"
          >
            Browse the Feed →
          </Link>
        </div>
      </div>
    </div>
  );
}
