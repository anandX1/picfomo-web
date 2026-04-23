import FeedClient from "./FeedClient";
import { auth } from "@clerk/nextjs/server";
import { fetchFeedChunk } from "@/actions/feed";
import { Metadata } from "next";

// 🌟 THE MAGIC FIX: Tells Next.js to NEVER pre-render this during build!
export const dynamic = "force-dynamic";
export const revalidate = 0;

// 🌟 SEO BOOST 1: DYNAMIC METADATA & CANONICAL URL
export async function generateMetadata({ searchParams }: { searchParams: Promise<any> }): Promise<Metadata> {
  // By forcing the canonical URL to the base /explore, we prevent Google from 
  // indexing duplicate pages if users share links with ?remix=123 tracking params!
  return {
    title: "Explore Trending AI Styles & Portraits | PicFOMO",
    description: "Discover the latest AI-generated portraits, trending aesthetics, and viral styles created by the PicFOMO community.",
    alternates: {
      canonical: "https://www.picfomo.com/explore",
    },
    openGraph: {
      title: "Explore Trending AI Styles & Portraits | PicFOMO",
      description: "Discover the latest AI-generated portraits, trending aesthetics, and viral styles created by the PicFOMO community.",
      url: "https://www.picfomo.com/explore",
      type: "website",
      siteName: "PicFOMO",
    },
    twitter: {
      card: "summary_large_image",
      title: "Explore Trending AI Styles & Portraits | PicFOMO",
      description: "Discover the latest AI-generated portraits, trending aesthetics, and viral styles created by the PicFOMO community.",
    }
  };
}

export default async function ExplorePage({ searchParams }: { searchParams: Promise<any> }) {
  // Next.js 15+ requires awaiting searchParams
  const resolvedParams = await searchParams;
  
  // Cast as any to avoid strict type errors with Cloudflare context
  const db = ((await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true })).env.DB as any);
  const { userId } = await auth();

  // Handle Collab Target
  const remixId = resolvedParams?.remix as string | undefined;
  let targetRemixPost = null;
  
  if (remixId) {
    targetRemixPost = await db.prepare(`
      SELECT posts.id, posts.image_url, styles.name as style_name, users.username
      FROM posts 
      LEFT JOIN styles ON posts.style_id = styles.id
      LEFT JOIN users ON posts.user_id = users.id
      WHERE posts.id = ?
    `).bind(remixId).first();
  }

  // 🌟 FAST INITIAL LOAD: Fetch just the first 15 posts cleanly
  const initialPosts = await fetchFeedChunk(0, 15, "");

  // 🌟 SEO BOOST 2: JSON-LD STRUCTURED DATA (CollectionPage)
  // Tells Google this isn't just a static page, but a curated gallery of images.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Explore PicFOMO AI Art Gallery",
    "description": "A live feed of the best AI generated portraits and aesthetic styles.",
    "url": "https://www.picfomo.com/explore",
    "isPartOf": {
      "@type": "WebSite",
      "name": "PicFOMO",
      "url": "https://www.picfomo.com/"
    }
  };

  return (
    <>
      {/* 🌟 Inject the JSON-LD silently into the DOM for Googlebot */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FeedClient 
        initialPosts={initialPosts} 
        currentUserId={userId} 
        initialRemixData={targetRemixPost} 
      />
    </>
  );
}