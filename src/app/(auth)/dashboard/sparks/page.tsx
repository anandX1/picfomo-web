import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import SparksHubClient from "./SparksHubClient";



export default async function SparksHubPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any as D1Database);

  // 1. Fetch User Balance, Referral Code & UNCLAIMED SPARKS
  const user = await db
    .prepare("SELECT sparks_balance, referral_code, unclaimed_sparks FROM users WHERE id = ?")
    .bind(userId)
    .first<{ sparks_balance: number, referral_code: string, unclaimed_sparks: number }>();

  // 2. Fetch Ledger
  const { results: transactions } = await db
    .prepare("SELECT amount, reason, created_at FROM spark_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 15")
    .bind(userId)
    .all<{ amount: number; reason: string; created_at: string }>();

  // 3. Check Daily Login
  const { results: completedToday } = await db
    .prepare("SELECT task_key FROM task_completions WHERE user_id = ? AND task_key = 'daily_login' AND date(completed_at) = date('now')")
    .bind(userId)
    .all();

  // 4. Creator Dividend (Includes Harvested Sparks so the UI still looks great)
  const { results: todaysEarnings } = await db
    .prepare("SELECT reason, SUM(amount) as total FROM spark_transactions WHERE user_id = ? AND date(created_at) = date('now') AND reason IN ('Creator Dividend: Liked', 'Creator Dividend: Remixed', 'Harvested Creator Dividend') GROUP BY reason")
    .bind(userId)
    .all<{ reason: string; total: number }>();

  let earnedFromLikes = 0;
  let earnedFromRemixes = 0;
  todaysEarnings.forEach(row => {
    // We group Harvested dividends into "Likes" visually for today's tracker
    if (row.reason === 'Creator Dividend: Liked' || row.reason === 'Harvested Creator Dividend') earnedFromLikes += row.total;
    if (row.reason === 'Creator Dividend: Remixed') earnedFromRemixes += row.total;
  });

  // 5. Fetch Dynamic Bounties
  const { results: availableTasks } = await db.prepare(`
    SELECT * FROM tasks 
    WHERE is_active = 1 
    AND id NOT IN (SELECT task_id FROM user_tasks WHERE user_id = ?)
    ORDER BY created_at DESC
  `).bind(userId).all();

  // 6. FETCH REFERRAL STATS
  const refStats = await db.prepare("SELECT COUNT(*) as friends FROM referrals WHERE referrer_id = ?").bind(userId).first<{ friends: number }>();
  const friendsJoined = refStats?.friends || 0;
  const referralEarnings = friendsJoined * 35; // 35 sparks per friend

  return (
    <SparksHubClient 
      balance={user?.sparks_balance || 0}
      unclaimedSparks={user?.unclaimed_sparks || 0} // Passing the vault!
      transactions={transactions}
      hasClaimedDaily={completedToday.length > 0}
      availableTasks={availableTasks as any[]}
      earnedFromLikes={earnedFromLikes}
      earnedFromRemixes={earnedFromRemixes}
      referralCode={user?.referral_code || userId}
      friendsJoined={friendsJoined}
      referralEarnings={referralEarnings}
    />
  );
}