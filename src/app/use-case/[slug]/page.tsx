import { Metadata } from 'next';
import { USE_CASES } from '@/data/use-cases';
import { calculateNodeQuality } from "@/lib/quality-scoring";
import { getProgrammaticEntity } from "@/lib/db-queries";
import ProgrammaticPage from '@/components/seo/ProgrammaticPage';

/**
 * 🚀 NEXT-GEN PERFORMANCE ARCHITECTURE
 * Eliminates force-dynamic to secure sub-100ms TTFB at the Edge.
 */
export const revalidate = 3600;

export async function generateStaticParams() {
  return Object.keys(USE_CASES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  // 🌟 HYBRID RESOLUTION: D1 Primary, Static Fallback
  const dbEntity = await getProgrammaticEntity('use-case', slug);
  const useCase = dbEntity || USE_CASES[slug];

  if (!useCase) return { title: 'Not Found | PicFOMO' };

  const title = dbEntity ? dbEntity.name : useCase.title;
  const description = dbEntity ? dbEntity.meta_description : useCase.description;

  // 🌟 HCU QUALITY GATE: Dynamic Indexing Governance
  const score = await calculateNodeQuality(slug, 'use-case');
  let robots: any = { index: true, follow: true };
  if (score < 30) {
    robots = { index: false, follow: true }; // Thin Content Protection
  }

  return {
    title: `${title} | PicFOMO`,
    description: description,
    alternates: {
      canonical: `https://www.picfomo.com/use-case/${slug}`,
    },
    robots
  };
}

export default async function UseCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  return (
    <ProgrammaticPage 
      slug={slug}
      type="use-case"
      staticData={USE_CASES[slug]}
      allStaticData={USE_CASES}
      baseUrl="https://www.picfomo.com"
    />
  );
}
