"use client";

import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    let rafId: number;
    let lenisInstance: any;

    import('lenis').then(({ default: Lenis }) => {
      lenisInstance = new Lenis({
        duration: 1.12,
        easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.92,
        touchMultiplier: 1.05,
        infinite: false
      });

      function raf(time: number) {
        lenisInstance.raf(time);
        rafId = requestAnimationFrame(raf);
      }

      rafId = requestAnimationFrame(raf);
    });

    // ✅ Cleanup runs correctly in outer useEffect scope
    return () => {
      cancelAnimationFrame(rafId);
      if (lenisInstance) lenisInstance.destroy();
    };
  }, []);

  return null;
}
