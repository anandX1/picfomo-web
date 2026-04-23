import { getCloudflareContext } from "@opennextjs/cloudflare";
import StudioUI from "./StudioUI";

// 🌟 THE MAGIC FIX: Tells Next.js to NEVER cache this page stale!
// Ensures the page updates instantly when you add/rearrange styles in Admin
export const dynamic = "force-dynamic";
export const revalidate = 0; 

export default async function StudioPage() {
  const db = ((await getCloudflareContext({ async: true })).env.DB as any as D1Database);

  // 🌟 FIX: We explicitly ORDER BY sort_order ASC so your drag-and-drop order reflects here!
  // Note: I added 'description' to the SELECT so the Studio UI can display the text details properly.
  const { results } = await db.prepare(`
    SELECT id, name, description, spark_cost, preview_image_url, preview_urls, badge 
    FROM styles 
    WHERE is_active = 1 AND id != 'schnell' 
    ORDER BY sort_order ASC, created_at DESC
  `).all();

  // Clean up the data to safely handle the JSON array of images we built in the Admin panel
  const dynamicStyles = results.map((style: any) => {
    let images: string[] = [];
    try { images = JSON.parse(style.preview_urls || '[]'); } catch(e) {}
    
    return {
      ...style,
      // 🌟 Map the first image in the array to preview_image_url so StudioUI reads it perfectly
      preview_image_url: images[0] || style.preview_image_url 
    };
  });

  return <StudioUI dynamicStyles={dynamicStyles} />;
}