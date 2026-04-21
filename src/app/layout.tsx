import type { Metadata, Viewport } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import { Toaster } from "sonner";
import ClientLayout from "./ClientLayout";

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

  // 4. CANONICAL LINKS: Forces Google to combine ranking power into one URL
  alternates: {
    canonical: '/',
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
    icon: "/favicon.png", 
    apple: "/apple-touch-icon.png", // Helps icon look perfect when saved to iOS homescreen
  },

  openGraph: {
    title: "PicFOMO — AI Portrait Generator",
    description: "Your Selfie and unlimited Styles. ALL IN ONE PLACE. Pick a trending style — Ghibli, IPL cricket card, Bollywood poster. Drop a selfie. Get a portrait so stunning you'll actually change your Profile Picture.",
    url: "/", // Next.js will auto-prefix this with metadataBase!
    siteName: "PicFOMO",
    images: [
      {
        url: "/logo2.png", // Next.js will auto-prefix this with metadataBase!
        width: 1600, 
        height: 1600,
        alt: "PicFOMO Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  
  twitter: {
    card: "summary_large_image",
    title: "PicFOMO — AI Portrait Generator",
    description: "PicFOMO — Your Best Self is 20 Seconds Away.",
    images: ["/logo2.png"],
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
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased bg-[var(--color-white)] text-[var(--color-ink)] selection:bg-[var(--color-gold)] selection:text-black">
          
          <ClientLayout>
            {children}
          </ClientLayout>
          
          <Toaster position="bottom-center" theme="system" richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}