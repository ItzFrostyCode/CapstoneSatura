export type Role = 'admin' | 'owner' | 'staff' | 'designer' | 'customer';

export interface User {
  id: string;
  role: Role;
  name: string;
  email: string;
}

export const ROLE_HIERARCHY: Record<Role, number> = {
  admin: 5,
  owner: 4,
  staff: 3,
  designer: 2,
  customer: 1,
};

export const PERMISSIONS = {
  CAN_ACCESS_OWNER_PORTAL: ['admin', 'owner'],
  CAN_ACCESS_STAFF_PORTAL: ['admin', 'owner', 'staff'],
  CAN_ACCESS_DESIGNER_PORTAL: ['admin', 'owner', 'designer'],
  CAN_ACCESS_CUSTOMER_PORTAL: ['admin', 'owner', 'customer'],
  CAN_MANAGE_USERS: ['admin'],
  CAN_MANAGE_BUSINESS: ['admin', 'owner'],
  CAN_RECORD_PAYMENTS: ['admin', 'owner', 'staff'],
};

export function hasPermission(userRole: Role, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole);
}

export function isAuthorized(userRole: Role, targetRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[targetRole];
}
