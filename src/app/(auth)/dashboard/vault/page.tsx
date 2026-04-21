import { auth } from "@clerk/nextjs/server";
import VaultClient from "./VaultClient";

interface VaultPost {
  id: string;
  image_url: string;
  is_public: number;
  created_at: string;
}

export default async function VaultPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any as D1Database);

  // Fetch ONLY the current user's posts
  const { results: posts } = await db
    .prepare(`
      SELECT id, image_url, is_public, created_at 
      FROM posts 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `)
    .bind(userId)
    .all<VaultPost>();

  return (
    <div className="mx-auto max-w-[1600px] p-4 md:p-8 animate-in fade-in duration-500 text-[var(--color-ink)] min-h-screen">
      
      {/* 🌟 HEADER: Upgraded to match Explore/Studio premium typography */}
      <div className="mb-8 border-b border-[var(--rule)] pb-6">
        <h1 className="font-[family-name:var(--display)] text-4xl md:text-5xl tracking-[-1px] text-[var(--color-ink)] mb-2">
          YOUR VAULT
        </h1>
        <p className="font-[family-name:var(--mono)] text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-ink3)]">
          Manage your personal aesthetics. Public by default to fuel the community.
        </p>
      </div>

      <VaultClient initialPosts={posts} />
    </div>
  );
}