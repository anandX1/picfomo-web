import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = "nodejs";

export async function GET() {
  const env: any = (await getCloudflareContext({ async: true })).env;
  const key = (env.INDEXNOW_KEY as string | undefined) ?? process.env.INDEXNOW_KEY ?? "";

  return new Response(key, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=86400",
    },
  });
}

