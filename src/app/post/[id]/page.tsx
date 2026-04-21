import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import PostClient from "./PostClient";
import { Metadata } from "next";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const postId = resolvedParams.id;
  
  if (postId.includes('.')) return { title: "PicFOMO" };

  const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any as D1Database);
  
  const post = await db.prepare(`
    SELECT posts.image_url, posts.title, posts.description, posts.tags,
    styles.name as style_name, users.username, users.display_name
    FROM posts
    JOIN users ON posts.user_id = users.id
    LEFT JOIN styles ON posts.style_id = styles.id
    WHERE posts.id = ? AND posts.is_public = 1
  `).bind(postId).first<any>();

  if (!post) return { title: "Post Not Found | PicFOMO" };

  const displayUsername = post.display_name || post.username || "A Creator";
  const style = post.style_name || "aesthetic";
  
  // 🌟 Use Groq-generated title/description if available, fallback to template
  const title = post.title 
    ? `${post.title} — PicFOMO ✨` 
    : `Stunning ${style} by ${displayUsername} on PicFOMO ✨`;

  const description = post.description 
    ? post.description 
    : `${displayUsername} generated this masterpiece on PicFOMO. Drop your photo, pick a trending style, and get your portrait in ~20 seconds.`;

  return {
    title,
    description,
    keywords: post.tags || undefined, // 🌟 Groq tags go into meta keywords
    openGraph: {
      title,
      description,
      images: [post.image_url],
      siteName: "PicFOMO",
      type: "website",
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
  const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any as D1Database);

  const post = await db.prepare(`
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

  if (!post) return notFound();

  let isFollowing = false;
  if (userId) {
    const followCheck = await db.prepare("SELECT * FROM follows WHERE follower_id = ? AND following_id = ?")
      .bind(userId, post.creator_id).first();
    isFollowing = !!followCheck;
  }

  return (
    <PostClient 
      post={post} 
      currentUserId={userId} 
      initialIsFollowing={isFollowing}
    />
  );
}