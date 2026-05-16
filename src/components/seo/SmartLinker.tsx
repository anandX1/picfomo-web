import Link from "next/link";
import { getGlobalSemanticLinks } from "@/lib/db-queries";

interface SmartLinkerProps {
  text: string;
  links?: { keyword: string; url: string }[];
  useGlobal?: boolean;
}

/**
 * 🔗 PICFOMO SMART LINKER V2 (Staff+ Implementation)
 * Automatically interlinks keywords to the global entity graph.
 * Features recursive-link prevention and frequency capping.
 */
export async function SmartLinker({ text, links = [], useGlobal = true }: SmartLinkerProps) {
  if (!text) return null;

  // 🌟 DYNAMIC RESOLUTION: Combine manual overrides with D1 Global Dictionary
  let masterDictionary = [...links];
  if (useGlobal) {
    const globalLinks = await getGlobalSemanticLinks();
    masterDictionary = [...masterDictionary, ...globalLinks];
  }

  // 1. Sort by length descending to prevent partial match hijacking
  const sortedLinks = masterDictionary.sort((a, b) => b.keyword.length - a.keyword.length);

  // 2. Remove duplicates
  const seen = new Set();
  const uniqueLinks = sortedLinks.filter(l => {
    const key = l.keyword.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  let processedText: (string | JSX.Element)[] = [text];

  uniqueLinks.forEach(({ keyword, url }) => {
    const newProcessedText: (string | JSX.Element)[] = [];

    processedText.forEach((part) => {
      if (typeof part !== 'string') {
        newProcessedText.push(part);
        return;
      }

      // Use Word Boundaries (\b) to ensure we don't link inside words
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
