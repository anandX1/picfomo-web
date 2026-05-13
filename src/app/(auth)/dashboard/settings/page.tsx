import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any);
  
  // 🌟 FIX: Removed the <Type> from .first() and cast the result instead to fix the TS error!
  const result = await db
    .prepare("SELECT username, display_name, bio, website FROM users WHERE id = ?")
    .bind(userId)
    .first();
    
  const user = result as { username: string; display_name: string; bio: string; website: string } | null;

  if (!user) {
    return (
      <div className="p-10 text-center text-[var(--color-page-text)]">
        <p className="font-[family-name:var(--mono)] text-[12px] uppercase tracking-widest">
          Identity not synced yet. Go to your Feed to trigger the sync.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] p-4 md:p-8 animate-in fade-in duration-500 text-[var(--color-page-text)]">
      <div className="mb-8 border-b border-[var(--rule)] pb-6">
        <h1 className="font-[family-name:var(--display)] text-3xl md:text-4xl text-[var(--color-page-text)] tracking-tight">
          Settings
        </h1>
        <p className="mt-2 font-[family-name:var(--mono)] text-[12px] uppercase tracking-[2px] text-[var(--color-ink3)]">
          Manage your aesthetic identity and account security.
        </p>
      </div>

      <SettingsClient initialData={user} />
    </div>
  );
}