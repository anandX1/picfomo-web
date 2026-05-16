import { NextResponse } from 'next/server';
import { getSitemapEntities } from '@/lib/db-queries';
import { PROBLEMS } from '@/data/problems';

export const runtime = 'edge';

export async function GET() {
  const baseUrl = "https://www.picfomo.com";
  
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'));

      try {
        // DB Entities
        const entities = await getSitemapEntities();
        const problems = entities.filter((e: any) => e.type === 'problem');

        const seenSlugs = new Set();
        for (const entity of problems) {
          seenSlugs.add(entity.slug);
          const lastmod = new Date(entity.updated_at || Date.now()).toISOString();
          controller.enqueue(encoder.encode(`  <url>\n    <loc>${baseUrl}/problems/${entity.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`));
        }

        // Static Fallbacks
        for (const slug of Object.keys(PROBLEMS)) {
          if (!seenSlugs.has(slug)) {
            controller.enqueue(encoder.encode(`  <url>\n    <loc>${baseUrl}/problems/${slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`));
          }
        }
      } catch (error) {
        console.error("Sitemap Problems Error:", error);
      }

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
