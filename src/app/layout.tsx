import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import { Toaster } from "sonner";
import NavigationBar from "@/components/dashboard/NavigationBar"; // <-- Change this path if your NavigationBar is in a different folder!

export const metadata: Metadata = {
  title: "PicFOMO — AI Portrait Generator India",
  description: "Drop your photo. Pick a trending style. Get a portrait so good you'll actually change your DP.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased bg-[var(--color-cream)] text-[var(--color-ink)] flex h-screen overflow-hidden">
          
          {/* THE MISSING SIDEBAR IS BACK! */}
          <NavigationBar />

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 h-full overflow-y-auto pb-20 md:pb-0">
            {children}
          </main>

          <Toaster position="bottom-center" theme="dark" />
        </body>
      </html>
    </ClerkProvider>
  );
}