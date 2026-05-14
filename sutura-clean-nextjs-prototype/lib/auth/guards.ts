/**
 * SUTURA — Server-Side Auth Guards
 * Use in Server Components and Server Actions to enforce role-based access.
 * These run on the server — never trust client-side role claims alone.
 */

import { redirect } from 'next/navigation';
import { getSession, type Session, type SessionRole } from './session';
// SessionRole is kept for backward compat; session.role is now a string

/**
 * Requires a valid session. Redirects to login if none found.
 * Returns the session object for use in the calling component.
 */
export async function requireAuth(redirectTo = '/login-gateway'): Promise<Session> {
  const session = await getSession();
  if (!session) {
    redirect(redirectTo);
  }
  return session;
}

/**
 * Requires a session with at least one of the specified roles.
 * Redirects to /unauthorized if the role doesn't match.
 */
export async function requireRole(
  allowedRoles: string[],
  redirectTo = '/unauthorized'
): Promise<Session> {
  const session = await getSession();
  if (!session) {
    redirect('/login-gateway');
  }
  if (!allowedRoles.includes(session.role)) {
    redirect(redirectTo);
  }
  return session;
}

/**
 * Requires the user to be a shop owner or admin.
 * Used in ERP portal server components.
 */
export async function requireOwnerOrAdmin(): Promise<Session> {
  return requireRole(['owner', 'admin']);
}

/**
 * Requires the user to be staff, owner, or admin.
 * Used for shop-operational pages that staff can access.
 */
export async function requireShopAccess(): Promise<Session> {
  return requireRole(['staff', 'owner', 'admin']);
}

/**
 * Requires the user to be a customer or admin.
 */
export async function requireCustomer(): Promise<Session> {
  return requireRole(['customer', 'admin']);
}

/**
 * Requires the user to be a system admin.
 */
export async function requireAdmin(): Promise<Session> {
  return requireRole(['admin']);
}
