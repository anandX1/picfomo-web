import { Metadata } from 'next';
import GlossaryClient from './GlossaryClient';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import { GLOSSARY_TERMS } from '@/data/glossary';

export const metadata: Metadata = {
  title: 'AI Glossary | Deep-Dive AI Portrait Technology | PicFOMO',
  description: 'Understand the technology behind the magic. A comprehensive glossary of AI terms including PuLID, Identity-Lock, LoRA, and more.',
  alternates: {
    canonical: 'https://www.picfomo.com/glossary',
  },
  openGraph: {
    title: 'AI Glossary | The Tech Behind PicFOMO',
    description: 'Deep definitions for the core concepts of generative AI portraiture.',
    images: [{ url: 'https://www.picfomo.com/logo2.png' }],
  }
};

export default function GlossaryPage() {
  // 🌟 Schema.org for DefinedTermSet
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "name": "PicFOMO AI Glossary",
    "description": "A comprehensive guide to generative AI terms used in professional portrait synthesis.",
    "hasDefinedTerm": Object.values(GLOSSARY_TERMS).map(term => ({
      "@type": "DefinedTerm",
      "name": term.term,
      "description": term.definition,
      "url": `https://www.picfomo.com/glossary/${term.slug}`
    }))
  };

  return (
    <main className="min-h-screen bg-[var(--color-page-bg)] text-[var(--color-page-text)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <div className="pt-32 pb-20">
        <GlossaryClient initialTerms={GLOSSARY_TERMS} />
      </div>
      <Footer />
    </main>
  );
}
