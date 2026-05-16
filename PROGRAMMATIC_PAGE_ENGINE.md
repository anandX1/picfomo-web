# Programmatic Page Engine

## 1. Engine Architecture
The core engine is a shared React layout and component matrix that dynamically interprets the DB entity and injects Anti-Thin Content safeguards.

```tsx
// src/components/seo/ProgrammaticTemplate.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getProgrammaticEntity, getRelatedPostsForEntity } from '@/lib/db-queries';
import { HeroHeader } from './HeroHeader';
import { CommunityGrid } from './CommunityGrid';
import { DynamicFAQ } from './DynamicFAQ';
import { LLMComparisonBait } from './LLMComparisonBait';
import { SmartLinker } from './SmartLinker';

export async function ProgrammaticTemplate({ slug, type }: { slug: string, type: string }) {
  const entity = await getProgrammaticEntity(type, slug);
  if (!entity) return notFound();

  const posts = await getRelatedPostsForEntity(entity.id);

  return (
    <div className="semantic-node-wrapper">
      <HeroHeader 
        h1={entity.h1_formula} 
        emotion={entity.emotional_hook} 
        heroImage={posts[0]?.image_url} 
      />
      
      {/* The Semantic Payload for Googlebot NLP */}
      <section className="semantic-description">
        <SmartLinker text={entity.meta_description} />
      </section>

      {/* The "Show Your Work" Proof Engine */}
      <Suspense fallback={<GridSkeleton />}>
        <CommunityGrid posts={posts} title={`Live ${entity.name} Generations`} />
      </Suspense>

      {/* RAG Bait for Perplexity/ChatGPT */}
      {type === 'compare' && <LLMComparisonBait metrics={entity.metrics_json} />}

      {/* Search Overview / PAA Optimization */}
      {entity.schema_faqs && <DynamicFAQ faqs={JSON.parse(entity.schema_faqs)} />}
    </div>
  );
}
```

## 2. Dynamic H1 & Emotional Hook Formulas
To avoid boilerplate penalties, programmatic H1s must be emotionally driven, not keyword-stuffed.
* **Bad:** `AI Headshots for Lawyers`
* **Good:** `Command Authority. Get High-Trust Corporate Portraits in 20 Seconds.`

The `h1_formula` field in the DB dictates the presentation:
* `{verb} {status}. Get {aesthetic} {entity} Portraits in 20 Seconds.`

## 3. Anti-Thin-Content Safeguards
Google's Helpful Content System (HCU) actively de-indexes programmatic folders that look like generated templates.
1. **The Visual Override:** A page is not "thin" if it serves as a high-utility image gallery. By injecting a grid of 12-24 *real* user generations (`CommunityGrid`), the page transforms from a text-spinner into a dynamic gallery application.
2. **The "Information Gain" Check:** If a node does not have at least 6 generated posts associated with its styles, the engine must return a `noindex` meta tag to prevent thin indexing.

```tsx
// Inside generateMetadata()
if (posts.length < 6) {
  return { robots: { index: false, follow: true } };
}
```