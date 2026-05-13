import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Surgically mapped to your actual file architecture
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)'
])

const isGenerateRoute = createRouteMatcher(['/api/generate'])

export default clerkMiddleware(async (auth, req) => {
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
