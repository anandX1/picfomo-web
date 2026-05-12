import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drainIndexingQueue } from "@/utils/indexing";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { env } = await getCloudflareContext({ async: true });

    const secret = (env.INDEXING_CRON_SECRET as string | undefined) ?? process.env.INDEXING_CRON_SECRET;
    const headerSecret = req.headers.get("x-indexing-secret") ?? "";
    if (secret && headerSecret !== secret) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) as any;
    const limit = Math.max(1, Math.min(100, Number(body?.limit ?? 50)));

    const key = (env.INDEXNOW_KEY as string | undefined) ?? process.env.INDEXNOW_KEY;
    const db = env.DB as any;

    const res = await drainIndexingQueue(db, limit, key);
    return NextResponse.json({ ok: true, ...res });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Indexing failed" }, { status: 500 });
  }
}

