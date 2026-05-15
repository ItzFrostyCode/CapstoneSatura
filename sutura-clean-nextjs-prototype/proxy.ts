import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip static assets and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // 2. Public routes — always accessible without auth
  if (
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname === '/login-gateway' ||
    pathname === '/unauthorized' ||
    pathname === '/customer/shops' ||
    pathname === '/customer/designs'
  ) {
    return NextResponse.next();
  }

  // 3. Read auth cookie — supports both cookie names for backward compatibility
  type SessionRole = 'admin' | 'owner' | 'staff' | 'customer';
  const role =
    (request.cookies.get('sutura_role')?.value as SessionRole | undefined) ??
    (request.cookies.get('auth-role')?.value as SessionRole | undefined);

  // 4. Portal access rules
  const PORTAL_RULES: Array<{ prefix: string; allowedRoles: SessionRole[] }> = [
    { prefix: '/customer', allowedRoles: ['customer', 'owner', 'staff', 'admin'] },
    { prefix: '/owner',    allowedRoles: ['owner', 'admin'] },
    { prefix: '/staff',    allowedRoles: ['staff', 'owner', 'admin'] },
    { prefix: '/admin',    allowedRoles: ['admin'] },
  ];

  const rule = PORTAL_RULES.find((r) => pathname.startsWith(r.prefix));

  // Not a protected route
  if (!rule) return NextResponse.next();

  // No session cookie → redirect to login-gateway with return URL
  if (!role) {
    const loginUrl = new URL('/login-gateway', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role not allowed for this portal → unauthorized
  if (!rule.allowedRoles.includes(role)) {
    const loginUrl = new URL('/login-gateway', request.url);
    loginUrl.searchParams.set('reason', 'unauthorized');
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
