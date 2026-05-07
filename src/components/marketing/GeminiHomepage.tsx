"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type DockKey = "home" | "feed" | "pricing";

const UNSPLASH = {
  dslr: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80&auto=format&fit=crop",
  ghibli:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80&auto=format&fit=crop",
  cyberpunk:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80&auto=format&fit=crop",
  vogue: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80&auto=format&fit=crop",
  base: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=800&auto=format&fit=crop&q=80",
} as const;

export default function GeminiHomepage() {
  const [dockActive, setDockActive] = useState<DockKey>("home");
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const [dropzoneTitle, setDropzoneTitle] = useState("Upload a selfie");
  const [dropzoneDesc, setDropzoneDesc] = useState("Drag & drop your photo here, or browse.");

  const rootRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const identityRef = useRef<HTMLElement | null>(null);
  const timelineRef = useRef<HTMLElement | null>(null);
  const timelineProgressRef = useRef<HTMLDivElement | null>(null);

  const sections = useMemo(
    () => ({
      home: "hero-section",
      feed: "creator-feed",
      pricing: "pricing-section",
    }),
    []
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onScroll = () => {
      const hero = heroRef.current;
      if (dockActive !== "home" || !hero) {
        setIsStickyVisible(false);
        return;
      }
      const threshold = hero.offsetHeight * 0.8;
      setIsStickyVisible(window.scrollY > threshold);

      // Timeline progress line (desktop only)
      const timeline = timelineRef.current;
      const progressLine = timelineProgressRef.current;
      if (!timeline || !progressLine) return;
      const rect = timeline.getBoundingClientRect();
      const windowMid = window.innerHeight / 2;
      let scrolled = windowMid - rect.top;
      let pct = (scrolled / rect.height) * 100;
      pct = Math.max(0, Math.min(100, pct));
      progressLine.style.height = `${pct}%`;
    };

    const onResize = () => onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [dockActive]);

  // Intersection animations for timeline steps
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const steps = Array.from(root.querySelectorAll<HTMLElement>(".timeline-step"));
    if (!steps.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) (e.target as HTMLElement).classList.add("active");
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -10% 0px" }
    );

    steps.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  // Identity arrow "draw" effect
  useEffect(() => {
    const section = identityRef.current;
    if (!section) return;
    const paths = Array.from(section.querySelectorAll<SVGPathElement>(".flow-arrow-path"));
    if (!paths.length) return;

    const lengths = paths.map((p) => {
      try {
        const L = p.getTotalLength();
        p.style.strokeDasharray = String(L);
        p.style.strokeDashoffset = String(L);
        return L;
      } catch {
        return 0;
      }
    });

    let rafId: number | null = null;
    const progressForSection = () => {
      const r = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const anchor = r.top + r.height * 0.3;
      const start = vh * 0.9;
      const end = vh * 0.3;
      const t = (start - anchor) / (start - end);
      return Math.max(0, Math.min(1, t));
    };

    const tick = () => {
      rafId = null;
      const p = progressForSection();
      paths.forEach((path, i) => {
        const len = lengths[i];
        if (!len) return;
        const stagger = i === 0 ? p : Math.max(0, Math.min(1, (p - 0.12) / 0.85));
        const ease = stagger * stagger * (3 - 2 * stagger);
        path.style.strokeDashoffset = String(len * (1 - ease));
      });
    };

    const onScroll = () => {
      if (rafId == null) rafId = window.requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    tick();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId != null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  // Dock hover physics (closest-item magnify)
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const dock = rootRef.current?.querySelector<HTMLElement>("#mac-dock");
    if (!dock) return;
    const items = Array.from(dock.querySelectorAll<HTMLElement>(".dock-item"));
    const influence = 160;

    const onMove = (e: MouseEvent) => {
      let closest: HTMLElement | null = null;
      let closestDist = Infinity;
      for (const item of items) {
        const rect = item.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const distance = Math.abs(e.clientX - centerX);
        if (distance < closestDist) {
          closestDist = distance;
          closest = item;
        }
      }

      for (const item of items) {
        const icon = item.querySelector<HTMLElement>(".dock-icon");
        if (!icon) continue;
        if (item !== closest || closestDist >= influence) {
          icon.style.transform = "";
          icon.style.boxShadow = "";
          continue;
        }
        const normalized = 1 - closestDist / influence;
        const scale = 1 + (1.32 - 1) * Math.sin((normalized * Math.PI) / 2);
        const lift = (scale - 1) * -10;
        icon.style.transform = `translate3d(0, ${lift}px, 0) scale(${scale})`;
        icon.style.boxShadow = `0 14px 28px rgba(0,0,0,0.65), 0 0 ${18 + (scale - 1) * 30}px rgba(212,175,55,0.18)`;
      }
    };

    const onLeave = () => {
      for (const item of items) {
        const icon = item.querySelector<HTMLElement>(".dock-icon");
        if (!icon) continue;
        icon.style.transform = "";
        icon.style.boxShadow = "";
      }
    };

    dock.addEventListener("mousemove", onMove);
    dock.addEventListener("mouseleave", onLeave);
    return () => {
      dock.removeEventListener("mousemove", onMove);
      dock.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Global drag UI (for the dropzone copy + glow)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let dragTimer: number | undefined;

    const setDragging = (isDragging: boolean) => {
      if (!rootRef.current) return;
      rootRef.current.classList.toggle("is-dragging-file", isDragging);
    };

    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (dockActive !== "home") return;
      setDragging(true);
      setDropzoneTitle("Drop it like it's hot!");
      setDropzoneDesc("Release to start the magic...");
      if (dragTimer) window.clearTimeout(dragTimer);
    };

    const onDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragTimer = window.setTimeout(() => {
        setDragging(false);
        setDropzoneTitle("Upload a selfie");
        setDropzoneDesc("Drag & drop your photo here, or browse.");
      }, 100);
    };

    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (dockActive !== "home") return;
      setDropzoneTitle("Processing Magic...");
      setDropzoneDesc("Analyzing facial geometry...");
      window.setTimeout(() => {
        setDropzoneTitle("Upload a selfie");
        setDropzoneDesc("Drag & drop your photo here, or browse.");
      }, 1200);
    };

    window.addEventListener("dragover", onDragOver);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onDrop);

    return () => {
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("drop", onDrop);
      if (dragTimer) window.clearTimeout(dragTimer);
    };
  }, [dockActive]);

  const navigateTo = (key: DockKey) => {
    setDockActive(key);
    const el = document.getElementById(sections[key]);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={rootRef} className="gemini-home">
      <style jsx global>{`
        .gemini-home {
          --bg-color: #030303;
          --surface-color: #0a0a0a;
          --card-color: #111111;
          --gold: #d4af37;
          --gold-glow: rgba(212, 175, 55, 0.8);
          background: radial-gradient(circle at top, #151515 0%, var(--bg-color) 100%);
          color: #fff;
          overflow-x: hidden;
        }
        .gemini-home h1,
        .gemini-home h2,
        .gemini-home h3,
        .gemini-home h4,
        .gemini-home .display-font {
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Inter,
            Arial, sans-serif;
          letter-spacing: -0.02em;
        }
        .gemini-home p {
          letter-spacing: -0.01em;
        }
        .gemini-home .type-lead {
          font-size: clamp(1.05rem, 0.9rem + 0.4vw, 1.2rem);
          line-height: 1.7;
        }
        .gemini-home .type-h1 {
          font-size: clamp(2.7rem, 2.2rem + 2.1vw, 4.6rem);
          line-height: 1.03;
        }
        .gemini-home .type-h2 {
          font-size: clamp(2rem, 1.6rem + 1.1vw, 3.1rem);
          line-height: 1.1;
        }
        .gemini-home .type-kicker {
          letter-spacing: 0.16em;
        }
        .gemini-home .text-balance {
          text-wrap: balance;
        }
        .gemini-home .bg-gold {
          background-color: var(--gold);
        }
        .gemini-home .text-gold {
          color: var(--gold);
        }
        .gemini-home .border-gold {
          border-color: var(--gold);
        }

        /* Brand gold glow surfaces */
        .gemini-home .brand-gold-glow {
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }
        @keyframes liquidDrift {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-2%, 1%, 0) scale(1.03);
          }
          100% {
            transform: translate3d(2%, -1%, 0) scale(1.02);
          }
        }
        .gemini-home .brand-gold-glow::before {
          content: "";
          position: absolute;
          inset: -20%;
          z-index: 0;
          pointer-events: none;
          background: radial-gradient(50% 56% at 18% 86%, rgba(212, 175, 55, 0.22) 0%, rgba(212, 175, 55, 0) 64%),
            radial-gradient(56% 63% at 50% 74%, rgba(180, 148, 42, 0.16) 0%, rgba(180, 148, 42, 0) 66%),
            radial-gradient(60% 66% at 82% 12%, rgba(140, 112, 34, 0.14) 0%, rgba(140, 112, 34, 0) 66%);
          filter: blur(48px);
          opacity: 0.82;
          transform: translateZ(0);
          animation: liquidDrift 14s ease-in-out infinite alternate;
        }
        .gemini-home .brand-gold-glow::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.09;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        .gemini-home .brand-gold-glow > * {
          position: relative;
          z-index: 1;
        }
        .gemini-home .brand-gold-glow--section {
          background: radial-gradient(120% 100% at 50% 0%, rgba(8, 8, 8, 0.32) 0%, rgba(8, 8, 8, 0.82) 46%, #070707 78%, #050505 100%),
            #050505;
        }
        .gemini-home .brand-gold-glow--section::before {
          background: radial-gradient(42% 40% at 50% 2%, rgba(255, 220, 90, 0.78) 0%, rgba(255, 214, 74, 0.35) 38%, rgba(255, 214, 74, 0) 64%),
            radial-gradient(34% 32% at 50% 8%, rgba(255, 236, 160, 0.52) 0%, rgba(255, 236, 160, 0) 66%),
            radial-gradient(95% 70% at 50% -2%, rgba(212, 175, 55, 0.22) 0%, rgba(212, 175, 55, 0) 56%);
          filter: blur(40px);
          opacity: 0.92;
          animation: liquidDrift 16s ease-in-out infinite alternate;
        }

        /* Timeline + cards */
        .gemini-home .timeline-step {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .gemini-home .timeline-step.active {
          opacity: 1;
          transform: translateY(0);
        }
        .gemini-home .timeline-node {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background-color: #111;
          border: 3px solid rgba(255, 255, 255, 0.2);
          z-index: 20;
          transition: all 0.5s ease;
        }
        .gemini-home .timeline-step.active .timeline-node {
          border-color: var(--gold);
          background-color: var(--gold);
          box-shadow: 0 0 20px var(--gold-glow);
        }
        .gemini-home .step-card {
          background-color: var(--card-color);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 1.5rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          padding: 1.5rem;
          position: relative;
        }
        .gemini-home .step-label {
          background-color: #1a1a1a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 0.5rem 1rem;
          position: absolute;
          top: -1rem;
          left: 2rem;
          z-index: 20;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }
        .gemini-home .fluid-btn {
          position: relative;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease,
            border-color 0.4s ease;
          cursor: pointer;
          z-index: 1;
          user-select: none;
        }
        .gemini-home .fluid-btn:hover {
          transform: scale(1.04);
        }
        .gemini-home .fluid-btn-bg {
          position: absolute;
          inset: 0;
          z-index: -1;
          border-radius: inherit;
          transform: translateY(100%);
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .gemini-home .fluid-btn:hover .fluid-btn-bg {
          transform: translateY(0);
        }
        .gemini-home .fluid-text-wrapper {
          display: grid;
          position: relative;
          overflow: hidden;
        }
        .gemini-home .fluid-text {
          grid-area: 1 / 1;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          white-space: nowrap;
        }
        .gemini-home .fluid-text-bottom {
          transform: translateY(120%);
        }
        .gemini-home .fluid-btn:hover .fluid-text-top {
          transform: translateY(-120%);
        }
        .gemini-home .fluid-btn:hover .fluid-text-bottom {
          transform: translateY(0);
        }
        .gemini-home .fluid-btn-gold {
          background-color: var(--gold);
          color: #000;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2);
        }
        .gemini-home .fluid-btn-gold:hover {
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.5);
        }
        .gemini-home .fluid-btn-gold .fluid-btn-bg {
          background-color: #fff;
        }
        .gemini-home .fluid-btn-gold .fluid-text-bottom {
          color: #000;
        }

        /* Dock */
        .gemini-home .mac-dock-wrapper {
          position: fixed;
          top: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 200;
        }
        .gemini-home .mac-dock {
          display: flex;
          align-items: flex-end;
          gap: 16px;
          padding: 10px 12px;
          background: rgba(12, 12, 12, 0.55);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }
        .gemini-home .dock-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          cursor: pointer;
          width: 62px;
          height: 62px;
          flex-shrink: 0;
        }
        .gemini-home .dock-icon {
          width: 100%;
          height: 100%;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
          color: #aaa;
          will-change: transform, box-shadow, border-color;
          transform: translateZ(0);
          transform-origin: 50% 100%;
        }
        .gemini-home .dock-item.brand .dock-icon {
          font-weight: 900;
          color: #fff;
        }
        .gemini-home .dock-item:hover .dock-icon {
          background: var(--gold);
          color: #000;
          border-color: rgba(255, 230, 128, 0.75);
          box-shadow: 0 14px 28px rgba(0, 0, 0, 0.65), 0 0 32px rgba(212, 175, 55, 0.35);
        }
        .gemini-home .dock-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: transparent;
          margin-top: 6px;
          transition: background 0.3s;
        }
        .gemini-home .dock-item.active .dock-dot {
          background: var(--gold);
          box-shadow: 0 0 8px var(--gold);
        }
        .gemini-home .dock-tooltip {
          position: absolute;
          top: -45px;
          background: rgba(10, 10, 10, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s, transform 0.2s;
          transform: translateY(10px) scale(0.9);
          white-space: nowrap;
          backdrop-filter: blur(5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
        }
        .gemini-home .dock-item:hover .dock-tooltip {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* Drag state */
        .gemini-home.is-dragging-file #dropzone-container {
          transform: scale(1.05);
          border-color: var(--gold);
          box-shadow: 0 0 80px rgba(212, 175, 55, 0.4);
          background-color: rgba(212, 175, 55, 0.05);
        }
      `}</style>

      {/* top brand (pointer-events-none like html) */}
      <div className="fixed left-0 top-0 z-[90] flex w-full items-start justify-between px-6 py-6 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="display-font text-xl font-extrabold tracking-tight text-white drop-shadow-lg">
            picfomo<span className="text-gold">.com</span>
          </span>
        </div>
      </div>

      {/* sticky CTA */}
      <div
        aria-hidden={!isStickyVisible}
        className={[
          "fixed bottom-6 left-1/2 z-[205] w-[calc(100%-1.5rem)] max-w-xl -translate-x-1/2 transition-all duration-500 ease-out sm:bottom-8 sm:max-w-2xl",
          isStickyVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <div className="flex items-center justify-center gap-3 rounded-full border border-white/10 bg-black/80 p-2 pl-4 pr-2 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:justify-start sm:gap-4 sm:pl-6">
          <span className="hidden whitespace-nowrap text-sm font-semibold text-white sm:block">
            Ready to remix your identity?
          </span>
          <button
            type="button"
            onClick={() => navigateTo("home")}
            className="fluid-btn fluid-btn-gold pointer-events-auto rounded-full px-6 py-2.5 text-sm font-extrabold"
          >
            <span className="fluid-btn-bg" />
            <span className="fluid-text-wrapper">
              <span className="fluid-text fluid-text-top">Upload Photo</span>
              <span className="fluid-text fluid-text-bottom">Upload Photo</span>
            </span>
          </button>
        </div>
      </div>

      <div className="flex min-h-screen flex-col pt-[120px] pb-[100px]">
        {/* HERO */}
        <main id="page-home" className="flex-1">
          <section
            id="hero-section"
            ref={(el) => {
              heroRef.current = el;
            }}
            className="relative flex min-h-[calc(100vh-140px)] w-full flex-col items-center justify-center overflow-hidden pb-16"
          >
            <div className="relative z-20 mb-10 px-6 text-center">
              <div className="type-kicker mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-extrabold uppercase text-gold backdrop-blur-md">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
                AI Portrait Studio + Creator Economy
              </div>
              <h1 className="display-font type-h1 text-balance mb-5 font-black">
                Identity‑Lock portraits.
                <br />
                One click. Viral aesthetics.
              </h1>
              <p className="type-lead text-balance mx-auto max-w-2xl text-gray-300/80">
                PicFOMO turns a single selfie into studio‑grade portraits in ~20 seconds—no prompts, no “uncanny
                valley.” Browse a live style feed, hit Generate, then Remix the exact aesthetic you love.
              </p>
            </div>

            <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col items-center justify-center gap-6 px-4 lg:flex-row lg:gap-12">
              {/* left flank */}
              <div className="hidden w-[260px] shrink-0 flex-col gap-6 lg:flex xl:w-[280px]">
                <FlankCard label="DSLR" img={UNSPLASH.dslr} className="rotate-[-8deg] translate-y-12 translate-x-4" />
                <FlankCard label="Ghibli" img={UNSPLASH.ghibli} className="rotate-[-3deg] -translate-x-6" />
              </div>

              {/* dropzone */}
              <div className="group relative w-full max-w-xl shrink-0 lg:max-w-[500px] xl:max-w-[550px]">
                <div className="dropzone-glow absolute -inset-1.5 rounded-[2.5rem] bg-gradient-to-r from-yellow-500 to-[var(--gold)] blur-xl opacity-0 transition duration-500 group-hover:opacity-40" />
                <div
                  id="dropzone-container"
                  className="relative flex min-h-[420px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[2rem] border-2 border-white/20 bg-[var(--surface-color)] p-8 shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-500 group-hover:border-gold group-hover:shadow-[0_0_60px_rgba(212,175,55,0.3)] md:p-12"
                  onClick={() => navigateTo("feed")}
                >
                  <div
                    id="dropzone-icon"
                    className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/30 bg-white text-black shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:scale-110 group-hover:border-gold group-hover:bg-gold group-hover:shadow-[0_0_40px_rgba(212,175,55,0.8)]"
                  >
                    <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <h3 id="dropzone-title" className="display-font mb-2 text-2xl font-black text-white transition-colors duration-500 group-hover:text-gold md:text-3xl">
                    {dropzoneTitle}
                  </h3>
                  <p id="dropzone-desc" className="mb-8 px-4 text-center text-sm text-gray-400">
                    {dropzoneDesc}
                  </p>
                  <div className="relative overflow-hidden rounded-xl border border-white/20 bg-white/10 px-8 py-3 text-sm font-extrabold text-white shadow-lg transition-all duration-500 group-hover:scale-105 group-hover:border-gold group-hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]">
                    <span className="absolute inset-0 z-[-1] translate-y-[100%] rounded-xl bg-gold transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
                    <span className="grid relative overflow-hidden">
                      <span className="col-start-1 row-start-1 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[120%]">
                        Select Photo
                      </span>
                      <span className="col-start-1 row-start-1 translate-y-[120%] text-black transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                        Select Photo
                      </span>
                    </span>
                  </div>
                  <div className="absolute bottom-6 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-gray-500 transition-colors duration-500 group-hover:text-gold">
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    No signup required
                  </div>
                </div>
              </div>

              {/* right flank */}
              <div className="hidden w-[260px] shrink-0 flex-col gap-6 lg:flex xl:w-[280px]">
                <FlankCard
                  label="Cyberpunk"
                  img={UNSPLASH.cyberpunk}
                  className="rotate-[8deg] translate-y-12 -translate-x-4"
                />
                <FlankCard label="Vogue" img={UNSPLASH.vogue} className="rotate-[3deg] translate-x-6" />
              </div>

              {/* mobile scroll */}
              <div className="hide-scroll mt-10 flex w-full gap-4 overflow-x-auto px-6 pb-6 lg:hidden snap-x snap-mandatory">
                <MobileThumb label="DSLR" img={UNSPLASH.dslr} />
                <MobileThumb label="Ghibli" img={UNSPLASH.ghibli} />
                <MobileThumb label="Cyberpunk" img={UNSPLASH.cyberpunk} />
              </div>
            </div>
          </section>

          {/* IDENTITY FLOW */}
          <section
            id="identity-flow-section"
            ref={(el) => {
              identityRef.current = el;
            }}
            className="brand-gold-glow brand-gold-glow--section border-y border-white/5 py-24"
          >
            <div className="mx-auto max-w-5xl px-6">
              <div className="mb-20 text-center">
                <h2 className="display-font type-h2 text-balance mb-4 font-black">Zero prompts. Your identity stays you.</h2>
                <p className="type-lead text-balance mx-auto max-w-2xl text-gray-100/80">
                  Our Identity‑Lock™ tech preserves your real facial structure, while styles change completely—from Ghibli
                  to Cyberpunk to DSLR realism.
                </p>
              </div>

              <div className="relative mt-8 flex flex-col items-center justify-center gap-16 md:flex-row md:gap-32">
                <div className="display-font relative z-10 text-center text-5xl font-black tracking-tight md:text-left md:text-6xl">
                  picfomo<span className="text-gold">.com</span>
                  <svg
                    className="flow-arrow pointer-events-none absolute -right-28 -top-24 hidden h-28 w-28 text-gray-500 md:block md:-right-32 md:h-32 md:w-32"
                    viewBox="0 0 100 100"
                    aria-hidden="true"
                  >
                    <path className="flow-arrow-path" d="M 90,10 C 50,10 20,40 10,80 L 0,70 M 10,80 L 20,70" />
                  </svg>
                  <svg
                    className="flow-arrow pointer-events-none absolute -right-28 -bottom-24 hidden h-28 w-28 text-gray-500 md:block md:-right-32 md:h-32 md:w-32"
                    viewBox="0 0 100 100"
                    aria-hidden="true"
                  >
                    <path className="flow-arrow-path" d="M 10,20 C 20,60 50,90 90,90 L 80,80 M 90,90 L 80,100" />
                  </svg>
                </div>

                <div className="z-10 flex flex-col gap-12 md:gap-16">
                  <div className="relative transition duration-300 hover:-translate-y-1">
                    <div className="absolute -left-4 top-1/2 z-20 -translate-y-1/2 rounded border border-gray-200 bg-white px-3 py-1.5 text-xs font-extrabold lowercase tracking-wider text-black md:-left-8">
                      input
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={UNSPLASH.base}
                        alt="Input selfie"
                        className="h-52 w-80 rounded-xl object-cover object-top grayscale-[20%] md:h-60 md:w-[26rem] lg:h-64 lg:w-[28rem]"
                      />
                    </div>
                  </div>

                  <div className="relative transition duration-300 hover:-translate-y-1 md:ml-12">
                    <div className="absolute -left-4 top-1/2 z-20 -translate-y-1/2 rounded border border-gold bg-gold px-3 py-1.5 text-xs font-extrabold lowercase tracking-wider text-black md:-left-8">
                      output
                    </div>
                    <div className="relative z-10 flex justify-center -space-x-7 pl-6 md:justify-start md:-space-x-8 md:pl-10">
                      {[
                        { border: "border-gold", cls: "" },
                        { border: "border-[#3b82f6]", cls: "saturate-[1.5] hue-rotate-[15deg]" },
                        { border: "border-[#ec4899]", cls: "contrast-[1.2]" },
                      ].map((v, idx) => (
                        <div
                          key={idx}
                          className={[
                            "relative h-28 w-28 overflow-hidden rounded-full border-4 shadow-xl md:h-36 md:w-36 lg:h-40 lg:w-40",
                            v.border,
                            idx === 0 ? "z-30" : idx === 1 ? "z-20" : "z-10",
                          ].join(" ")}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={UNSPLASH.base} alt="Output portrait" className={["h-full w-full object-cover object-top", v.cls].join(" ")} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* TIMELINE */}
          <section
            id="timeline-section"
            ref={(el) => {
              timelineRef.current = el;
            }}
            className="relative mx-auto flex max-w-5xl flex-col items-center px-6 py-32"
          >
            <div className="mb-24 text-center">
              <h2 className="display-font type-h2 text-balance mb-3 font-black">
                How <span className="text-gold">picfomo.com</span> works
              </h2>
              <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-gray-300/70">
                One selfie → any aesthetic → remix culture → Sparks
              </p>
            </div>

            <div className="relative flex w-full flex-col">
              <div className="absolute bottom-0 left-1/2 top-0 hidden w-[2px] -translate-x-1/2 bg-white/10 md:block" />
              <div
                id="timeline-line-progress"
                ref={timelineProgressRef}
                className="absolute left-1/2 top-0 hidden w-[2px] -translate-x-1/2 bg-gold shadow-[0_0_15px_rgba(212,175,55,0.8)] transition-all duration-100 md:block"
                style={{ height: "0%" }}
              />

              <TimelineStep side="left" label="1. Upload one selfie" cornerLabel="right">
                <div className="step-card min-h-[288px] w-full overflow-hidden md:aspect-[5/3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={UNSPLASH.base} alt="Upload" className="absolute inset-0 h-full w-full object-cover object-top" />
                  <div className="absolute right-4 top-4 z-10 w-40 rounded-md bg-white p-3 text-[10px] font-extrabold leading-snug text-black shadow-2xl">
                    Privacy-first: uploads are automatically deleted right after processing.
                  </div>
                </div>
              </TimelineStep>

              <TimelineStep side="right" label="2. Identity‑Lock™ Face Match">
                <div className="step-card bg-gold p-0 overflow-hidden min-h-[288px] w-full md:aspect-[5/3]">
                  <div className="absolute inset-0 flex">
                    <div className="flex w-[45%] flex-col justify-center bg-gold/90 px-6">
                      <p className="text-sm font-extrabold leading-snug text-black">
                        We map your facial structure so the output looks unmistakably like you—every time.
                      </p>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={UNSPLASH.base}
                      alt="Match"
                      className="h-full w-[55%] object-cover object-top border-l border-white/20"
                    />
                  </div>
                </div>
              </TimelineStep>

              <TimelineStep side="left" label="3. Pick a trending aesthetic" cornerLabel="right">
                <div className="step-card flex min-h-[288px] w-full flex-col items-center justify-center gap-4 md:aspect-[5/3] md:gap-6">
                  <div className="px-2 text-center">
                    <p className="text-balance text-sm leading-relaxed text-gray-300/80">
                      Browse the Studio. What you see is exactly what you get—no prompt engineering required.
                    </p>
                  </div>
                  <div className="relative flex justify-center -space-x-4">
                    {[
                      { border: "border-gold", cls: "" },
                      { border: "border-[#3b82f6]", cls: "saturate-[1.5] hue-rotate-[15deg]" },
                      { border: "border-[#ec4899]", cls: "contrast-[1.2]" },
                    ].map((v, idx) => (
                      <div key={idx} className={["h-20 w-20 overflow-hidden rounded-full border-4 shadow-lg", v.border, idx === 0 ? "z-30" : idx === 1 ? "z-20" : "z-10"].join(" ")}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={UNSPLASH.base} alt="Style" className={["h-full w-full object-cover object-top", v.cls].join(" ")} />
                      </div>
                    ))}
                  </div>
                </div>
              </TimelineStep>

              <TimelineStep side="right" label="4. Remix & Earn Sparks" labelClassName="text-gold border-gold/30">
                <div className="step-card relative flex min-h-[288px] w-full flex-col items-center justify-center overflow-hidden bg-[#050505] p-0 md:aspect-[5/3]">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_40%_50%,rgba(212,175,55,0.15),transparent_50%),radial-gradient(circle_at_70%_30%,rgba(133,150,20,0.10),transparent_40%)] blur-[60px]" />
                  <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-3 py-4">
                    <div className="relative mb-3 h-16 w-16 overflow-hidden rounded-full border-2 border-gold shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={UNSPLASH.base} alt="Creator" className="h-full w-full object-cover object-top" />
                      <div className="absolute -bottom-1 -right-1 rounded-full border border-black bg-gold px-1.5 py-0.5 text-[10px] font-black text-black">
                        +2
                      </div>
                    </div>
                    <div className="mb-2 text-sm font-extrabold text-white">Your aesthetic is live.</div>
                    <div className="text-balance mb-5 px-4 text-center text-xs leading-relaxed text-gray-300/75">
                      Publish to the Creator Feed. When someone hits Remix, you earn Sparks to generate more premium looks.
                    </div>
                    <div className="flex w-[80%] items-center justify-between rounded-lg border border-white/5 bg-[#151515] p-2.5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[8px] font-black text-black">
                          ⚡
                        </span>
                        <span className="text-xs font-black text-white">55 Sparks</span>
                      </div>
                      <Link href="/sign-up" className="fluid-btn fluid-btn-gold rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-wide">
                        <span className="fluid-btn-bg" />
                        <span className="fluid-text-wrapper">
                          <span className="fluid-text fluid-text-top">Generate</span>
                          <span className="fluid-text fluid-text-bottom">Generate</span>
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </TimelineStep>
            </div>
          </section>

          {/* FEED CTA (lightweight section to anchor dock) */}
          <section id="creator-feed" className="mx-auto max-w-7xl px-6 py-20">
            <div className="flex flex-col items-start justify-between gap-8 rounded-[2rem] border border-white/10 bg-white/5 p-8 md:flex-row md:items-center md:p-10">
              <div>
                <h2 className="display-font mb-2 text-3xl font-black md:text-4xl">The Creator Feed</h2>
                <p className="max-w-xl text-sm leading-relaxed text-gray-300/75">
                  Browse what’s trending, remix aesthetics you love, and publish styles so you earn Sparks when others use them.
                </p>
              </div>
              <div className="flex w-full gap-3 md:w-auto">
                <Link href="/explore" className="fluid-btn fluid-btn-dark flex-1 rounded-xl px-6 py-3.5 text-sm font-extrabold md:flex-none border border-white/10 bg-white/5 hover:border-gold">
                  Explore Feed
                </Link>
                <Link href="/sign-up" className="fluid-btn fluid-btn-gold flex-1 rounded-xl px-6 py-3.5 text-sm font-extrabold md:flex-none">
                  <span className="fluid-btn-bg" />
                  <span className="fluid-text-wrapper">
                    <span className="fluid-text fluid-text-top">Start Creating</span>
                    <span className="fluid-text fluid-text-bottom">Start Creating</span>
                  </span>
                </Link>
              </div>
            </div>
          </section>

          {/* PRICING */}
          <section id="pricing-section" className="mx-auto max-w-7xl px-6 py-24">
            <div className="mb-12 text-center">
              <h2 className="display-font type-h2 text-balance mb-4 font-black">Simple pricing.</h2>
              <p className="mx-auto max-w-2xl text-sm text-gray-300/70">
                Try the studio, test a few styles, share your first look. Upgrade when you love it.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <PriceCard title="Free" price="₹0" desc="Try the studio and generate daily." cta="Start free" href="/sign-up?plan=free" />
              <PriceCard
                title="Creator Tier"
                price="₹149"
                desc="For daily creators: more Sparks, premium output, and better visibility."
                badge="Most popular"
                highlight
                cta="Get creator →"
                href="/sign-up?plan=creator"
              />
              <PriceCard title="Pro" price="₹499" desc="Unlimited generations, 4K, commercial use." cta="Get pro" href="/sign-up?plan=pro" />
            </div>
          </section>

          {/* FOOTER */}
          <footer className="brand-gold-glow brand-gold-glow--section border-t border-white/5 py-16">
            <div className="mx-auto max-w-7xl px-6">
              <div className="grid gap-10 md:grid-cols-4">
                <div>
                  <div className="display-font text-xl font-black">
                    picfomo<span className="text-gold">.com</span>
                  </div>
                  <p className="mt-3 max-w-[260px] text-sm text-gray-200/60">
                    The fastest way to generate studio-grade AI portraits and remix viral aesthetics—without prompts.
                  </p>
                </div>
                <div>
                  <h4 className="mb-4 text-sm font-semibold text-white">Product</h4>
                  <ul className="flex flex-col gap-3">
                    <li>
                      <button onClick={() => navigateTo("home")} className="text-left text-sm text-gray-200/70 transition hover:text-gold">
                        Styles
                      </button>
                    </li>
                    <li>
                      <Link href="/explore" className="text-sm text-gray-200/70 transition hover:text-gold">
                        Creator Feed
                      </Link>
                    </li>
                    <li>
                      <button onClick={() => navigateTo("pricing")} className="text-left text-sm text-gray-200/70 transition hover:text-gold">
                        Pricing
                      </button>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-4 text-sm font-semibold text-white">Company</h4>
                  <ul className="flex flex-col gap-3">
                    <li>
                      <Link href="/about" className="text-sm text-gray-200/70 transition hover:text-gold">
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link href="/careers" className="text-sm text-gray-200/70 transition hover:text-gold">
                        Careers
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" className="text-sm text-gray-200/70 transition hover:text-gold">
                        Contact Support
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-4 text-sm font-semibold text-white">Legal</h4>
                  <ul className="flex flex-col gap-3">
                    <li>
                      <Link href="/terms" className="text-sm text-gray-200/70 transition hover:text-gold">
                        Terms of Service
                      </Link>
                    </li>
                    <li>
                      <Link href="/privacy" className="text-sm text-gray-200/70 transition hover:text-gold">
                        Privacy Policy
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
                <p className="text-xs text-gray-200/60">© 2026 PicFOMO. All rights reserved.</p>
                <div className="flex items-center gap-4">
                  <a aria-label="X" href="#" className="text-gray-200/60 transition hover:text-white">
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* DOCK */}
      <div className="mac-dock-wrapper">
        <div className="mac-dock" id="mac-dock">
          <button
            type="button"
            className={["dock-item brand", dockActive === "home" ? "active" : ""].join(" ")}
            onClick={() => navigateTo("home")}
          >
            <div className="dock-tooltip">Home</div>
            <div className="dock-icon">P</div>
            <div className="dock-dot" />
          </button>

          <button
            type="button"
            className={["dock-item", dockActive === "feed" ? "active" : ""].join(" ")}
            onClick={() => navigateTo("feed")}
          >
            <div className="dock-tooltip">Creator Feed</div>
            <div className="dock-icon">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </div>
            <div className="dock-dot" />
          </button>

          <button
            type="button"
            className={["dock-item", dockActive === "pricing" ? "active" : ""].join(" ")}
            onClick={() => navigateTo("pricing")}
          >
            <div className="dock-tooltip">Pricing</div>
            <div className="dock-icon">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
            </div>
            <div className="dock-dot" />
          </button>

          <Link className="dock-item" href="/sign-in">
            <div className="dock-tooltip">Login</div>
            <div className="dock-icon">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="dock-dot" />
          </Link>

          <button type="button" className="dock-item" onClick={() => navigateTo("home")}>
            <div className="dock-tooltip">Upload Photo</div>
            <div className="dock-icon text-gold">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <div className="dock-dot" />
          </button>
        </div>
      </div>
    </div>
  );
}

