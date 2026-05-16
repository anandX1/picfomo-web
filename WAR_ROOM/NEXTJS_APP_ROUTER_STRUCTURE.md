# Next.js App Router Structure

## 1. Scalable Folder Architecture
To support mass scale without triggering route compilation limits, the programmatic architecture splits intents into distinct App Router directories. Each directory implements strict `dynamicParams` and ISR logic.

```text
src/app/
├── use-case/[slug]/page.tsx      (Broad intent: e.g. "Lawyer")
├── platform/[slug]/page.tsx      (Navigational intent: e.g. "LinkedIn")
├── identity/[slug]/page.tsx      (Creator intent: e.g. "Tech Founder")
├── aesthetic/[slug]/page.tsx     (Visual intent: e.g. "Old Money")
├── compare/[slug]/page.tsx       (Transactional intent: e.g. "picfomo-vs-aragon")
├── problems/[slug]/page.tsx      (Friction intent: e.g. "blurry-selfie")
├── glossary/[slug]/page.tsx      (Technical intent: e.g. "identity-lock")
```

## 2. Route Handler Implementation Standards
Every programmatic `page.tsx` must adhere to this exact structural contract:

```tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProgrammaticEntity, getRelatedPosts } from '@/lib/db-queries';
import { REVALIDATE_TIMERS } from '@/lib/cache';
import { SchemaFactory } from '@/lib/seo/schemaFactory';

// 🌟 ISR STRATEGY: Cached heavily, revalidated cleanly.
export const revalidate = REVALIDATE_TIMERS.programmatic; // 3600s (1 hour)

// 🌟 BUILD-TIME PRE-RENDERING (Partial)
// Only pre-render the top 100 highest-traffic nodes to keep build times under 2 mins.
// Remaining 900+ nodes are generated on-demand via ISR.
export async function generateStaticParams() {
  return [ { slug: "lawyer" }, { slug: "linkedin" }, /* ... top 100 */ ];
}

// 🌟 DYNAMIC METADATA & CANONICAL LOGIC
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entity = await getProgrammaticEntity('use-case', slug);
  if (!entity) return {};

  return {
    title: \`Instant \${entity.name} AI Headshots | PicFOMO Identity-Lock™\`,
    description: entity.meta_description,
    alternates: {
      canonical: \`https://www.picfomo.com/use-case/\${slug}\`, // Prevents faceted bloat
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  };
}

export default async function ProgrammaticPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entity = await getProgrammaticEntity('use-case', slug);
  if (!entity) return notFound();

  // 🌟 PARALLEL EDGE FETCHING (TTFB Optimization)
  const [posts, relatedEntities] = await Promise.all([
    getRelatedPosts(entity.id),
    getRelatedEntities(entity.id)
  ]);

  // 🌟 SCHEMA INJECTION
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      SchemaFactory.softwareApplication(entity.name, entity.meta_description, \`https://www.picfomo.com/use-case/\${slug}\`),
      SchemaFactory.faqPage(entity.faqs),
      SchemaFactory.breadcrumbList([...])
    ]
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Dynamic Render Boundary for heavy feeds */}
      <Suspense fallback={<GridSkeleton />}>
        <CommunityGrid posts={posts} />
      </Suspense>
    </main>
  );
}
```

## 3. Rendering Boundaries & Cache Tags
* **ISR Fallbacks:** If `getProgrammaticEntity` throws a DB timeout, it is wrapped in a `try/catch` that returns `null`, triggering `notFound()`. Googlebot receives a 404 instead of a 500, preserving crawl health.
* **Cache Tagging:** All programmatic queries use tags: `['programmatic', 'entity-[id]']`. When an entity is updated in the DB, a webhook calls `revalidateTag('entity-[id]')`.
* **Suspense Architecture:** The `CommunityGrid` (fetching 12+ images) is wrapped in `<Suspense>`. The server instantly flushes the HTML `<head>` (Metadata, Schema) and Hero section to Googlebot in sub-50ms. The grid HTML streams in immediately after.