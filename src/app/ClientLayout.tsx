"use client";

import { usePathname } from "next/navigation";
import { LazyMotion, domMax } from "framer-motion";
import NavigationBar from "@/components/dashboard/NavigationBar";
import VaultHandoff from "@/components/dashboard/VaultHandoff";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // 🌟 Check if we are on a public marketing or auth page
  const isPublicPage = pathname === "/" || 
                       pathname === "/explore" ||
                       pathname.startsWith("/post/") ||
                       pathname === "/styles" ||
                       pathname.startsWith("/style/") ||
                       pathname.startsWith("/u/") ||
                       pathname.startsWith("/use-case/") ||
                       pathname.startsWith("/compare/") ||
                       pathname.startsWith("/guides/") ||
                       pathname === "/grader" ||
                       pathname === "/creators" ||
                       pathname === "/glossary" ||
                       pathname.startsWith("/glossary/") ||
                       pathname === "/blog" ||
                       pathname.startsWith("/blog/") ||
                       pathname === "/join" || 
                       pathname.startsWith("/sign-in") || 
                       pathname.startsWith("/sign-up");

  const content = isPublicPage ? (
    <div className="relative min-h-screen">
      {/* For pages that need the dashboard sidebar but want root scroll (like Explore/Profile) */}
      {(pathname === "/explore" || pathname.startsWith("/post/") || pathname.startsWith("/u/")) ? (
        <div className="flex w-full">
          <VaultHandoff />
          <NavigationBar />
          <main className="flex-1 w-full pb-24 md:pb-0">
            {children}
          </main>
        </div>
      ) : (
        <>{children}</>
      )}
    </div>
  ) : (
    <div className="flex w-full min-h-screen">
      <VaultHandoff />
      <NavigationBar />
      <main className="flex-1 w-full pb-24 md:pb-0">
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