import { NextResponse } from 'next/server';
import { USE_CASES } from '@/data/use-cases';

export const runtime = 'edge';

export async function GET() {
  const baseUrl = "https://www.picfomo.com";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${Object.keys(USE_CASES).map(slug => `
        <url>
          <loc>${baseUrl}/use-case/${slug}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.9</priority>
        </url>
      `).join('')}
    </urlset>
  `;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  });
}
