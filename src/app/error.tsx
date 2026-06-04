"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console for debugging — Cloudflare workers logs will capture this
    console.error("PicFOMO Runtime Error:", error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#030303] overflow-hidden px-6">
      
      {/* Ambient red/gold glow for error context */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse 50% 35% at 50% 55%, rgba(239,68,68,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">

        {/* Icon */}
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>

        {/* Status badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-400">
            Something went wrong
          </span>
        </div>

        <h1 className="display-font mb-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          A glitch in the matrix.
        </h1>

        <p className="mb-10 text-base leading-relaxed text-white/50">
          An unexpected error occurred. Our team has been notified.
          Try refreshing the page — most errors are temporary.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <button
            onClick={reset}
            className="fluid-btn fluid-btn-gold rounded-xl px-8 py-3 text-sm font-bold uppercase tracking-widest shadow-xl"
          >
            <span className="fluid-btn-bg" />
            <span className="fluid-text-wrapper">
              <span className="fluid-text fluid-text-top">Try Again</span>
              <span className="fluid-text fluid-text-bottom">Try Again</span>
            </span>
          </button>

          <Link
            href="/"
            className="text-sm font-semibold text-white/40 transition-colors hover:text-white"
          >
            ← Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
