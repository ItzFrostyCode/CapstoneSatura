import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This is a prototype proxy. In production, you would verify a JWT or session cookie.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip static assets and public routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('/login') ||
    pathname.includes('/register') ||
    pathname === '/'
  ) {
    return NextResponse.next();
  }

  // 2. Mock Authentication Check
  // In the real prototype, we might check a cookie or local storage (if it were a client component)
  // But middleware runs on the edge, so we check for an 'auth-role' cookie if available.
  const authRole = request.cookies.get('auth-role')?.value;

  // 3. Role-Based Redirection Logic
  if (pathname.startsWith('/owner') && authRole !== 'owner' && authRole !== 'admin') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (pathname.startsWith('/staff') && authRole !== 'staff' && authRole !== 'owner' && authRole !== 'admin') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (pathname.startsWith('/customer') && authRole !== 'customer' && authRole !== 'owner' && authRole !== 'admin') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (pathname.startsWith('/designer') && authRole !== 'designer' && authRole !== 'owner' && authRole !== 'admin') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (pathname.startsWith('/admin') && authRole !== 'admin') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/owner/:path*',
    '/staff/:path*',
    '/customer/:path*',
    '/designer/:path*',
    '/admin/:path*',
  ],
};
