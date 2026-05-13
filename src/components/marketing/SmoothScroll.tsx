"use client";

import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    // ESM import for Lenis
    import('lenis').then(({ default: Lenis }) => {
      const lenis = new Lenis({
        duration: 1.12,
        easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.92,
        touchMultiplier: 1.05,
        infinite: false
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      return () => {
        lenis.destroy();
      };
    });
  }, []);

  return null;
}
