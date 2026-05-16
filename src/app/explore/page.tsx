import FeedClient from "./FeedClient";
import { auth } from "@clerk/nextjs/server";
import { fetchFeedChunk } from "@/actions/feed";
import { Metadata } from "next";
import { getRemixPost, getExploreFeed } from "@/lib/db-queries";
import { REVALIDATE_TIMERS } from "@/lib/cache";
import { SchemaFactory } from "@/lib/seo/schemaFactory";
import { Suspense } from "react";

/**
 * 🚀 NEXT-GEN PERFORMANCE ARCHITECTURE
 * Eliminates force-dynamic to secure sub-100ms TTFB at the Edge.
 */
export const revalidate = 60;

// 🌟 SEO BOOST 1: DYNAMIC METADATA & CANONICAL URL
export async function generateMetadata({ searchParams }: { searchParams: Promise<any> }): Promise<Metadata> {
  const resolvedParams = await searchParams;
  
  // Enforce absolute canonical to prevent faceted indexation bloat
  const canonical = "https://www.picfomo.com/explore";

  return {
    title: "Explore Trending AI Styles & Portraits | PicFOMO",
    description: "Discover the latest AI-generated portraits, trending aesthetics, and viral styles created by the PicFOMO community.",
    alternates: {
      canonical,
    },
    robots: {
      // If there are search params (filters/remix), we tell Google to NOINDEX 
      // but still follow the links, protecting our crawl budget.
      index: Object.keys(resolvedParams).length === 0,
      follow: true,
    },
    openGraph: {
      title: "Explore Trending AI Styles & Portraits | PicFOMO",
      description: "Discover the latest AI-generated portraits, trending aesthetics, and viral styles created by the PicFOMO community.",
      url: canonical,
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
  const resolvedParams = await searchParams;
  const { userId } = await auth();

  // Handle Collab Target via cached layer
  const remixId = resolvedParams?.remix as string | undefined;
  const targetRemixPost = remixId ? await getRemixPost(remixId) : null;

  // 🌟 PERFORMANCE: Guests get the hyper-fast cached feed. 
  // Logged-in users get the personalized action-based feed.
  const initialPosts = userId 
    ? await fetchFeedChunk(0, 15, "") 
    : await getExploreFeed(0, 15);

  // 🌟 SEO BOOST 2: JSON-LD STRUCTURED DATA (CollectionPage)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      SchemaFactory.collectionPage(
        "Explore PicFOMO AI Art Gallery",
        "A live feed of the best AI generated portraits and aesthetic styles.",
        "https://www.picfomo.com/explore",
        initialPosts
      ),
      SchemaFactory.breadcrumbList([
        { name: "Home", url: "https://www.picfomo.com/" },
        { name: "Explore", url: "https://www.picfomo.com/explore" }
      ])
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* 🌟 STREAMING ARCHITECTURE: Immediate layout flush to the Edge */}
      <Suspense fallback={<div className="h-screen w-full animate-pulse bg-zinc-950" />}>
        <FeedClient 
          initialPosts={initialPosts} 
          currentUserId={userId} 
          initialRemixData={targetRemixPost} 
        />
      </Suspense>
    </>
  );
}