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
  "lawyer": "/use-case/lawyer-headshots",
  "twitch": "/use-case/twitch-streamer-avatars",
  "medical": "/use-case/doctor-medical-portraits",
  "founder": "/use-case/tech-founder-headshots",
  "financial advisor": "/use-case/financial-advisor-portraits",
  "sales team": "/use-case/sales-team-headshots",
  "product manager": "/use-case/product-manager-photos",
  "architect": "/use-case/architect-designer-portraits",
  "athlete": "/use-case/dancer-athlete-photos",
  "podcast": "/use-case/podcast-host-avatars",
  "virtual assistant": "/use-case/virtual-assistant-headshots",
  "ecommerce": "/use-case/ecommerce-seller-portraits",
  "journalist": "/use-case/journalist-writer-photos",
  "wellness": "/use-case/yoga-wellness-portraits",
  
  // Glossary / Technical (TOPICAL AUTHORITY)
  "pulid": "/glossary/pulid",
  "lora": "/glossary/lora",
  "sdxl": "/glossary/sdxl",
  "identity-lock": "/glossary/identity-lock",
  "inference": "/glossary/inference-steps",
  "latent space": "/glossary/latent-space",
  "upscaling": "/glossary/upscaling",

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
