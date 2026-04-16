import { auth } from "@clerk/nextjs/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";

export const runtime = "edge";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const db = getRequestContext().env.DB;
  
  // Fetch current user details from D1 (including the new website field)
  const user = await db
    .prepare("SELECT username, display_name, bio, website FROM users WHERE id = ?")
    .bind(userId)
    .first<{ username: string; display_name: string; bio: string; website: string }>();

  if (!user) {
    return (
      <div className="p-10 text-center">
        <p>Identity not synced yet. Go to your Feed to trigger the sync.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] p-4 md:p-8">
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your aesthetic identity and account security.
        </p>
      </div>

      <SettingsClient initialData={user} />
    </div>
  );
}