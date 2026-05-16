import Link from 'next/link';
import React from 'react';
import { SEMANTIC_LINKS } from '@/lib/seo/links';

/**
 * 🔗 PicFOMO INTERNAL LINKING FLYWHEEL
 * Automatically interlinks keywords in blog posts and guides to relevant landing pages.
 * This builds "Topic Clusters" which Google rewards with higher E-E-A-T scores.
 */

export function InterlinkContent({ text }: { text: string }) {
  if (!text) return null;

  // Sort keywords by length descending to prevent partial matches
  const sortedLinks = [...SEMANTIC_LINKS].sort((a, b) => b.keyword.length - a.keyword.length);
  
  let processedText: (string | JSX.Element)[] = [text];

  sortedLinks.forEach(({ keyword, url }) => {
    const newProcessedText: (string | JSX.Element)[] = [];

    processedText.forEach((part) => {
      if (typeof part !== 'string') {
        newProcessedText.push(part);
        return;
      }

      // Use word boundaries to prevent matching parts of words
      const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
      const segments = part.split(regex);

      segments.forEach((segment, i) => {
        if (segment.toLowerCase() === keyword.toLowerCase()) {
          newProcessedText.push(
            <Link 
              key={`${keyword}-${i}`} 
              href={url} 
              className="text-[var(--color-gold)] font-medium hover:underline decoration-dotted underline-offset-4"
            >
              {segment}
            </Link>
          );
        } else if (segment !== '') {
          newProcessedText.push(segment);
        }
      });
    });

    processedText = newProcessedText;
  });

  return <>{processedText}</>;
}
