# Visual Search Domination System

## 1. The State of Visual Search
For the query "AI headshots," Google displays an Image Pack *above* the traditional blue links. Furthermore, Google Lens and Pinterest are massive discovery engines for aesthetic queries ("Old money AI portrait"). Dominating visual search is as critical as dominating text search.

## 2. Image Naming & EXIF Strategy
Google cannot "see" images perfectly; it reads the metadata.
* **The Mistake:** Outputting files as `generation_12345.webp`.
* **The Architecture:** Every generation must be procedurally renamed based on its semantic context before being served.
  * Format: `picfomo-[style-slug]-[use-case-slug]-ai-headshot-[id].webp`
  * Example: `picfomo-corporate-dslr-lawyer-ai-headshot-9821.webp`
* **EXIF Injection:** If possible, inject metadata into the WebP file headers detailing the software (`PicFomo AI Engine`) and copyright to establish algorithmic authorship.

## 3. Alt-Text & Surrounding Context
Google Image algorithms rely heavily on the text *surrounding* the image.
* **Alt-Text:** Must be highly descriptive, not spammy. 
  * *Bad:* "AI headshot picfomo best."
  * *Good:* "A cinematic AI-generated headshot of a female software engineer, created using PicFomo's Identity-Lock technology."
* **Contextual Proximity:** On the `/post/[id]` page, the H1, the user's prompt/style tag, and the image must be within the same HTML semantic block (`<figure>` and `<figcaption>`).

## 4. OpenGraph Psychology & Social CTR
When a `/post/[id]` is shared on LinkedIn or Twitter, the image is the only thing that matters.
* **The "Magic Trick" Layout:** The OG image should be dynamically generated via Vercel/Cloudflare OG Image generation. It must display a split-screen: 
  * Left side: A stylized outline of a selfie with text "1 Selfie."
  * Right side: The stunning 4K output with text "20 Seconds."
* **Psychological Trigger:** This layout incites "The Delta Fascination" (curiosity about the transformation) and promises instant gratification.

## 5. Pinterest & TikTok Visual Discovery
* **Pinterest Integration:** Add native "Pin It" buttons to all `/explore` feed posts. Pinterest acts as a massive visual search engine for queries like "Headshot poses" or "Professional aesthetic."
* **TikTok Trend Hijacking:** Styles named after TikTok micro-trends ("90s Yearbook", "Mob Wife Aesthetic") will naturally surface in visual searches when TikTokers search Google Images for reference material.

## 6. Visual Schema Engine
Every `/post/[id]` and `/style/[slug]` page must deploy strict `ImageObject` schema.
* Required properties: `contentUrl`, `creator` (PicFomo), `license`, `acquireLicensePage`. 
* **The Licensing Hack:** By declaring a license page, Google Images will display a "Licensable" badge over PicFomo images in image search, instantly increasing CTR and trust by making the image appear official and institutional.