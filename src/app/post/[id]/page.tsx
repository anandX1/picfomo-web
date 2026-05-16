import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import PostClient from "./PostClient";
import { Metadata } from "next";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getSinglePost } from "@/lib/db-queries";
import { REVALIDATE_TIMERS } from "@/lib/cache";
import { SchemaFactory } from "@/lib/seo/schemaFactory";

/**
 * 🚀 NEXT-GEN PERFORMANCE ARCHITECTURE
 * Eliminates force-dynamic to secure sub-100ms TTFB at the Edge.
 */
export const revalidate = 86400;

// 🌟 SEO BOOST 1: DYNAMIC METADATA & CANONICAL URL
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const postId = resolvedParams.id;
  
  if (postId.includes('.')) return { title: "PicFOMO" };

  const post = await getSinglePost(postId);

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
  const post = await getSinglePost(postId);

  if (!post) return notFound();

  let isFollowing = false;
  if (userId) {
    const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any as D1Database);
    const followCheck = await db.prepare("SELECT * FROM follows WHERE follower_id = ? AND following_id = ?")
      .bind(userId, post.creator_id).first();
    isFollowing = !!followCheck;
  }

  // 🌟 SEO: JSON-LD STRUCTURED DATA (ImageObject + Breadcrumbs)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      SchemaFactory.imageObject(post),
      SchemaFactory.breadcrumbList([
        { name: "Home", url: "https://www.picfomo.com/" },
        { name: "Explore", url: "https://www.picfomo.com/explore" },
        { name: post.style_name || "Portrait", url: `https://www.picfomo.com/post/${postId}` }
      ])
    ]
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