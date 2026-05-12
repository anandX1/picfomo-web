import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import PostClient from "./PostClient";
import { Metadata } from "next";
import { cache } from "react";

export const revalidate = 0;

// 🌟 SEO & PERFORMANCE BOOST: React Cache Memoization
// This guarantees that Cloudflare D1 is only queried ONCE per page load,
// even though both generateMetadata and the Page component need the data.
// This halves your server response time, preventing Googlebot timeouts!
const getPost = cache(async (postId: string) => {
  const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any as D1Database);
  
  return await db.prepare(`
    SELECT 
      posts.id, posts.image_url, posts.created_at, posts.prompt_used, posts.user_id as creator_id,
      posts.title, posts.description, posts.tags,
      users.username, users.display_name, users.profile_image_url,
      styles.name as style_name,
      (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) as likes_count,
      (SELECT COUNT(*) FROM post_views WHERE post_views.post_id = posts.id) as views_count,
      (SELECT COUNT(*) FROM follows WHERE follows.following_id = posts.user_id) as followers_count
    FROM posts
    JOIN users ON posts.user_id = users.id
    LEFT JOIN styles ON posts.style_id = styles.id
    WHERE posts.id = ? AND posts.is_public = 1
  `).bind(postId).first<any>();
});

// 🌟 SEO BOOST 1: DYNAMIC METADATA & CANONICAL URL
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const postId = resolvedParams.id;
  
  if (postId.includes('.')) return { title: "PicFOMO" };

  // Uses the cached function! Lightning fast.
  const post = await getPost(postId);

  if (!post) return { title: "Post Not Found | PicFOMO" };

  const displayUsername = post.display_name || post.username || "A Creator";
  const style = post.style_name || "aesthetic";
  const tagsCsv = (post.tags || "").toString();
  const tags = tagsCsv
    .split(",")
    .map((t: string) => t.trim())
    .filter(Boolean)
    .slice(0, 12);
  
  const title = post.title 
    ? `${post.title} — PicFOMO ✨` 
    : `Stunning ${style} by ${displayUsername} on PicFOMO ✨`;

  const description = post.description 
    ? post.description 
    : `${displayUsername} generated this masterpiece on PicFOMO. Drop your photo, pick a trending style, and get your portrait in ~20 seconds.`;

  return {
    title,
    description,
    keywords: tags.length ? tags : undefined,
    alternates: {
      canonical: `https://www.picfomo.com/post/${postId}`,
    },
    openGraph: {
      title,
      description,
      images: [{
        url: post.image_url,
        alt: title, // 🌟 ADDED: Required for strict SEO compliance
      }],
      siteName: "PicFOMO",
      type: "article",
      url: `https://www.picfomo.com/post/${postId}`,
      publishedTime: post.created_at ? new Date(post.created_at).toISOString() : undefined,
      authors: post.username ? [`https://www.picfomo.com/u/${post.username}`] : undefined,
      tags: tags.length ? tags : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [post.image_url],
    }
  };
}

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const postId = resolvedParams.id;

  if (postId.includes('.')) return notFound();

  const { userId } = await auth(); 
  
  // Uses the cached function! Zero extra database cost.
  const post = await getPost(postId);

  if (!post) return notFound();

  let isFollowing = false;
  if (userId) {
    const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any as D1Database);
    const followCheck = await db.prepare("SELECT * FROM follows WHERE follower_id = ? AND following_id = ?")
      .bind(userId, post.creator_id).first();
    isFollowing = !!followCheck;
  }

  // 🌟 SEO: JSON-LD STRUCTURED DATA (ImageObject + keywords)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "name": post.title || `${post.style_name} Portrait`,
    "description": post.description || `AI generated portrait by ${post.username}`,
    "contentUrl": post.image_url,
    "datePublished": new Date(post.created_at).toISOString(),
    "author": {
      "@type": "Person",
      "name": post.display_name || post.username,
      "url": `https://www.picfomo.com/u/${post.username}`
    },
    "keywords": post.tags || post.style_name,
    "isPartOf": {
      "@type": "WebSite",
      "name": "PicFOMO",
      "url": "https://www.picfomo.com/",
    },
  };

  return (
    <>
      {/* 🌟 Inject the JSON-LD silently into the DOM for Googlebot */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostClient 
        post={post} 
        currentUserId={userId} 
        initialIsFollowing={isFollowing}
      />
    </>
  );
}