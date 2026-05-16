import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Surgically mapped to your actual file architecture
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)'
])

const isGenerateRoute = createRouteMatcher(['/api/generate'])

// Routes that should be protected from faceted crawl indexing
const isFacetedSeoRoute = createRouteMatcher([
  '/explore(.*)',
  '/styles(.*)',
  '/use-case(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  const url = new URL(req.url);
  const userAgent = req.headers.get('user-agent') || '';

  // 🌟 SEARCH TELEMETRY: Edge Logging for Crawler Frequency
  // Tracks Googlebot vs. LLM agents (ChatGPT, Perplexity, etc.)
  if (userAgent.includes('Googlebot')) {
    console.log(`[TELEMETRY] Googlebot Crawl: ${url.pathname}`);
  } else if (userAgent.includes('GPTBot') || userAgent.includes('PerplexityBot') || userAgent.includes('anthropic-ai')) {
    console.log(`[TELEMETRY] LLM Crawler: ${url.pathname} (${userAgent})`);
  }

  // 🌟 SEO FACETED CRAWL PROTECTION
  // If the route is an SEO hub and has query parameters (e.g., ?sort=new, ?remix=123),
  // inject an X-Robots-Tag to prevent Googlebot from indexing an infinite parameter space.
  if (isFacetedSeoRoute(req) && url.searchParams.toString().length > 0) {
    const res = NextResponse.next();
    res.headers.set('X-Robots-Tag', 'noindex, follow');
    // Proceed to other middleware checks, but pass along the modified response
  }

  // Check for the /api/generate rate limit for guests
  if (isGenerateRoute(req) && req.method === 'POST') {
    const { userId } = await auth()
    
    if (!userId) {
      const guestPass = req.cookies.get('picfomo_guest_pass')
      if (guestPass) {
        return NextResponse.json(
          { error: 'Free pass used. Please sign in to continue generating.' },
          { status: 429 }
        )
      }
    }
  }

  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}

