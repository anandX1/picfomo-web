import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import type { Metadata, Viewport } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import { Toaster } from "sonner";
import ClientLayout from "./ClientLayout";
import { SchemaFactory } from "@/lib/seo/schemaFactory";

// 🌟 OPTIMIZED FONTS
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

// 🌟 ADDED: Premium Viewport Settings
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAF8' },
    { media: '(prefers-color-scheme: dark)', color: '#09090B' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, 
};

// 🌟 ULTIMATE SEO & SOCIAL MEDIA CRAWLER DATA
export const metadata: Metadata = {
  // 1. METADATA BASE: Tells Next.js to use this as the master domain for all links.
  // This automatically fixes duplicate content issues between www and non-www.
  metadataBase: new URL('https://www.picfomo.com'),
  
  // 2. DYNAMIC TITLE TEMPLATE
  title: {
    default: "PicFOMO — Your Best DP is 20 Seconds Away",
    template: "%s | PicFOMO" // Sub-pages will auto-format as "Page Name | PicFOMO"
  },
  description: "Drop your photo. Pick a trending style. Get a portrait so stunning you'll actually change your DP. No photographer needed.",
  
  // 3. KEYWORDS & AUTHOR REPUTATION (Boosts Google E-E-A-T score)
  keywords: ["AI portrait generator", "AI headshots", "PicFOMO", "AI avatar", "custom AI portraits", "virtual try on", "viral profile pictures"],
  authors: [{ name: "PicFOMO" }],
  creator: "PicFOMO",
  publisher: "PicFOMO",

  // 4. ALTERNATES: Auto-generates correct canonical URLs for each page based on metadataBase
  alternates: {
    languages: {
      'en-IN': '/en-IN',
      'en-US': '/en-US',
    },
  },

  // 5. ROBOTS DIRECTIVE: Maximize indexing capability
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/logo.png", // Using the 512x512 logo for Apple touch icon
  },

  manifest: "/manifest.json",

  openGraph: {
    title: "PicFOMO — Your Best DP is 20 Seconds Away",
    description: "The world's most realistic AI portrait generator. Drop one selfie, pick a style, and get a stunning masterpiece in 20 seconds. No photographer needed.",
    url: "https://www.picfomo.com",
    siteName: "PicFOMO",
    images: [
      {
        url: "https://www.picfomo.com/hero/8.webp", 
        width: 1200,
        height: 630,
        alt: "PicFOMO Cinematic AI Portraits",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  
  twitter: {
    card: "summary_large_image",
    title: "PicFOMO — Your Best DP is 20 Seconds Away",
    description: "Drop your photo. Pick a style. Get your masterpiece. The #1 AI Portrait Generator.",
    images: ["https://www.picfomo.com/hero/8.webp"], 
    creator: "@picfomo",
  },

  // OPTIONAL: Add this once you connect to Google Search Console
  // verification: {
  //   google: "YOUR_GOOGLE_SEARCH_CONSOLE_ID", 
  // },
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
    <ClerkProvider>
      <html lang="en" className={`${jakarta.variable} ${inter.variable}`}>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
          />
        </head>
        <body className="antialiased bg-[var(--color-page-bg)] text-[var(--color-page-text)] selection:bg-[var(--color-gold)] selection:text-black">
          
          <ClientLayout>
            {children}
          </ClientLayout>
          
          <Toaster position="bottom-center" theme="system" richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
