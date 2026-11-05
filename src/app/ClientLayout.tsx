"use client";

import { LazyMotion, domMax } from "framer-motion";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domMax}>
      <div className="relative min-h-screen">
        {children}
      </div>
    </LazyMotion>
  );
}
