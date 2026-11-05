import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get('host') || '';

  // Enforce www for picfomo.com in production
  if (process.env.NODE_ENV === 'production' && host === 'picfomo.com') {
    return NextResponse.redirect(`https://www.picfomo.com${url.pathname}${url.search}`, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
