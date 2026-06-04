import { PostEntity, StyleEntity, UseCaseEntity, GlossaryTermEntity, BlogPostEntity } from '../schema';

/**
 * PICFOMO SCHEMA FACTORY V2
 * Engineers high-authority JSON-LD for Googlebot and LLM Retrieval.
 */

export class SchemaFactory {
  static website() {
    return {
      "@type": "WebSite",
      "@id": "https://www.picfomo.com/#website",
      "url": "https://www.picfomo.com/",
      "name": "PicFOMO",
      "description": "Your Best DP is 20 Seconds Away. Drop your photo, pick a trending style.",
      "potentialAction": [
        {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://www.picfomo.com/explore?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      ]
    };
  }

  static organization() {
    return {
      "@type": "Organization",
      "@id": "https://www.picfomo.com/#organization",
      "name": "PicFOMO",
      "url": "https://www.picfomo.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.picfomo.com/logo-square.png"
      },
      "sameAs": [
        "https://twitter.com/picfomo",
        "https://instagram.com/picfomo"
      ]
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
      "reviewCount": "1542"
    };
  }

  static softwareApplication(name: string, description: string, url: string) {
    return {
      "@type": "SoftwareApplication",
      "name": name,
      "description": description,
      "applicationCategory": "DesignApplication",
      "operatingSystem": "WebBrowser",
      "url": url,
      "offers": this.offer(),
      "aggregateRating": this.aggregateRating()
    };
  }

  static imageObject(post: PostEntity) {
    return {
      "@type": "ImageObject",
      "name": post.title || `${post.style_name || 'AI'} Portrait`,
      "description": post.description || `AI generated portrait by ${post.username || 'PicFOMO user'}`,
      "contentUrl": post.image_url,
      "datePublished": post.created_at,
      "author": {
        "@type": "Person",
        "name": post.display_name || post.username || "PicFOMO Creator",
        "url": post.username ? `https://www.picfomo.com/u/${post.username}` : undefined
      },
      "license": "https://www.picfomo.com/license",
      "acquireLicensePage": `https://www.picfomo.com/post/${post.id}`,
      "isPartOf": {
        "@type": "WebSite",
        "name": "PicFOMO",
        "url": "https://www.picfomo.com/",
      },
    };
  }

  static collectionPage(title: string, desc: string, url: string, posts: PostEntity[]) {
    return {
      "@type": "CollectionPage",
      "name": title,
      "description": desc,
      "url": url,
      "hasPart": posts.map(p => this.imageObject(p))
    };
  }

  static itemList(name: string, description: string, items: any[]) {
    return {
      "@type": "ItemList",
      "name": name,
      "description": description,
      "numberOfItems": items.length,
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": item
      }))
    };
  }

  static faqPage(faqs: {q: string, a: string}[]) {
    return {
      "@type": "FAQPage",
      "mainEntity": faqs.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
    };
  }

  static breadcrumbList(items: {name: string, url: string}[]) {
    return {
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url
      }))
    };
  }

  static blogPosting(post: BlogPostEntity) {
    return {
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": new Date(post.date).toISOString(),
      "author": {
        "@type": "Person",
        "name": post.author,
        "url": "https://www.picfomo.com/blog"
      },
      "publisher": this.organization(),
      "image": "https://www.picfomo.com/hero/8.webp",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://www.picfomo.com/blog/${post.slug}`
      }
    };
  }

  static definedTerm(term: GlossaryTermEntity) {
    return {
      "@type": "DefinedTerm",
      "name": term.term,
      "description": term.definition,
      "inDefinedTermSet": "https://www.picfomo.com/glossary"
    };
  }

  static techArticle(title: string, description: string, url: string) {
    return {
      "@type": "TechArticle",
      "headline": title,
      "description": description,
      "url": url,
      "author": {
        "@type": "Organization",
        "name": "PicFOMO Research"
      },
      "publisher": this.organization()
    };
  }
}
