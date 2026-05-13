"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Palette, Globe, Lock, Zap, User } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import StoryLogo from "./StoryLogo";

export default function NavigationBar() {
  const pathname = usePathname();
  const { user } = useUser();

  const profileLink = user?.username ? `/u/${user.username}` : "/dashboard";

  // THE FIX: Studio now correctly points to /dashboard/studio
  const NAV_ITEMS = [
    { name: "Vault", href: "/dashboard/vault", icon: Lock },
    { name: "Feed", href: "/explore", icon: Globe },
    { name: "Studio", href: "/dashboard/studio", icon: Palette },
    { name: "Sparks", href: "/dashboard/sparks", icon: Zap },
    { name: "Profile", href: profileLink, icon: User },
  ];

  return (
    <>
      <nav className="hidden w-64 flex-col border-r border-[var(--rule)] bg-[var(--color-page-bg)] p-6 md:flex h-screen sticky top-0">
        
        <div className="mb-12 flex items-center justify-start">
          <StoryLogo />
        </div>

        <div className="flex flex-col gap-2 flex-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.name === "Profile" && pathname.startsWith('/u/'));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 font-[family-name:var(--display)] tracking-[1px] transition-all ${
                  isActive
                    ? "bg-[var(--color-gold-pale)] text-[var(--color-page-text)] shadow-sm"
                    : "text-[var(--color-ink2)] hover:bg-[var(--color-cream)] hover:text-[var(--color-page-text)]"
                }`}
              >
                <Icon 
                  size={20} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={isActive ? "text-[var(--color-gold)]" : "text-[var(--color-ink3)] group-hover:text-[var(--color-page-text)]"} 
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-[var(--rule)] bg-[var(--color-page-bg)] pb-safe pt-2 md:hidden">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.name === "Profile" && pathname.startsWith('/u/'));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 ${
                isActive ? "text-[var(--color-page-text)]" : "text-[var(--color-ink3)] opacity-60"
              }`}
            >
              <div className={`transition-transform ${isActive ? "-translate-y-1 scale-110 text-[var(--color-gold)]" : ""}`}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="font-[family-name:var(--mono)] text-[8px] uppercase tracking-[1px]">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}