function FlankCard({ img, label, className }: { img: string; label: string; className?: string }) {
  return (
    <div
      className={[
        "flank-card relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#111] shadow-2xl",
        className ?? "",
      ].join(" ")}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img} alt={label} className="h-full w-full object-cover" />
      <div className="absolute bottom-4 left-4 rounded-lg border border-white/10 bg-black/70 px-3 py-1.5 text-xs font-extrabold text-white shadow-lg backdrop-blur">
        {label}
      </div>
    </div>
  );
}

function MobileThumb({ img, label }: { img: string; label: string }) {
  return (
    <div className="relative w-[160px] shrink-0 snap-center aspect-[4/5] overflow-hidden rounded-2xl border border-white/10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img} alt={label} className="h-full w-full object-cover" />
      <div className="absolute bottom-2 left-2 rounded border border-white/10 bg-black/70 px-2 py-1 text-[10px] font-extrabold backdrop-blur">
        {label}
      </div>
    </div>
  );
}

function TimelineStep({
  side,
  label,
  labelClassName,
  cornerLabel,
  children,
}: {
  side: "left" | "right";
  label: string;
  labelClassName?: string;
  cornerLabel?: "right";
  children: React.ReactNode;
}) {
  const justify = side === "left" ? "justify-start" : "justify-end";
  return (
    <div className={["timeline-step relative mb-24 w-full flex", justify, "md:mb-32"].join(" ")}>
      <div className="timeline-node hidden md:block" />
      <div className="relative z-20 w-full md:w-[45%]">
        <div
          className={[
            "step-label",
            cornerLabel === "right" ? "right-8 left-auto" : "",
            labelClassName ?? "",
          ].join(" ")}
        >
          {label}
        </div>
        {children}
      </div>
    </div>
  );
}

