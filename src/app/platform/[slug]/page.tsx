import { Metadata } from 'next';
import { PLATFORMS } from '@/data/platforms';
import { calculateNodeQuality } from "@/lib/quality-scoring";
import { getProgrammaticEntity } from "@/lib/db-queries";
import ProgrammaticPage from '@/components/seo/ProgrammaticPage';

/**
 * 🚀 NEXT-GEN PERFORMANCE ARCHITECTURE
 */
export const revalidate = 3600;

export async function generateStaticParams() {
  return Object.keys(PLATFORMS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  const dbEntity = await getProgrammaticEntity('platform', slug);
  const platform = dbEntity || PLATFORMS[slug];

  if (!platform) return { title: 'Not Found | PicFOMO' };

  const title = dbEntity ? dbEntity.name : platform.title;
  const description = dbEntity ? dbEntity.meta_description : platform.description;

  const score = await calculateNodeQuality(slug, 'platform');
  let robots: any = { index: true, follow: true };
  if (score < 30) {
    robots = { index: false, follow: true };
  }

  return {
    title: `${title} | PicFOMO`,
    description: description,
    alternates: {
      canonical: `https://www.picfomo.com/platform/${slug}`,
    },
    robots
  };
}

export default async function PlatformPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  return (
    <ProgrammaticPage 
      slug={slug}
      type="platform"
      staticData={PLATFORMS[slug]}
      allStaticData={PLATFORMS}
      baseUrl="https://www.picfomo.com"
    />
  );
}
