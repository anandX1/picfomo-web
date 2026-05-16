import { NextResponse } from 'next/server';
import { getPublicPostCount } from '@/lib/db-queries';

/**
 * 🌟 PICFOMO SITEMAP INDEX (Staff+ Implementation)
 * Dynamically calculates shard volume based on D1 row counts.
 * Scalable to 500k+ URLs via sharded route delegation.
 */

export const runtime = 'edge';

export async function GET() {
  const baseUrl = "https://www.picfomo.com";
  
  // 1. Calculate Shard Requirements
  const postCount = await getPublicPostCount();
  const POST_SHARD_SIZE = 10000;
  const IMAGE_SHARD_SIZE = 5000;
  
  const postShards = Math.ceil(postCount / POST_SHARD_SIZE);
  const imageShards = Math.ceil(postCount / IMAGE_SHARD_SIZE);

  // 2. Build the Index XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Core Static Hubs
  xml += `  <sitemap><loc>${baseUrl}/sitemap-core.xml</loc></sitemap>\n`;
  
  // Programmatic Hubs
  xml += `  <sitemap><loc>${baseUrl}/sitemap-usecases.xml</loc></sitemap>\n`;
  xml += `  <sitemap><loc>${baseUrl}/sitemap-platforms.xml</loc></sitemap>\n`;
  xml += `  <sitemap><loc>${baseUrl}/sitemap-problems.xml</loc></sitemap>\n`;
  xml += `  <sitemap><loc>${baseUrl}/sitemap-styles.xml</loc></sitemap>\n`;

  // Dynamic Post Shards (Paginated by ID/Offset)
  for (let i = 0; i < postShards; i++) {
    xml += `  <sitemap><loc>${baseUrl}/shards/posts/${i}</loc></sitemap>\n`;
  }

  // Dedicated Image Sitemaps (Separate Crawl Queue)
  for (let i = 0; i < imageShards; i++) {
    xml += `  <sitemap><loc>${baseUrl}/shards/images/${i}</loc></sitemap>\n`;
  }

  xml += '</sitemapindex>';

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
