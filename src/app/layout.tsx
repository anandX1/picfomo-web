import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import ClientLayout from "./ClientLayout";
import { SchemaFactory } from "@/lib/seo/schemaFactory";

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  themeColor: '#050508',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.picfomo.com'),
  title: {
    default: "PicFomo Studio — Documentary Captions & NLE Automation Engine",
    template: "%s | PicFomo Studio"
  },
  description: "Kinetic pop captions, syntactic word pacing, and multi-track exports for Premiere Pro, DaVinci Resolve, and After Effects. 100% local on-device privacy.",
  keywords: ["documentary captions", "after effects captions", "premiere pro captions", "davinci resolve srt", "kinetic pop captions", "picfomo studio"],
  authors: [{ name: "PicFomo Technologies" }],
  creator: "PicFomo Technologies",
  publisher: "PicFomo Technologies",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "PicFomo Studio — Documentary Captions & NLE Engine",
    description: "Multi-track keyframe captioning for Premiere Pro, After Effects, and DaVinci Resolve. Runs 100% locally on your PC.",
    url: "https://www.picfomo.com",
    siteName: "PicFomo Studio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const globalSchema = {
    "@context": "https://schema.org",
    "@graph": [
      SchemaFactory.organization(),
      SchemaFactory.website()
    ]
  };

  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
        />
      </head>
      <body className="antialiased bg-[#050508] text-white selection:bg-[#FF4F81] selection:text-white">
        <ClientLayout>
          {children}
        </ClientLayout>
        <Toaster position="bottom-center" theme="dark" richColors />
      </body>
    </html>
  );
}
