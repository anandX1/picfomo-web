import { google } from 'googleapis';
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * 🌟 PICFOMO INDEXING NOTIFIER
 * Implementation: Atomic Queueing + Google Indexing API
 */

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '{}'),
  scopes: ['https://www.googleapis.com/auth/indexing'],
});

const indexing = google.indexing('v3');

/**
 * Enqueues a URL for Google Indexing.
 * Uses Cloudflare D1 as a persistent queue to handle quota limits and retries.
 */
export async function enqueueIndexing(url: string) {
  try {
    const envCtx = await getCloudflareContext({ async: true });
    const db = envCtx.env.DB as any;
    if (!db) return;

    await db.prepare("INSERT OR IGNORE INTO indexing_queue (url) VALUES (?)").bind(url).run();
    console.log(`Enqueued for indexing: ${url}`);
  } catch (err) {
    console.error("Failed to enqueue indexing URL:", err);
  }
}

/**
 * Processes the indexing queue (drain).
 * This should be called by a background worker or API route.
 */
export async function drainIndexingQueue(dbOverride?: any, limit: number = 50, key?: string) {
  try {
    let db = dbOverride;
    if (!db) {
       const envCtx = await getCloudflareContext({ async: true });
       db = envCtx.env.DB as any;
    }
    if (!db) return { ok: false, error: "No DB" };

    const { results } = await db.prepare("SELECT url FROM indexing_queue LIMIT ?").bind(limit).all();
    
    let processed = 0;
    for (const row of results) {
      await notifyGoogleOfUpdate(row.url);
      await db.prepare("DELETE FROM indexing_queue WHERE url = ?").bind(row.url).run();
      processed++;
    }

    return { ok: true, processed };
  } catch (err: any) {
    console.error("Failed to drain indexing queue:", err);
    return { ok: false, error: err.message };
  }
}

export async function notifyGoogleOfUpdate(url: string) {
  if (process.env.NODE_ENV !== 'production' && !process.env.FORCE_INDEXING) return;

  try {
    const res = await indexing.urlNotifications.publish({
      auth,
      requestBody: {
        url,
        type: 'URL_UPDATED',
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Google Indexing API Error for ${url}:`, error);
  }
}

/**
 * Pings the sitemaps to Google Search Console
 */
export async function pingSitemaps() {
  const sitemapUrl = "https://www.picfomo.com/sitemap.xml";
  try {
    await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
    console.log("Sitemap pinged successfully");
  } catch (err) {
    console.error("Sitemap ping failed", err);
  }
}

// For compatibility with single-ping naming convention
export const pingSitemap = pingSitemaps;
export const notifyGoogle = notifyGoogleOfUpdate;
