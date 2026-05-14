import Link from 'next/link';
import React from 'react';

/**
 * 🌟 PicFOMO INTERNAL LINKING FLYWHEEL
 * Automatically interlinks keywords in blog posts and guides to relevant landing pages.
 * This builds "Topic Clusters" which Google rewards with higher E-E-A-T scores.
 */

const SEO_KEYWORD_MAP: Record<string, string> = {
  // Styles
  "ghibli": "/style/ghibli",
  "dslr": "/style/dslr",
  "cyberpunk": "/style/cyberpunk",
  "vogue": "/style/vogue",
  "anime": "/style/anime",
  
  // Use-Cases
  "real estate": "/use-case/real-estate-headshots",
  "dating profile": "/use-case/dating-profile-photos",
  "linkedin": "/use-case/linkedin-profile-pictures",
  "headshots": "/use-case/acting-headshots",
  
  // Comparisons
  "aragon": "/compare/picfomo-vs-aragon-ai",
  "photo ai": "/compare/picfomo-vs-photo-ai",
};

export function InterlinkContent({ text }: { text: string }) {
  if (!text) return null;

  // Sort keywords by length descending to prevent partial matches (e.g., "dating" vs "dating profile")
  const keywords = Object.keys(SEO_KEYWORD_MAP).sort((a, b) => b.length - a.length);
  
  // Regex to match any of the keywords (case insensitive, word boundaries)
  const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
  
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, i) => {
        const lowerPart = part.toLowerCase();
        const link = SEO_KEYWORD_MAP[lowerPart];
        
        if (link) {
          return (
            <Link 
              key={i} 
              href={link} 
              className="text-[var(--color-gold)] font-medium hover:underline decoration-[var(--color-gold)] underline-offset-4"
            >
              {part}
            </Link>
          );
        }
        
        return part;
      })}
    </>
  );
}
