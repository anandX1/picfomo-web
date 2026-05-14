import { Metadata } from 'next';
import GraderClient from './GraderClient';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';

export const metadata: Metadata = {
  title: 'Free AI Selfie Grader | Rate Your Profile Picture | PicFOMO',
  description: 'Is your profile picture holding you back? Use our free AI Selfie Grader to audit your lighting, composition, and professional appeal in 20 seconds.',
  alternates: {
    canonical: 'https://www.picfomo.com/grader',
  },
  openGraph: {
    title: 'Free AI Selfie Grader | Audit Your Best DP',
    description: 'Get an instant AI score for your profile picture. Perfect for LinkedIn, Tinder, and Social Media.',
    images: [{ url: 'https://www.picfomo.com/logo2.png' }], // Fallback to logo for now
  }
};

export default function GraderPage() {
  // 🌟 Schema.org for Tool
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PicFOMO AI Selfie Grader",
    "description": "An AI-powered tool to rate profile pictures for lighting, composition, and professional appeal.",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "url": "https://www.picfomo.com/grader",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-page-bg)] text-[var(--color-page-text)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <div className="pt-24 pb-20">
        <GraderClient />
      </div>
      <Footer />
    </main>
  );
}
