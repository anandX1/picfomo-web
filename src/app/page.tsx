import type { Metadata } from "next";
import MarketingClient from "./MarketingClient";

export const metadata: Metadata = {
  title: "PicFomo Studio — Documentary Captions & Multi-Track NLE Engine",
  description:
    "Generate kinetic pop documentary captions with syntactic pacing. 1-click multi-track keyframe export for Premiere Pro, DaVinci Resolve, and After Effects. 100% local privacy.",
  alternates: {
    canonical: "https://www.picfomo.com",
  },
  openGraph: {
    title: "PicFomo Studio — Documentary Captions & Multi-Track NLE Engine",
    description:
      "Kinetic pop, syntactic pacing, and multi-track exports for Premiere Pro, DaVinci Resolve, and After Effects.",
    url: "https://www.picfomo.com",
    siteName: "PicFomo Studio",
    type: "website",
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PicFomo Studio",
    operatingSystem: "Windows, macOS, Linux",
    applicationCategory: "MultimediaApplication",
    offers: {
      "@type": "Offer",
      price: "49",
      priceCurrency: "INR",
    },
    description:
      "Documentary captions with syntactic pacing and multi-track exports for Premiere Pro, DaVinci Resolve, and After Effects.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MarketingClient />
    </>
  );
}
