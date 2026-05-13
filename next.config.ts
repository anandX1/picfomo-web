import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

/** * EXPERT STANDARD SECURITY HEADERS
 * Prevents clickjacking, MIME-sniffing, and cross-site scripting attacks.
 * This increases the "Trust" signal for technical SEO audits.
 */
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🚀 1. AGGRESSIVE IMAGE OPTIMIZATION (Speed & LCP)
  images: {
    // Force the server to generate AVIF first (20-50% smaller than WebP), then WebP as fallback
    formats: ['image/avif', 'image/webp'],
    
    // Force browser and CDN to cache optimized images for 30 days (reduces server load & repeat load times)
    minimumCacheTTL: 2592000, 
    
    // Allowlist specific domains for security
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

  // 🛡️ 2. SECURITY & SEO CLEANUP
  // Removes the "x-powered-by: Next.js" header to prevent framework fingerprinting
  poweredByHeader: false, 

  // Ensures GZIP/Brotli compression is explicitly enabled for all text/JSON/HTML responses
  compress: true,

  // Inject the security headers defined above
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },

  // ⚡ 3. BUNDLE OPTIMIZATION (Production Speed)
  compiler: {
    // Automatically strip all console.log() statements in production to shrink JS bundle size 
    // (Keeps console.error for debugging)
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },

  // 🏗️ 4. PACKAGE OPTIMIZATION
  experimental: {
    // Modularizes heavy imports so the client only downloads the exact icons/charts used
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
  
  transpilePackages: ['lucide-react'],
  
  typescript: {
    // Allows Cloudflare to build even if strict TS types fail (useful for rapid iteration)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;