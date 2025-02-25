import { cookies } from 'next/headers';
import { verify } from './jwt';

export type UserRole = 'super_admin' | 'admin' | 'Customer';

export async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  console.log(token, 'token di auth');

  if (!token) return null;

  const user = await verify(token?.value);
  return user;
}

export async function getUserFromRequest() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  const user = await verify(token);
  return user;
}

export function isSuperAdmin(role?: string): boolean {
  return role === 'super_admin';
}

export function isAdmin(role?: string): boolean {
  return role === 'admin';
}

export function isCustomer(role?: string): boolean {
  return role === 'Customer';
}

export function canAccessCMS(role?: string): boolean {
  return role === 'super_admin' || role === 'admin';
}

export function canManageRoles(role?: string): boolean {
  return role === 'super_admin';
}

export function canDeleteEntities(role?: string): boolean {
  return role === 'super_admin';
}

export function canEditEntity(
  role?: string,
  userId?: string,
  resourceOwnerId?: string
): boolean {
  if (isSuperAdmin(role)) return true;
  if (isAdmin(role)) return true;
  if (isCustomer(role) && userId === resourceOwnerId) return true;
  return false;
}

export function canDeleteEntity(
  role?: string,
  userId?: string,
  resourceOwnerId?: string
): boolean {
  if (isSuperAdmin(role)) return true;
  if (isCustomer(role) && userId === resourceOwnerId) return true;
  return false;
}
