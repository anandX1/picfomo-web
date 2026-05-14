"use client";

import { usePathname } from "next/navigation";
import { LazyMotion, domMax } from "framer-motion";
import NavigationBar from "@/components/dashboard/NavigationBar";
import VaultHandoff from "@/components/dashboard/VaultHandoff";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // 🌟 Check if we are on a public marketing or auth page
  const isPublicPage = pathname === "/" || 
                       pathname === "/styles" ||
                       pathname.startsWith("/style/") ||
                       pathname.startsWith("/use-case/") ||
                       pathname.startsWith("/compare/") ||
                       pathname.startsWith("/guides/") ||
                       pathname === "/grader" ||
                       pathname === "/blog" ||
                       pathname.startsWith("/blog/") ||
                       pathname === "/join" || 
                       pathname.startsWith("/sign-in") || 
                       pathname.startsWith("/sign-up");

  const content = isPublicPage ? (
    <>{children}</>
  ) : (
    <div className="flex h-screen w-full overflow-hidden">
      <VaultHandoff />
      <NavigationBar />
      <main className="flex-1 h-full overflow-y-auto pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );

  return (
    <LazyMotion features={domMax}>
      {content}
    </LazyMotion>
  );
}