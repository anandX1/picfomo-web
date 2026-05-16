import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * 🌟 PICFOMO SHARDED POST SITEMAP
 */

export const runtime = 'edge';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chunkId = parseInt(id || '0', 10);

  const limit = 10000;
  const offset = chunkId * limit;

  const baseUrl = "https://www.picfomo.com";

  // Use a ReadableStream for memory-efficient XML delivery
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      // 1. Flush Header
      controller.enqueue(encoder.encode('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'));

      try {
        const envCtx = await getCloudflareContext({ async: true });
        const db = envCtx.env.DB as any;
        
        if (db) {
          // Optimized Index-backed query
          const { results } = await db.prepare(`
            SELECT id, created_at 
            FROM posts 
            WHERE is_public = 1 
            ORDER BY created_at DESC 
            LIMIT ? OFFSET ?
          `).bind(limit, offset).all();
          
          if (!results || results.length === 0) {
            // Return 404 if shard is out of bounds to stop crawler
            controller.close();
            return;
          }

          // 2. Iterate and Stream URL Nodes
          for (const post of results) {
            const lastmod = new Date(post.created_at || Date.now()).toISOString();
            const node = `  <url>\n    <loc>${baseUrl}/post/${post.id}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
            controller.enqueue(encoder.encode(node));
          }
        }
      } catch (error) {
        console.error("Post Shard Streaming Error:", error);
      }

      // 3. Flush Footer
      controller.enqueue(encoder.encode('</urlset>'));
      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
