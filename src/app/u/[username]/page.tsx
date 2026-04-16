
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import ProfileClient from "./ProfileClient";
import { calculateUserStatus } from "@/utils/badges";


export const revalidate = 0; 

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const targetUsername = decodeURIComponent(resolvedParams.username);

  if (targetUsername.includes('.')) return notFound();

  const { userId } = await auth();
  const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any as D1Database);

  // 1. Fetch User Data
  const user = await db
    .prepare("SELECT id, username, display_name, profile_image_url, bio, website, created_at FROM users WHERE LOWER(username) = LOWER(?)")
    .bind(targetUsername.trim())
    .first<{ id: string; username: string; display_name: string; profile_image_url: string; bio: string; website: string; created_at: string }>();

  if (!user) return notFound();

  // 2. Fetch Follower Stats & Join Rank
  let isFollowing = false;
  if (userId) {
    const followCheck = await db.prepare("SELECT * FROM follows WHERE follower_id = ? AND following_id = ?").bind(userId, user.id).first();
    isFollowing = !!followCheck;
  }

  const [followersResult, rankResult] = await db.batch([
    db.prepare("SELECT COUNT(*) as count FROM follows WHERE following_id = ?").bind(user.id),
    db.prepare("SELECT COUNT(*) as rank FROM users WHERE created_at <= ?").bind(user.created_at) // Finds exactly what number user they are!
  ]);

  const followersCount = (followersResult.results[0] as any)?.count || 0;
  const joinRank = (rankResult.results[0] as any)?.rank || 99999;

  // 3. Fetch Posts & Analytics
  const [postsResult, statsResult] = await db.batch([
    db.prepare(`
      SELECT 
        posts.id, posts.image_url, styles.name as style_name,
        (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) as likes_count
      FROM posts 
      LEFT JOIN styles ON posts.style_id = styles.id
      WHERE posts.user_id = ? AND posts.is_public = 1
      ORDER BY posts.created_at DESC
    `).bind(user.id),
    db.prepare(`
      SELECT COUNT(*) as total_likes 
      FROM likes 
      INNER JOIN posts ON likes.post_id = posts.id 
      WHERE posts.user_id = ?
    `).bind(user.id)
  ]);

  const publicImages = postsResult.results as any[];
  const totalLikes = (statsResult.results[0] as any).total_likes || 0;
  
  // 4. Calculate their Ticks and Top 3 Badges
  const userStatus = calculateUserStatus(joinRank, publicImages.length, totalLikes, followersCount);

  return (
    <ProfileClient 
      user={user}
      publicImages={publicImages}
      totalLikes={totalLikes}
      isOwner={userId === user.id}
      userStatus={userStatus} // <-- Passing the new object!
      initialIsFollowing={isFollowing}
      initialFollowersCount={followersCount}
      currentUserId={userId} 
    />
  );
}