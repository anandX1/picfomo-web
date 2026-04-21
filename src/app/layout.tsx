import type { Metadata, Viewport } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import { Toaster } from "sonner";
import ClientLayout from "./ClientLayout";

// 🌟 ADDED: Premium Viewport Settings
// This physically changes the top browser bar on iPhones/Androids to match your theme!
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAF8' },
    { media: '(prefers-color-scheme: dark)', color: '#09090B' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Prevents accidental zooming on inputs for a "Native App" feel
};

// 🌟 ULTIMATE SEO & SOCIAL MEDIA CRAWLER DATA
export const metadata: Metadata = {
  title: "PicFOMO — Your Best Self is 20 Seconds Away",
  description: "Drop your photo. Pick a trending style. Get a portrait so stunning you'll actually change your DP. No photographer needed.",
  icons: {
    icon: "/favicon.png", 
  },
  openGraph: {
    title: "PicFOMO — AI Portrait Generator",
    description: "Your Selfie and unlimited Styles. ALL IN ONE PLACE. Pick a trending style — Ghibli, IPL cricket card, Bollywood poster. Drop a selfie. Get a portrait so stunning you'll actually change your Profile Picture.",
    url: "https://picfomo.com",
    siteName: "PicFOMO",
    images: [
      {
        url: "https://picfomo.com/logo2.png", // 🌟 FIX: Pointing to your new logo
        width: 1600, // 🌟 FIX: Updated dimensions
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
    images: ["https://picfomo.com/logo2.png"], // 🌟 FIX: Updated for Twitter too
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        {/* 🌟 FIX: Added premium brand-colored text highlighting and pure adaptive background */}
        <body className="antialiased bg-[var(--color-white)] text-[var(--color-ink)] selection:bg-[var(--color-gold)] selection:text-black">
          
          <ClientLayout>
            {children}
          </ClientLayout>
          
          {/* 🌟 FIX: Changed theme to "system" so popups adapt to Light/Dark mode naturally, and added richColors for better UI */}
          <Toaster position="bottom-center" theme="system" richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}