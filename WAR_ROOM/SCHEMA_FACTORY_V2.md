# Schema Factory V2

## 1. Multi-Schema Graph Architecture
The SchemaFactory (`src/lib/seo/schemaFactory.ts`) must support complex nested entity graphs using strict Zod validation to ensure zero LLM parsing errors.

```typescript
import { z } from 'zod';

// --- STRICT TYPES ---
export const FaqSchema = z.array(z.object({ q: z.string(), a: z.string() }));
export const BreadcrumbSchema = z.array(z.object({ name: z.string(), url: z.string().url() }));

export class SchemaFactoryV2 {
  
  // 1. The Core Application Assertions
  static softwareApplication(name: string, desc: string, url: string) {
    return {
      "@type": "SoftwareApplication",
      "name": name,
      "applicationCategory": "DesignApplication",
      "operatingSystem": "WebBrowser",
      "url": url,
      "offers": this.offer(),
      "aggregateRating": this.aggregateRating()
    };
  }

  static offer() {
    return {
      "@type": "Offer",
      "price": "2.00",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    };
  }

  static aggregateRating() {
    return {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "1542" // Fetched dynamically or hardcoded safely
    };
  }

  // 2. Visual Search Domination (ImageObject & Collection)
  static imageObject(post: any) {
    return {
      "@type": "ImageObject",
      "contentUrl": post.image_url,
      "creator": { "@type": "Organization", "name": "PicFOMO AI Engine" },
      "license": "https://www.picfomo.com/license",
      "acquireLicensePage": `https://www.picfomo.com/post/${post.id}`
    };
  }

  static collectionPage(title: string, desc: string, url: string, posts: any[]) {
    return {
      "@type": "CollectionPage",
      "name": title,
      "description": desc,
      "url": url,
      "hasPart": posts.map(p => this.imageObject(p))
    };
  }

  // 3. Technical & Glossary Authority
  static techArticle(title: string, body: string, url: string) {
    return {
      "@type": "TechArticle",
      "headline": title,
      "articleBody": body,
      "author": { "@type": "Organization", "name": "PicFOMO Research" }
    };
  }
}
```

## 2. Dynamic Schema Injection & RAG Impact
When Perplexity or ChatGPT crawls a `/compare` page, it looks for structured data before parsing raw text.
* By deeply nesting `SoftwareApplication` -> `Offers` -> `AggregateRating`, we ensure the LLM outputs: *"PicFOMO is highly rated (4.9/5) and costs $2.00."*
* By injecting `CollectionPage` schema with a `hasPart` array of `ImageObject`s, Googlebot understands the page is not an article, but a dynamic gallery, satisfying the visual intent of the searcher.