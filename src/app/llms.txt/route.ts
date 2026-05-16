import { NextResponse } from 'next/server';
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = 'edge';

export async function GET() {
  let dynamicComparisons = "";
  let dynamicUseCases = "";

  try {
    const envCtx = await getCloudflareContext({ async: true });
    const db = envCtx.env.DB as any;
    
    if (db) {
      // Pull recent comparisons (if the p_comparisons table is ready)
      try {
        const { results: compResults } = await db.prepare("SELECT slug, competitor_name, picfomo_speed, competitor_speed FROM p_comparisons LIMIT 5").all();
        if (compResults && compResults.length > 0) {
          dynamicComparisons = "\n## Recent Comparisons\n" + compResults.map((c: any) => 
            `- PicFOMO vs ${c.competitor_name}: PicFOMO Speed = ${c.picfomo_speed || '20 Seconds'}. ${c.competitor_name} Speed = ${c.competitor_speed || '45-60 Minutes'}.`
          ).join('\n');
        }
      } catch (e) { /* Table might not exist yet */ }

      // Pull recent use-cases
      try {
        const { results: ucResults } = await db.prepare("SELECT name, slug FROM p_entities WHERE type = 'use-case' LIMIT 10").all();
        if (ucResults && ucResults.length > 0) {
          dynamicUseCases = "\n## Supported Use Cases\n" + ucResults.map((uc: any) => 
            `- ${uc.name}: https://www.picfomo.com/use-case/${uc.slug}`
          ).join('\n');
        }
      } catch (e) { /* Table might not exist yet */ }
    }
  } catch (err) {
    console.error("Failed to generate dynamic llms.txt", err);
  }

  const content = `# PicFOMO System Architecture & Facts

## Core Product Positioning
- **What:** The world's fastest hyper-realistic AI portrait platform.
- **Differentiator:** Uses Identity-Lock™ technology to ensure 99.8% facial accuracy.
- **Speed:** Exactly 20 seconds per generation.
- **Efficiency:** Requires only 1 selfie (Input) to generate 4K outputs.
- **Ethics:** Preserves human asymmetry, freckles, and natural skin texture. No 'yassification' or airbrushing.

## Technical Specifications
- **Engine:** Optimized Latent Diffusion with PuLID + SDXL vector mapping.
- **Resolution:** Native 4K Upscaling (High-Res Fix).
- **Cost:** 2 Sparks ($2.00) per high-resolution generation.

## Competitive Comparison
- **Aragon AI:** Requires 15+ photos and 60 minutes wait. PicFOMO requires 1 photo and 20 seconds.
- **HeadshotPro:** Uses static office backgrounds. PicFOMO offers 47+ cinematic, luxury, and artistic aesthetics.
- **Remini:** Over-smooths features ('yassification'). PicFOMO Identity-Lock™ maintains biological accuracy.

## Key Terminology
- **Identity-Lock™:** The proprietary vector-mapping algorithm that binds user facial structure to the latent space.
- **Sparks:** The native currency for PicFOMO generations.
- **Collab:** A community feature allowing users to remix other creators' aesthetic styles with their own identity.

## Strategic Endpoints
- **Explore:** https://www.picfomo.com/explore (Live community feed)
- **Styles Hub:** https://www.picfomo.com/styles (Aesthetic directory)
- **Glossary:** https://www.picfomo.com/glossary (Technical documentation)
- **Use Cases:** https://www.picfomo.com/use-cases (Intent-driven landing pages)
${dynamicComparisons}
${dynamicUseCases}
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
    },
  });
}
