/**
 * SUTURA — Mock Session Layer
 * Reads the `sutura_role` cookie to simulate an authenticated session.
 * In production this would be replaced with Supabase Auth JWT validation.
 */

import { cookies } from 'next/headers';

export type SessionRole = 'admin' | 'owner' | 'staff' | 'customer';

export interface Session {
  id: string;
  role: string;
  name: string;
  email: string;
  shopId?: string;
  branchId?: string;
}

// Mock user registry — in production this comes from Supabase auth.users
const MOCK_USERS: Record<SessionRole, Session> = {
  admin: {
    id: 'USR-ADMIN-001',
    role: 'admin',
    name: 'System Admin',
    email: 'admin@sutura.ph',
  },
  owner: {
    id: 'USR-OWNER-001',
    role: 'owner',
    name: 'Shop Owner',
    email: 'owner@sutura.ph',
    shopId: 'SHOP-001',
  },
  staff: {
    id: 'USR-STAFF-001',
    role: 'staff',
    name: 'Staff Member',
    email: 'staff@sutura.ph',
    shopId: 'SHOP-001',
  },
  customer: {
    id: 'USR-CUST-001',
    role: 'customer',
    name: 'Juan dela Cruz',
    email: 'customer@sutura.ph',
  },
};

/**
 * Reads the session cookie and returns the Session object.
 * Fetches from DB in production/real mode.
 */
export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const roleCookie = cookieStore.get('sutura_role') ?? cookieStore.get('auth-role');

    if (!roleCookie?.value) return null;

    // For the prototype, we still use the role to find the representative user
    const { getAuthSession } = await import('@/lib/actions/auth');
    const result = await getAuthSession();

    if (result.success && result.data) {
      const { user, shop, branch } = result.data;
      return {
        id: user.id,
        role: user.role.toLowerCase(),
        name: user.name,
        email: user.email,
        shopId: shop?.id,
        branchId: branch?.id,
      };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Returns true if a valid session exists for any of the given roles.
 */
export async function hasRole(...roles: string[]): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;
  return roles.includes(session.role);
}
