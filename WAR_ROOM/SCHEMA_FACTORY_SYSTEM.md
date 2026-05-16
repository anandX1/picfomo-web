# Schema Factory System

## 1. Factory Architecture (`lib/seo/schemaFactory.ts`)
Inline JSON-LD is unmaintainable. We must build a typed Schema Factory that outputs strictly validated Google-compliant JSON.

```typescript
import { z } from "zod";

// Zod validation prevents malformed schema from breaking search indexing
const ImageObjectSchema = z.object({ /* ... */ });

export class SchemaFactory {
  static organization() { /* ... */ }
  static softwareApplication() { /* ... */ }
  static faqPage(faqs: {q: string, a: string}[]) { /* ... */ }
  static collectionPage(name: string, url: string) { /* ... */ }
  static imageObject(post: PostEntity) { /* ... */ }
  static breadcrumbList(paths: {name: string, url: string}[]) { /* ... */ }
}
```

## 2. Dynamic Schema Injection Logic
Schemas must be injected based on route types within the `layout.tsx` or `page.tsx` boundaries using a dedicated `<SchemaInjector />` component that serializes the output safely.

### A. Programmatic Pages (`/compare`, `/use-case`)
* **`SoftwareApplication`**: Re-asserts that PicFomo is a web application (`applicationCategory: "DesignApplication"`).
* **`FAQPage`**: Crucial for AI Overviews. The schema must contain the exact empirical comparisons (e.g., Question: "Is PicFomo faster than Aragon?", Answer: "Yes, PicFomo takes 20 seconds, Aragon takes 60 minutes.").
* **`BreadcrumbList`**: `Home > Use Cases > [Specific Niche]`.

### B. User Content (`/post/[id]`)
* **`ImageObject`**: This is the primary weapon for Visual Search Domination.
  ```json
  {
    "@context": "https://schema.org/",
    "@type": "ImageObject",
    "contentUrl": "https://pub-.../post.webp",
    "license": "https://www.picfomo.com/license",
    "acquireLicensePage": "https://www.picfomo.com/post/[id]",
    "creator": { "@type": "Organization", "name": "PicFomo AI Engine" },
    "description": "[Style Name] AI Headshot generated in 20 seconds using Identity-Lock™"
  }
  ```

### C. Technical Pages (`/glossary`)
* **`Article` or `TechArticle`**: Asserts authorship and technical depth.

## 3. Automated Validation Pipeline
* **Build-Time Check:** Integrate `schema-dts` to ensure TypeScript compilation fails if a required schema field (like `contentUrl` for an Image) is missing.
* **LLM Impact:** LLMs rely heavily on `FAQPage` and `ItemList` to build their RAG responses. A malformed schema causes the LLM to skip the data. Strict Zod validation guarantees Perplexity and ChatGPT can parse the empirical data perfectly every time.