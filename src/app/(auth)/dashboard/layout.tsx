import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { redirect } from "next/navigation";
import { Zap } from "lucide-react";
import NotificationBell from "@/components/dashboard/NotificationBell";
import { getNotifications } from "@/actions/notifications";
import StoryLogo from "@/components/dashboard/StoryLogo";

export const runtime = "edge";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) return redirect("/sign-up");

  let sparks = 0;
  let initialNotifications: any[] = [];
  let initialUnreadCount = 0;

  try {
    const db = getRequestContext().env.DB;
    
    // 1. Fetch Sparks for the top header balance (UNTOUCHED)
    const result = await db
      .prepare("SELECT sparks_balance FROM users WHERE id = ?")
      .bind(user.id)
      .first<{ sparks_balance: number }>();
      
    if (result) sparks = result.sparks_balance || 0;

    // 2. Fetch Notifications for the Bell (UNTOUCHED)
    const notifData = await getNotifications();
    if (notifData.success) {
      initialNotifications = notifData.notifications || [];
      initialUnreadCount = notifData.unreadCount || 0;
    }
  } catch (error) {
    console.error("Error fetching layout data:", error);
  }

  return (
    // THE MAGIC OVERRIDE: Added 'app-ui' to this top-level container
    <div className="flex h-full w-full flex-col bg-[var(--color-cream)] app-ui">
      
      {/* Global Top Header - Adjusted padding slightly for mobile breathing room */}
      <header className="flex items-center justify-between border-b border-[var(--rule)] bg-[var(--color-white)] px-4 py-3 sm:px-6 sm:py-4 shrink-0">
        
        {/* The Glowing Story Logo on Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <StoryLogo />
        </div>
        
        <div className="hidden md:block" /> {/* Spacer for desktop */}

        {/* Right Side UI Items */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* THE UI FIX 1: Sleek, glowing amber Sparks pill (no text, just number) */}
          <div className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-1 sm:px-4 sm:py-1.5 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
            <Zap size={14} className="fill-amber-500 text-amber-500 animate-pulse" />
            <span className="font-[family-name:var(--mono)] text-[13px] font-black text-amber-700">
              {sparks}
            </span>
            {/* Desktop only text so it still looks full on PC */}
            <span className="hidden sm:inline font-[family-name:var(--mono)] text-[12px] font-bold text-amber-700 ml-1">
              SPARKS
            </span>
          </div>

          {/* THE NOTIFICATION BELL */}
          <NotificationBell 
            initialNotifications={initialNotifications} 
            initialUnreadCount={initialUnreadCount} 
          />

          {/* THE UI FIX 2: Hidden on Mobile! Clerk Button only shows on Desktop */}
          <div className="hidden md:block">
            <UserButton />
          </div>
          
        </div>
      </header>

      {/* The active page content gets injected here */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}