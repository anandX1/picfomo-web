import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

if (process.env.NODE_ENV === "development") {
  setupDevPlatform();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🌟 ADDED: Allow Next.js Image Optimization to work with your Cloudflare R2 Bucket
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-ad6276faad1f4954ad679b43ef8c4afd.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
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
};

export default nextConfig;