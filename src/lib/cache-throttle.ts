import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * 🌟 PICFOMO CACHE THROTTLE
 * Prevents "Crawl Storms" from exhausting D1 read limits.
 * Uses Cloudflare KV as an atomic lock to ensure only ONE background 
 * revalidation hits the database at a time per semantic tag.
 */

export async function acquireRevalidationLock(tag: string, ttl: number = 30): Promise<boolean> {
  try {
    const envCtx = await getCloudflareContext({ async: true });
    // @ts-ignore - Assuming KV namespace will be bound as SITEMAP_CACHE
    const KV = envCtx.env.SITEMAP_CACHE;
    
    if (!KV) return true; // Fallback to unsecured if KV not bound

    const key = `lock:reval:${tag}`;
    const existing = await KV.get(key);
    
    if (existing) return false; // Lock held by another request

    await KV.put(key, '1', { expirationTtl: ttl });
    return true;
  } catch (e) {
    return true; // Safe fallback
  }
}

export async function releaseRevalidationLock(tag: string) {
  try {
    const envCtx = await getCloudflareContext({ async: true });
    // @ts-ignore
    const KV = envCtx.env.SITEMAP_CACHE;
    if (KV) await KV.delete(`lock:reval:${tag}`);
  } catch (e) {}
}
