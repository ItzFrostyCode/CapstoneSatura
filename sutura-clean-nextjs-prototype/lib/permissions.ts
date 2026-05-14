/**
 * SUTURA — Expanded RBAC Permissions Map
 * Defines granular module-level permissions for all roles.
 * This is the single source of truth for what each role can do.
 */

export type Role = 'admin' | 'owner' | 'staff' | 'customer';

export interface User {
  id: string;
  role: Role;
  name: string;
  email: string;
}

export const ROLE_HIERARCHY: Record<Role, number> = {
  admin: 4,
  owner: 3,
  staff: 2,
  customer: 1,
};

// ── Portal Access ──────────────────────────────────────────────────────────
export const PERMISSIONS = {
  // Portal-level access
  CAN_ACCESS_ADMIN_PORTAL:     ['admin'] as Role[],
  CAN_ACCESS_OWNER_PORTAL:     ['admin', 'owner'] as Role[],
  CAN_ACCESS_STAFF_PORTAL:     ['admin', 'owner', 'staff'] as Role[],
  CAN_ACCESS_CUSTOMER_PORTAL:  ['admin', 'owner', 'customer'] as Role[],

  // ── User & Account Management ────────────────────────────────────────────
  CAN_MANAGE_USERS:            ['admin'] as Role[],
  CAN_MANAGE_BUSINESS:         ['admin', 'owner'] as Role[],
  CAN_SUSPEND_TENANTS:         ['admin'] as Role[],
  CAN_APPROVE_TENANTS:         ['admin'] as Role[],
  CAN_MANAGE_SUBSCRIPTIONS:    ['admin'] as Role[],

  // ── Shop & Staff Management ──────────────────────────────────────────────
  CAN_MANAGE_STAFF:            ['admin', 'owner'] as Role[],
  CAN_VIEW_STAFF:              ['admin', 'owner', 'staff'] as Role[],
  CAN_ASSIGN_TASKS:            ['admin', 'owner', 'staff'] as Role[],

  // ── Customers (CRM) ──────────────────────────────────────────────────────
  CAN_VIEW_CUSTOMERS:          ['admin', 'owner', 'staff'] as Role[],
  CAN_MODIFY_CUSTOMERS:        ['admin', 'owner', 'staff'] as Role[],
  CAN_VIEW_OWN_PROFILE:        ['customer', 'admin'] as Role[],

  // ── Orders ───────────────────────────────────────────────────────────────
  CAN_CREATE_ORDERS:           ['admin', 'owner', 'staff'] as Role[],
  CAN_VIEW_SHOP_ORDERS:        ['admin', 'owner', 'staff'] as Role[],
  CAN_VIEW_OWN_ORDERS:         ['customer', 'admin'] as Role[],
  CAN_UPDATE_ORDER_STATUS:     ['admin', 'owner', 'staff'] as Role[],
  CAN_CANCEL_ORDERS:           ['admin', 'owner'] as Role[],

  // ── Production Workflow ──────────────────────────────────────────────────
  CAN_VIEW_PRODUCTION:         ['admin', 'owner', 'staff'] as Role[],
  CAN_ADVANCE_PRODUCTION:      ['admin', 'owner', 'staff'] as Role[],
  CAN_LOG_PRODUCTION_NOTES:    ['admin', 'owner', 'staff'] as Role[],

  // ── Measurements ─────────────────────────────────────────────────────────
  CAN_RECORD_MEASUREMENTS:     ['admin', 'owner', 'staff'] as Role[],
  CAN_VIEW_OWN_MEASUREMENTS:   ['customer', 'admin'] as Role[],
  CAN_VIEW_CUSTOMER_MEASUREMENTS: ['admin', 'owner', 'staff'] as Role[],

  // ── Appointments ─────────────────────────────────────────────────────────
  CAN_BOOK_APPOINTMENTS:       ['customer', 'admin', 'owner', 'staff'] as Role[],
  CAN_MANAGE_APPOINTMENTS:     ['admin', 'owner', 'staff'] as Role[],
  CAN_VIEW_OWN_APPOINTMENTS:   ['customer', 'admin'] as Role[],

  // ── Inventory ────────────────────────────────────────────────────────────
  CAN_VIEW_INVENTORY:          ['admin', 'owner', 'staff'] as Role[],
  CAN_MODIFY_INVENTORY:        ['admin', 'owner', 'staff'] as Role[],
  CAN_APPROVE_PURCHASE_ORDERS: ['admin', 'owner'] as Role[],

  // ── Billing & Payments ───────────────────────────────────────────────────
  CAN_VIEW_BILLING:            ['admin', 'owner'] as Role[],
  CAN_MODIFY_BILLING:          ['admin', 'owner'] as Role[],
  CAN_RECORD_PAYMENTS:         ['admin', 'owner', 'staff'] as Role[],
  CAN_VIEW_OWN_INVOICES:       ['customer', 'admin'] as Role[],
  CAN_VOID_INVOICES:           ['admin', 'owner'] as Role[],

  // ── Reports & Analytics ──────────────────────────────────────────────────
  CAN_VIEW_SHOP_REPORTS:       ['admin', 'owner'] as Role[],
  CAN_VIEW_PLATFORM_REPORTS:   ['admin'] as Role[],

  // ── Notifications ────────────────────────────────────────────────────────
  CAN_VIEW_OWN_NOTIFICATIONS:  ['customer', 'staff', 'owner', 'admin'] as Role[],
  CAN_SEND_PLATFORM_NOTIFICATIONS: ['admin'] as Role[],
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;

/** Check if a user role has a specific permission */
export function hasPermission(userRole: Role, permission: PermissionKey): boolean {
  return (PERMISSIONS[permission] as Role[]).includes(userRole);
}

/** Check if userRole is authorized relative to targetRole (hierarchy check) */
export function isAuthorized(userRole: Role, targetRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[targetRole];
}

/** Returns all permissions available to a given role */
export function getPermissionsForRole(role: Role): PermissionKey[] {
  return (Object.keys(PERMISSIONS) as PermissionKey[]).filter((key) =>
    (PERMISSIONS[key] as Role[]).includes(role)
  );
}
