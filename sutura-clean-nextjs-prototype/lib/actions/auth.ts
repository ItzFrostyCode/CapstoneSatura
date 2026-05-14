'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { User, Shop, ShopBranch } from '@/types/erp';

/**
 * Fetches the current authenticated user and their active shop/branch.
 */
export async function getAuthSession() {
  try {
    const cookieStore = await cookies();
    const roleCookie = cookieStore.get('sutura_role') || cookieStore.get('auth-role');
    
    if (!roleCookie?.value) return { success: false, error: 'No session' };

    // In production, we'd verify a JWT here and get the userId.
    // For now, we'll map the role to a representative user in the DB.
    
    const user = await prisma.user.findFirst({
      where: { 
        role: roleCookie.value.toUpperCase() as any,
        status: 'ACTIVE'
      },
      include: {
        shopsOwned: {
          include: {
            branches: true
          }
        },
        branchMembers: {
          include: {
            branch: {
              include: {
                shop: true
              }
            }
          }
        }
      }
    });

    if (!user) return { success: false, error: 'User not found in database' };

    return { 
      success: true, 
      data: {
        user,
        shop: user.shopsOwned[0] || user.branchMembers[0]?.branch?.shop,
        branch: user.branchMembers[0]?.branch || user.shopsOwned[0]?.branches[0]
      }
    };
  } catch (error) {
    console.error('Auth session fetch failed:', error);
    return { success: false, error: 'Auth failed' };
  }
}

/**
 * Sets the auth cookies (Mock login)
 */
export async function loginUser(role: string) {
  const cookieStore = await cookies();
  cookieStore.set('sutura_role', role, { path: '/' });
  cookieStore.set('auth-role', role, { path: '/' });
  return { success: true };
}

/**
 * Clears the auth cookies
 */
export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete('sutura_role');
  cookieStore.delete('auth-role');
  return { success: true };
}
