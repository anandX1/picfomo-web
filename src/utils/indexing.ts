export type IndexingType = "style" | "user" | "post";

const SITE_URL = "https://www.picfomo.com";

function toAbsoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (!path.startsWith("/")) path = `/${path}`;
  return `${SITE_URL}${path}`;
}

export async function ensureIndexingTable(db: any) {
  // Safe no-op if DB/permissions differ in preview.
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS indexing_queue (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        path TEXT NOT NULL,
        created_at TEXT NOT NULL,
        submitted_at TEXT
      )
    `).run();
    await db.prepare(`CREATE INDEX IF NOT EXISTS idx_indexing_queue_submitted ON indexing_queue(submitted_at)`).run();
    await db.prepare(`CREATE INDEX IF NOT EXISTS idx_indexing_queue_type_created ON indexing_queue(type, created_at)`).run();
  } catch {
    // ignore
  }
}

export async function enqueueIndexing(db: any, type: IndexingType, path: string) {
  await ensureIndexingTable(db);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const id = `idx_${type}_${normalizedPath}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  try {
    await db
      .prepare(
        `INSERT INTO indexing_queue (id, type, path, created_at, submitted_at) VALUES (?, ?, ?, ?, NULL)`
      )
      .bind(id, type, normalizedPath, new Date().toISOString())
      .run();
  } catch {
    // ignore
  }
}

export async function pingSitemaps() {
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;
  const endpoints = [
    `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
  ];
  await Promise.allSettled(endpoints.map((u) => fetch(u, { method: "GET" })));
}

export async function submitToIndexNow(opts: {
  urls: string[];
  key: string;
  keyLocation?: string;
}) {
  const urls = opts.urls.map(toAbsoluteUrl);
  if (!urls.length) return { ok: true as const, submitted: 0 };

  const payload = {
    host: "www.picfomo.com",
    key: opts.key,
    keyLocation: opts.keyLocation ?? `${SITE_URL}/.well-known/indexnow-key.txt`,
    urlList: urls,
  };

  // Bing + IndexNow aggregator (Bing honors both; aggregator fans out).
  const targets = ["https://www.bing.com/indexnow", "https://api.indexnow.org/indexnow"];

  const results = await Promise.allSettled(
    targets.map((t) =>
      fetch(t, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
      })
    )
  );

  const ok = results.some((r) => r.status === "fulfilled" && r.value.ok);
  return { ok: ok as boolean, submitted: urls.length };
}

export async function drainIndexingQueue(db: any, limit: number, key?: string) {
  await ensureIndexingTable(db);

  // Priority: style -> user -> post
  const rows = await db
    .prepare(
      `
      SELECT id, type, path
      FROM indexing_queue
      WHERE submitted_at IS NULL
      ORDER BY
        CASE type
          WHEN 'style' THEN 1
          WHEN 'user' THEN 2
          WHEN 'post' THEN 3
          ELSE 9
        END ASC,
        created_at DESC
      LIMIT ?
    `
    )
    .bind(limit)
    .all();

  const items = (rows?.results ?? []) as { id: string; type: IndexingType; path: string }[];
  const urlList = items.map((i) => toAbsoluteUrl(i.path));

  let submitted = 0;
  let ok = true;
  if (key) {
    const res = await submitToIndexNow({ urls: urlList, key });
    ok = res.ok;
    submitted = res.submitted;
  } else {
    // No key configured: still ping sitemaps (helps discovery).
    await pingSitemaps();
  }

  if (items.length) {
    // Mark as submitted even if API is flaky; discovery still happens via sitemap ping.
    try {
      const now = new Date().toISOString();
      const statements = items.map((i) =>
        db.prepare(`UPDATE indexing_queue SET submitted_at = ? WHERE id = ?`).bind(now, i.id)
      );
      await db.batch(statements);
    } catch {
      // ignore
    }
  }

  return { ok, attempted: items.length, submitted };
}

