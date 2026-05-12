import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import ProfileClient from "./ProfileClient";
import { calculateUserStatus } from "@/utils/badges";
import { Metadata } from "next";
import { cache } from "react";

export const revalidate = 0; 

const getProfile = cache(async (targetUsernameRaw: string) => {
  const targetUsername = decodeURIComponent(targetUsernameRaw);
  if (targetUsername.includes(".")) return null;

  const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env
    .DB as any as D1Database);

  const user = await db
    .prepare(
      "SELECT id, username, display_name, profile_image_url, bio, website, created_at FROM users WHERE LOWER(username) = LOWER(?)"
    )
    .bind(targetUsername.trim())
    .first<{
      id: string;
      username: string;
      display_name: string;
      profile_image_url: string;
      bio: string;
      website: string;
      created_at: string;
    }>();

  if (!user) return null;

  const [followersResult, rankResult, postsResult, statsResult] = await db.batch([
    db.prepare("SELECT COUNT(*) as count FROM follows WHERE following_id = ?").bind(user.id),
    db.prepare("SELECT COUNT(*) as rank FROM users WHERE created_at <= ?").bind(user.created_at),
    db.prepare(`
      SELECT 
        posts.id, posts.image_url, posts.created_at,
        posts.title, posts.description, posts.tags,
        styles.name as style_name,
        (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) as likes_count
      FROM posts 
      LEFT JOIN styles ON posts.style_id = styles.id
      WHERE posts.user_id = ? AND posts.is_public = 1
      ORDER BY posts.created_at DESC
      LIMIT 12
    `).bind(user.id),
    db.prepare(`
      SELECT COUNT(*) as total_likes 
      FROM likes 
      INNER JOIN posts ON likes.post_id = posts.id 
      WHERE posts.user_id = ?
    `).bind(user.id),
  ]);

  const followersCount = (followersResult.results[0] as any)?.count || 0;
  const joinRank = (rankResult.results[0] as any)?.rank || 99999;
  const publicPosts = (postsResult.results as any[]) ?? [];
  const totalLikes = (statsResult.results[0] as any)?.total_likes || 0;

  return { user, followersCount, joinRank, publicPosts, totalLikes };
});

// 🌟 SEO BOOST 1: DYNAMIC METADATA & CANONICAL URL
// This makes the page rankable and generates beautiful social media preview cards when shared.
export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const profile = await getProfile(resolvedParams.username);
  if (!profile) return { title: "Profile Not Found | PicFOMO" };

  const { user, followersCount, publicPosts, totalLikes } = profile;

  const displayName = user.display_name || user.username;
  const url = `https://www.picfomo.com/u/${encodeURIComponent(user.username)}`;
  const imageUrl = user.profile_image_url || "https://www.picfomo.com/logo2.png";

  const title = `${displayName} (@${user.username}) — PicFOMO Creator`;
  const description =
    user.bio ||
    `${displayName} on PicFOMO — ${publicPosts.length} public portraits · ${followersCount} followers · ${totalLikes} likes.`;

  const sameAs = user.website
    ? [user.website.startsWith("http") ? user.website : `https://${user.website}`]
    : [];

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
      images: [
        {
          url: imageUrl,
          alt: `${displayName} on PicFOMO`,
        },
      ],
      type: "profile",
      siteName: "PicFOMO",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    other: sameAs.length ? { "profile:sameAs": sameAs.join(",") } : undefined,
  };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const targetUsername = decodeURIComponent(resolvedParams.username);

  if (targetUsername.includes('.')) return notFound();

  const { userId } = await auth();
  const profile = await getProfile(resolvedParams.username);
  if (!profile) return notFound();

  const { user, followersCount, joinRank, publicPosts, totalLikes } = profile;

  const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any as D1Database);

  // 2. Fetch Follower Stats & Join Rank
  let isFollowing = false;
  if (userId) {
    const followCheck = await db.prepare("SELECT * FROM follows WHERE follower_id = ? AND following_id = ?").bind(userId, user.id).first();
    isFollowing = !!followCheck;
  }
  
  // 4. Calculate their Ticks and Top 3 Badges
  const userStatus = calculateUserStatus(joinRank, publicPosts.length, totalLikes, followersCount);

  // 🌟 SEO: JSON-LD STRUCTURED DATA (ProfilePage / Person + ItemList)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "dateCreated": user.created_at,
    "url": `https://www.picfomo.com/u/${user.username}`,
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
    },
    "hasPart": {
      "@type": "ItemList",
      "name": `Public portraits by @${user.username}`,
      "itemListOrder": "https://schema.org/ItemListOrderDescending",
      "numberOfItems": publicPosts.length,
      "itemListElement": publicPosts.map((p: any, idx: number) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "url": `https://www.picfomo.com/post/${p.id}`,
      })),
    },
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
        publicImages={publicPosts}
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