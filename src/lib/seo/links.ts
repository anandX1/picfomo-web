import { USE_CASES } from "@/data/use-cases";
import { GLOSSARY_TERMS } from "@/data/glossary";
import { PLATFORMS } from "@/data/platforms";
import { PROBLEMS } from "@/data/problems";

/**
 * 🔗 PICFOMO LINK DICTIONARY
 * Master mapping of keywords to URLs for automated internal linking.
 */

export const SEMANTIC_LINKS = [
  // Manual High-Authority Links
  { keyword: "Identity-Lock", url: "/glossary/identity-lock" },
  { keyword: "PuLID", url: "/glossary/pulid" },
  { keyword: "SDXL", url: "/glossary/sdxl" },
  { keyword: "AI Headshots", url: "/use-case/linkedin-profile-pictures" },
  { keyword: "AI Portraits", url: "/styles" },
  
  // Dynamic Use Cases
  ...Object.entries(USE_CASES).map(([slug, uc]) => ({
    keyword: uc.title,
    url: `/use-case/${slug}`
  })),

  // Dynamic Platforms
  ...Object.entries(PLATFORMS).map(([slug, p]) => ({
    keyword: p.title,
    url: `/platform/${slug}`
  })),

  // Dynamic Problems
  ...Object.entries(PROBLEMS).map(([slug, pr]) => ({
    keyword: pr.title,
    url: `/problems/${slug}`
  })),

  // Dynamic Glossary Terms
  ...Object.entries(GLOSSARY_TERMS).map(([slug, term]) => ({
    keyword: term.term,
    url: `/glossary/${slug}`
  }))
];
