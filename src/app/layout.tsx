import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import { Toaster } from "sonner";
import ClientLayout from "./ClientLayout"; // 🌟 NEW IMPORT

// 🌟 ULTIMATE SEO & SOCIAL MEDIA CRAWLER DATA
export const metadata: Metadata = {
  title: "PicFOMO — Your Best DP is 20 Seconds Away",
  description: "Drop your photo. Pick a trending style. Get a portrait so stunning you'll actually change your DP. No photographer needed.",
  icons: {
    icon: "/favicon.svg", // Points to your public/favicon.svg
  },
  openGraph: {
    title: "PicFOMO — AI Portrait Generator",
    description: "47 Worlds. No Photographer Needed. Drop a selfie and upgrade your digital identity in seconds.",
    url: "https://picfomo.com",
    siteName: "PicFOMO",
    images: [
      {
        url: "https://picfomo.com/logo.png", 
        width: 1200,
        height: 630,
        alt: "PicFOMO Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PicFOMO — AI Portrait Generator",
    description: "Upgrade your digital identity in 20 seconds.",
    images: ["https://picfomo.com/logo.png"],
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
        <body className="antialiased bg-[var(--color-cream)] text-[var(--color-ink)]">
          {/* 🌟 The wrapper handles showing/hiding the sidebar automatically! */}
          <ClientLayout>
            {children}
          </ClientLayout>
          
          <Toaster position="bottom-center" theme="dark" />
        </body>
      </html>
    </ClerkProvider>
  );
}