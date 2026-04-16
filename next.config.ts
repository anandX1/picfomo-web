import type { NextConfig } from "next";
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

// This tells Next.js to hook into your local Cloudflare D1 database 
// ONLY when you are running `npm run dev`
if (process.env.NODE_ENV === "development") {
  setupDevPlatform();
}

const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'recharts'],
  },
  transpilePackages: ['lucide-react'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
} as any;

export default nextConfig;