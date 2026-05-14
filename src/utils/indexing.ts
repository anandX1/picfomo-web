export type IndexingType = "style" | "user" | "post" | "glossary" | "comparison";

const SITE_URL = "https://www.picfomo.com";

function toAbsoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (!path.startsWith("/")) path = `/${path}`;
  return `${SITE_URL}${path}`;
}

/**
 * 🚀 GOOGLE INDEXING API (CLIENT FOUNDATION)
 * This function prepares the JWT auth and sends a URL notification to Google.
 * Requires GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY in environment variables.
 */
export async function notifyGoogleIndexing(url: string, type: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED") {
  try {
    const { google } = await import('googleapis');
    
    // Check for credentials
    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      console.warn("⚠️ Google Indexing API credentials missing. Skipping direct ping.");
      return;
    }

    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      undefined,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/indexing']
    );

    const indexing = google.indexing({ version: 'v3', auth });
    
    await indexing.urlNotifications.publish({
      requestBody: {
        url: toAbsoluteUrl(url),
        type,
      },
    });
    
    console.log(`✅ Google Indexing API: Success for ${url}`);
  } catch (error) {
    console.error("❌ Google Indexing API Error:", error);
  }
}

/**
 * ⚡ INDEXNOW PROTOCOL (BING/YANDEX)
 * Instantly notifies non-Google search engines of new content.
 */
export async function submitToIndexNow(urls: string[]) {
  const absoluteUrls = urls.map(toAbsoluteUrl);
  const key = process.env.INDEXNOW_KEY;

  if (!key) {
    console.warn("⚠️ INDEXNOW_KEY missing. Skipping IndexNow submission.");
    return { ok: false, submitted: 0 };
  }

  const payload = {
    host: "www.picfomo.com",
    key: key,
    keyLocation: `https://www.picfomo.com/${key}.txt`,
    urlList: absoluteUrls,
  };

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    return { ok: response.ok, submitted: absoluteUrls.length };
  } catch (error) {
    console.error("❌ IndexNow Error:", error);
    return { ok: false, submitted: 0 };
  }
}

/**
 * 📣 SITEMAP PING (LEGACY DISCOVERY)
 * Forces Google/Bing to re-read the sitemap.xml.
 */
export async function pingSitemaps() {
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;
  const endpoints = [
    `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
  ];
  await Promise.allSettled(endpoints.map((u) => fetch(u, { method: "GET" })));
  console.log("📣 Sitemaps pinged successfully.");
}

/**
 * 🏗️ UNIFIED HIGH-VELOCITY INDEXING
 * The "Heavy Lifter" function to be called after content creation.
 */
export async function triggerHighVelocityIndexing(url: string) {
  // 1. Ping Google directly (Minutes)
  await notifyGoogleIndexing(url);
  
  // 2. Submit to IndexNow (Seconds)
  await submitToIndexNow([url]);
  
  // 3. Ping Sitemaps (Legacy fallback)
  await pingSitemaps();
}
