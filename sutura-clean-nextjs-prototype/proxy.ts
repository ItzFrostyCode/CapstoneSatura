import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip static assets and public routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('/login') ||
    pathname.includes('/register') ||
    pathname === '/' ||
    pathname === '/customer/designs' || // Allow public access to designs showcase
    pathname === '/customer/shops'    // Allow public access to shops explorer
  ) {
    return NextResponse.next();
  }

  // 2. Mock Authentication Check
  const authRole = request.cookies.get('auth-role')?.value;

  // 3. Role-Based Redirection Logic
  if (pathname.startsWith('/owner') && authRole !== 'owner' && authRole !== 'admin') {
    return NextResponse.redirect(new URL('/login?role=owner', request.url));
  }

  if (pathname.startsWith('/staff') && authRole !== 'staff' && authRole !== 'owner' && authRole !== 'admin') {
    return NextResponse.redirect(new URL('/login?role=owner', request.url));
  }

  if (pathname.startsWith('/customer') && authRole !== 'customer' && authRole !== 'owner' && authRole !== 'admin') {
    // If they are trying to access protected customer routes like dashboard or book
    // For now, allow /customer/book for demo if not logged in? No, let's keep it protected.
    if (pathname === '/customer/book' || pathname === '/customer/dashboard') {
       return NextResponse.redirect(new URL('/login?role=customer', request.url));
    }
  }

  if (pathname.startsWith('/designer') && authRole !== 'designer' && authRole !== 'owner' && authRole !== 'admin') {
    return NextResponse.redirect(new URL('/login?role=designer', request.url));
  }

  if (pathname.startsWith('/admin') && authRole !== 'admin') {
    return NextResponse.redirect(new URL('/login?role=admin', request.url));
  }

  return NextResponse.next();
}
