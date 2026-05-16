# Visual Search Expansion

## 1. Image Cluster Architecture
In the AI portrait space, Google Image Search, Google Lens, and Pinterest represent up to 40% of potential discovery traffic. To dominate, images cannot be treated as decorative assets; they must be treated as indexable semantic entities.

## 2. Semantic Alt Text Formulas
Do not write generic alt text. Alt text must be generated procedurally based on the intersection of the entity nodes.
* **Formula:** `[Aesthetic] AI generated portrait of a [Gender] [Profession], created in 20 seconds using PicFOMO Identity-Lock.`
* **Example:** `Cinematic teal and orange AI generated portrait of a female software engineer, created in 20 seconds using PicFOMO Identity-Lock.`

## 3. Google Lens & EXIF Optimization
Google Lens clusters visually similar images and extracts text/metadata.
* **The Implementation:** We will expand the piexifjs pipeline in `/api/generate` to inject:
  * `Software`: "PicFOMO AI Engine - Identity-Lock"
  * `Description`: The full prompt used to generate the image.
  * `Copyright`: "Generated on PicFOMO.com"
* **Licensing Schema:** Every image injected into the DOM must be wrapped in `ImageObject` schema with the `acquireLicensePage` property pointing back to PicFomo. This forces a "Licensable" badge in Google Images, dramatically increasing CTR by appearing authoritative.

## 4. OpenGraph Psychological CTR Systems
When programmatic pages or specific posts are shared on LinkedIn, X, or Slack, the OpenGraph image is the only conversion lever.
* **Dynamic OG API (`/api/og`):** We must build a Vercel `ImageResponse` endpoint.
* **The Output:** A 1200x630 image split down the middle.
  * *Left Side:* Blurry silhouette or a raw selfie. Text overlay: "INPUT: 1 Selfie"
  * *Right Side:* The 4K PicFomo generation. Text overlay: "OUTPUT: 20 Seconds"
* **Psychological Impact:** This visual "Delta" triggers FOMO (Fear Of Missing Out) and status anxiety in the viewer, immediately proving the product's value without requiring a click.

## 5. Pinterest & TikTok Visual Discovery Loops
* **Pinterest Integration:** Add native `data-pin-url` and `data-pin-media` tags to every image in the `<CommunityGrid>`. This allows users to easily pin aesthetics to their mood boards. Pinterest traffic is highly persistent and compounds over years.
* **TikTok Trend Matching:** Programmatic `/aesthetic/*` pages must map directly to current TikTok micro-trends (e.g., "Mob Wife Aesthetic", "Old Money Core"). As users search Google Images for examples of these TikTok trends, PicFomo's optimized `ImageObjects` will hijack the SERP.