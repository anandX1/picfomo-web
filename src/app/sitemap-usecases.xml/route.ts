import { NextResponse } from 'next/server';
import { getSitemapEntities } from '@/lib/db-queries';
import { USE_CASES } from '@/data/use-cases';
import { calculateNodeQuality } from '@/lib/quality-scoring';

/**
 * 🌟 PICFOMO PROGRAMMATIC USE-CASE SITEMAP
 * Implementation: Streaming XML for optimal TTFB.
 * Activation Gate: Only indexes nodes with sufficient Information Gain.
 */

export const runtime = 'edge';

export async function GET() {
  const baseUrl = "https://www.picfomo.com";
  
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      // 1. Header
      controller.enqueue(encoder.encode('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'));

      try {
        const entities = await getSitemapEntities();
        const usecases = entities.filter((e: any) => e.type === 'use-case');

        const seenSlugs = new Set();
        for (const entity of usecases) {
          seenSlugs.add(entity.slug);
          
          const score = await calculateNodeQuality(entity.slug, 'use-case');
          if (score < 30) continue; // Skip thin content

          const lastmod = new Date(entity.updated_at || Date.now()).toISOString();
          const node = `  <url>\n    <loc>${baseUrl}/use-case/${entity.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
          controller.enqueue(encoder.encode(node));
        }

        // Static Fallbacks
        for (const slug of Object.keys(USE_CASES)) {
          if (!seenSlugs.has(slug)) {
            const score = await calculateNodeQuality(slug, 'use-case');
            if (score < 30) continue;

            const node = `  <url>\n    <loc>${baseUrl}/use-case/${slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
            controller.enqueue(encoder.encode(node));
          }
        }
      } catch (error) {
        console.error("Sitemap UseCases Streaming Error:", error);
      }

      // 2. Footer
      controller.enqueue(encoder.encode('</urlset>'));
      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  });
}
