import { getCloudflareContext } from "@opennextjs/cloudflare";
import StudioUI from "./StudioUI.tsx";

export const revalidate = 0; // Ensures the page updates instantly when you add styles in Admin

export default async function StudioPage() {
  const db = ((await getCloudflareContext({ async: true })).env.DB as any as D1Database);

  // Fetch only ACTIVE styles, excluding the fast 'schnell' model
  const { results } = await db.prepare(`
    SELECT id, name, spark_cost, preview_image_url, preview_urls, badge 
    FROM styles 
    WHERE is_active = 1 AND id != 'schnell' 
    ORDER BY created_at DESC
  `).all();

  // Clean up the data to safely handle the JSON array of images we built in the Admin panel
  const dynamicStyles = results.map((style: any) => {
    let images = [];
    try { images = JSON.parse(style.preview_urls || '[]'); } catch(e) {}
    return {
      ...style,
      mainImage: images[0] || style.preview_image_url // Fallback to old url if needed
    };
  });

  return <StudioUI dynamicStyles={dynamicStyles} />;
}