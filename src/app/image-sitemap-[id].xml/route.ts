import { NextResponse } from 'next/server';
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * 🌟 PICFOMO SHARDED IMAGE SITEMAP
 * Implementation: Dedicated Image Indexing Queue.
 * Rationale: Prevents bloat in standard sitemaps while maximizing visual search dominance.
 */

export const runtime = 'edge';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const chunkId = parseInt(resolvedParams.id || '0', 10);
  const limit = 5000; // Lower limit for image shards due to XML verbosity
  const offset = chunkId * limit;

  const baseUrl = "https://www.picfomo.com";

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      // 1. Header with Image Namespace
      controller.enqueue(encoder.encode('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'));

      try {
        const envCtx = await getCloudflareContext({ async: true });
        const db = envCtx.env.DB as any;
        
        if (db) {
          const { results } = await db.prepare(`
            SELECT p.id, p.image_url, p.title, s.name as style_name, u.username
            FROM posts p
            LEFT JOIN styles s ON p.style_id = s.id
            LEFT JOIN users u ON p.user_id = u.id
            WHERE p.is_public = 1 
            ORDER BY p.created_at DESC 
            LIMIT ? OFFSET ?
          `).bind(limit, offset).all();
          
          if (!results || results.length === 0) {
            controller.close();
            return;
          }

          // 2. Stream Image Nodes
          for (const post of results) {
            const imageTitle = post.title || `${post.style_name || 'AI'} Portrait by ${post.username || 'PicFOMO'}`;
            const node = `  <url>\n    <loc>${baseUrl}/post/${post.id}</loc>\n    <image:image>\n      <image:loc>${post.image_url}</image:loc>\n      <image:title><![CDATA[${imageTitle}]]></image:title>\n      <image:license>https://www.picfomo.com/license</image:license>\n    </image:image>\n  </url>\n`;
            controller.enqueue(encoder.encode(node));
          }
        }
      } catch (error) {
        console.error("Image Shard Streaming Error:", error);
      }

      // 3. Footer
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
