import { NextResponse } from 'next/server';
import { getSitemapComparisons } from '@/lib/db-queries';
import { GLOSSARY_TERMS } from '@/data/glossary';
import { COMPARISONS } from '@/data/comparisons';

/**
 * 🌟 PICFOMO CORE SITEMAP
 * Main static hubs and programmatic comparison nodes.
 */

export const runtime = 'edge';

export async function GET() {
  const baseUrl = "https://www.picfomo.com";

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      controller.enqueue(encoder.encode('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'));

      const coreUrls = [
        { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
        { loc: `${baseUrl}/explore`, priority: '0.9', changefreq: 'always' },
        { loc: `${baseUrl}/styles`, priority: '0.8', changefreq: 'weekly' },
        { loc: `${baseUrl}/blog`, priority: '0.7', changefreq: 'weekly' },
        { loc: `${baseUrl}/grader`, priority: '0.9', changefreq: 'monthly' },
        { loc: `${baseUrl}/research`, priority: '0.8', changefreq: 'monthly' },
      ];

      for (const url of coreUrls) {
        controller.enqueue(encoder.encode(`  <url>\n    <loc>${url.loc}</loc>\n    <changefreq>${url.changefreq}</changefreq>\n    <priority>${url.priority}</priority>\n  </url>\n`));
      }

      try {
        // Pillar Guides (Static for now)
        const guideSlugs = ['psychology-of-digital-identity', 'perfect-selfie-for-ai-headshots', 'how-to-use-ai-headshots-on-linkedin'];
        for (const slug of guideSlugs) {
          controller.enqueue(encoder.encode(`  <url>\n    <loc>${baseUrl}/guides/${slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`));
        }

        // Glossary Terms (Static for now)
        for (const slug of Object.keys(GLOSSARY_TERMS)) {
          controller.enqueue(encoder.encode(`  <url>\n    <loc>${baseUrl}/glossary/${slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`));
        }

        // Programmatic Comparisons (DB Backed)
        const comparisons = await getSitemapComparisons();
        const seenCompSlugs = new Set();
        for (const comp of comparisons) {
          seenCompSlugs.add(comp.slug);
          controller.enqueue(encoder.encode(`  <url>\n    <loc>${baseUrl}/compare/${comp.slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`));
        }

        // Static Comparison Fallbacks
        for (const slug of Object.keys(COMPARISONS)) {
            if (!seenCompSlugs.has(slug)) {
                controller.enqueue(encoder.encode(`  <url>\n    <loc>${baseUrl}/compare/${slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`));
            }
        }
      } catch (error) {
        console.error("Sitemap Core Streaming Error:", error);
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
