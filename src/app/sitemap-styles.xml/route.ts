import { NextResponse } from 'next/server';
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = 'edge';

export async function GET() {
  const baseUrl = "https://www.picfomo.com";
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  try {
    const envCtx = await getCloudflareContext({ async: true });
    const db = envCtx.env.DB as any;
    
    if (db) {
      const { results } = await db.prepare(`SELECT slug, created_at FROM styles WHERE is_active = 1 AND slug IS NOT NULL`).all();
      
      results.forEach((style: any) => {
        xml += `
          <url>
            <loc>${baseUrl}/style/${encodeURIComponent(style.slug)}</loc>
            <lastmod>${new Date(style.created_at || Date.now()).toISOString()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
          </url>
        `;
      });
    }
  } catch (error) {
    console.error("Sitemap styles error", error);
  }

  xml += `\n</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  });
}
