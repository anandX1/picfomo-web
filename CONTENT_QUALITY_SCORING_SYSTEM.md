# Programmatic Content Quality System

## 1. Automated Scoring Engine
Google's Helpful Content System (HCU) relies on user-interaction signals and uniqueness. We will build a Next.js Edge Middleware scoring system that dynamically evaluates a node's quality and assigns its indexing state.

### The Scoring Algorithm (D1 Edge Worker)
```typescript
interface NodeQualityScore {
  imageUniqueness: number;    // 0-40 (Are the images reused across other nodes?)
  semanticDensity: number;    // 0-30 (Length and uniqueness of text content)
  freshness: number;          // 0-15 (Days since last new generated post)
  engagement: number;         // 0-15 (Click-throughs to generator)
}
```

## 2. Dynamic Indexing State Governance
Based on the `NodeQualityScore`, the Next.js `generateMetadata` function assigns the exact robot directives dynamically.

```typescript
// src/app/use-case/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const score = await calculateNodeQuality(params.slug);

  if (score >= 80) {
    // Elite Node: Index, Follow, High Priority
    return { robots: { index: true, follow: true } };
  } 
  else if (score >= 50 && score < 80) {
    // Maturing Node: Index, but lowered crawl priority (handled in sitemap)
    return { robots: { index: true, follow: true } };
  } 
  else if (score >= 30 && score < 50) {
    // Thin Content Warning: De-index to protect domain quality, but allow lateral crawl
    return { robots: { index: false, follow: true } };
  } 
  else {
    // Toxic Node (Stale > 90 days, no unique assets): Canonicalize or 410
    const parentNode = await getSemanticParent(params.slug);
    return {
      robots: { index: false, follow: false },
      alternates: { canonical: `https://www.picfomo.com/use-case/${parentNode}` }
    };
  }
}
```

## 3. Image Uniqueness Scoring
If `/use-case/lawyer` and `/use-case/attorney` pull the exact same 12 images from the database, Google Image algorithms will flag duplicate content.
* **Execution:** During the `getRelatedPostsForEntity` DB query, enforce a uniqueness lock.
```sql
-- D1 Query Modification
SELECT p.id, p.image_url 
FROM posts p
JOIN p_entity_styles es ON p.style_id = es.style_id
WHERE es.entity_id = ? AND p.is_public = 1
  -- Ensure this post isn't heavily featured on sibling nodes
  AND (SELECT COUNT(*) FROM p_entity_styles WHERE style_id = p.style_id) < 5
ORDER BY p.created_at DESC LIMIT 12;
```

## 4. AI Overview Eligibility Scoring
LLMs only retrieve data if it strictly answers a prompt.
* **Check:** Does this node contain an `<LLMCitationBlock>`?
* **Check:** Is the `schema_faqs` JSON valid?
* **Check:** Does the text contain empirical numbers (e.g., "20 seconds", "$2.00")?
* **Execution:** A background script flags nodes missing these elements as "LLM-Ineligible" and queues them for Groq/Llama-3 text enrichment.