function PriceCard({
  title,
  price,
  desc,
  href,
  cta,
  badge,
  highlight,
}: {
  title: string;
  price: string;
  desc: string;
  href: string;
  cta: string;
  badge?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-[1.5rem] border p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)]",
        highlight ? "border-gold bg-[#0a0a0a]" : "border-white/10 bg-[#0a0a0a]",
      ].join(" ")}
    >
      {badge ? (
        <div className="absolute right-6 top-6 rounded-full bg-gold px-3 py-1 text-[10px] font-black uppercase tracking-wider text-black">
          {badge}
        </div>
      ) : null}
      <div className="display-font text-xl font-black text-white">{title}</div>
      <div className="display-font mt-2 text-5xl font-black text-gold">{price}</div>
      <p className="mt-4 text-sm leading-relaxed text-gray-300/75">{desc}</p>
      <Link
        href={href}
        className={[
          "mt-8 inline-flex w-full items-center justify-center rounded-xl px-6 py-3.5 text-sm font-extrabold",
          highlight ? "fluid-btn fluid-btn-gold" : "fluid-btn fluid-btn-dark border border-white/10 bg-white/5 hover:border-gold",
        ].join(" ")}
      >
        {highlight ? (
          <>
            <span className="fluid-btn-bg" />
            <span className="fluid-text-wrapper">
              <span className="fluid-text fluid-text-top">{cta}</span>
              <span className="fluid-text fluid-text-bottom">{cta}</span>
            </span>
          </>
        ) : (
          cta
        )}
      </Link>
    </div>
  );
}

