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
    <div className="mx-auto max-w-[1600px] p-6 md:p-10">
      <div className="mb-8 border-b border-[var(--rule)] pb-6">
        <h1 className="font-[family-name:var(--display)] text-3xl text-[var(--color-ink)] flex items-center gap-3">
          <span className="text-2xl">🔐</span> YOUR VAULT
        </h1>
        <p className="mt-2 text-[13px] text-[var(--color-ink3)]">
          Manage your personal aesthetics. Public by default to fuel the community.
        </p>
      </div>

      <VaultClient initialPosts={posts} />
    </div>
  );
}