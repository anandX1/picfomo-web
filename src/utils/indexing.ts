import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * 🌟 PICFOMO INDEXING NOTIFIER (LIGHTWEIGHT EDITION)
 * Implementation: Native Web Crypto API + REST Fetch
 * This replaces the heavy 'googleapis' package to keep the worker size under 3MB.
 */

interface GoogleServiceAccount {
  client_email: string;
  private_key: string;
}

/**
 * 🔐 Generates a Google OAuth2 Access Token using the Web Crypto API.
 * Cloudflare Workers support native RS256 signing via crypto.subtle.
 */
async function getGoogleAccessToken(serviceAccount: GoogleServiceAccount): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 3600;

  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/indexing",
    aud: "https://oauth2.googleapis.com/token",
    exp,
    iat,
  };

  const base64Url = (str: string) =>
    btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  const encodedHeader = base64Url(JSON.stringify(header));
  const encodedPayload = base64Url(JSON.stringify(payload));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

  // Import the RSA private key
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  const pemData = serviceAccount.private_key
    .replace(/\n/g, "")
    .replace(pemHeader, "")
    .replace(pemFooter, "");
  
  const binaryKey = Uint8Array.from(atob(pemData), (c) => c.charCodeAt(0));

  const key = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(unsignedToken)
  );

  const encodedSignature = base64Url(String.fromCharCode(...new Uint8Array(signature)));
  const jwt = `${unsignedToken}.${encodedSignature}`;

  // Exchange JWT for Access Token
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

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
export async function drainIndexingQueue(dbOverride?: any, limit: number = 50) {
  try {
    let db = dbOverride;
    if (!db) {
      const envCtx = await getCloudflareContext({ async: true });
      db = envCtx.env.DB as any;
    }
    if (!db) return { ok: false, error: "No DB" };

    const { results } = await db.prepare("SELECT url FROM indexing_queue LIMIT ?").bind(limit).all();

    if (!results || results.length === 0) return { ok: true, processed: 0 };

    // Get credentials from env
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || "{}") as GoogleServiceAccount;
    if (!credentials.client_email || !credentials.private_key) {
      throw new Error("Missing Google Service Account credentials");
    }

    const accessToken = await getGoogleAccessToken(credentials);

    let processed = 0;
    for (const row of results) {
      await notifyGoogleOfUpdate(row.url as string, accessToken);
      await db.prepare("DELETE FROM indexing_queue WHERE url = ?").bind(row.url).run();
      processed++;
    }

    return { ok: true, processed };
  } catch (err: any) {
    console.error("Failed to drain indexing queue:", err);
    return { ok: false, error: err.message };
  }
}

export async function notifyGoogleOfUpdate(url: string, accessToken?: string) {
  if (process.env.NODE_ENV !== "production" && !process.env.FORCE_INDEXING) return;

  try {
    let token = accessToken;
    if (!token) {
      const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || "{}") as GoogleServiceAccount;
      token = await getGoogleAccessToken(credentials);
    }

    const response = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        url,
        type: "URL_UPDATED",
      }),
    });

    return await response.json();
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

export const pingSitemap = pingSitemaps;
export const notifyGoogle = notifyGoogleOfUpdate;
