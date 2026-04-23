import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import ProfileClient from "./ProfileClient";
import { calculateUserStatus } from "@/utils/badges";
import { Metadata } from "next";

export const revalidate = 0; 

// 🌟 SEO BOOST 1: DYNAMIC METADATA & CANONICAL URL
// This makes the page rankable and generates beautiful social media preview cards when shared.
export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const targetUsername = decodeURIComponent(resolvedParams.username);

  if (targetUsername.includes('.')) return { title: "PicFOMO" };

  const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any as D1Database);

  const user = await db
    .prepare("SELECT username, display_name, bio, profile_image_url FROM users WHERE LOWER(username) = LOWER(?)")
    .bind(targetUsername.trim())
    .first<{ username: string; display_name: string; bio: string; profile_image_url: string }>();

  if (!user) return { title: "Profile Not Found | PicFOMO" };

  const displayName = user.display_name || user.username;
  const title = `${displayName} (@${user.username}) — PicFOMO Creator`;
  const description = user.bio || `Check out ${displayName}'s AI aesthetic portfolio on PicFOMO.`;
  const url = `https://www.picfomo.com/u/${user.username}`;
  const imageUrl = user.profile_image_url || "https://www.picfomo.com/logo2.png";

  return {
    title,
    description,
    // 🌟 Forces Google to index the clean URL and ignore tracking parameters
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      images: [imageUrl],
      type: "profile",
      siteName: "PicFOMO",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

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

  // 🌟 SEO BOOST 2: JSON-LD STRUCTURED DATA (ProfilePage / Person)
  // Tells Google that this URL represents a specific person/creator.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "dateCreated": user.created_at,
    "mainEntity": {
      "@type": "Person",
      "name": user.display_name || user.username,
      "alternateName": `@${user.username}`,
      "description": user.bio || `AI Creator on PicFOMO`,
      "image": user.profile_image_url,
      "url": `https://www.picfomo.com/u/${user.username}`,
      "sameAs": user.website ? [
        user.website.startsWith('http') ? user.website : `https://${user.website}`
      ] : []
    }
  };

  return (
    <>
      {/* 🌟 Inject the JSON-LD silently into the DOM for Googlebot */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProfileClient 
        user={user}
        publicImages={publicImages}
        totalLikes={totalLikes}
        isOwner={userId === user.id}
        userStatus={userStatus}
        initialIsFollowing={isFollowing}
        initialFollowersCount={followersCount}
        currentUserId={userId} 
      />
    </>
  );
}