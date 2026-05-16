import { Metadata } from 'next';
import { PROBLEMS } from '@/data/problems';
import { calculateNodeQuality } from "@/lib/quality-scoring";
import { getProgrammaticEntity } from "@/lib/db-queries";
import ProgrammaticPage from '@/components/seo/ProgrammaticPage';

/**
 * 🚀 NEXT-GEN PERFORMANCE ARCHITECTURE
 */
export const revalidate = 3600;

export async function generateStaticParams() {
  return Object.keys(PROBLEMS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  const dbEntity = await getProgrammaticEntity('problem', slug);
  const problem = dbEntity || PROBLEMS[slug];

  if (!problem) return { title: 'Not Found | PicFOMO' };

  const title = dbEntity ? dbEntity.name : problem.title;
  const description = dbEntity ? dbEntity.meta_description : problem.description;

  const score = await calculateNodeQuality(slug, 'problem');
  let robots: any = { index: true, follow: true };
  if (score < 30) {
    robots = { index: false, follow: true };
  }

  return {
    title: `${title} | PicFOMO`,
    description: description,
    alternates: {
      canonical: `https://www.picfomo.com/problems/${slug}`,
    },
    robots
  };
}

export default async function ProblemPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  return (
    <ProgrammaticPage 
      slug={slug}
      type="problem"
      staticData={PROBLEMS[slug]}
      allStaticData={PROBLEMS}
      baseUrl="https://www.picfomo.com"
    />
  );
}
