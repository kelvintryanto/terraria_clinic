'use server';

import { getUser } from '@/app/api/auth/server-auth';
import {
  canDeleteEntities,
  canDeleteEntity,
  canEditEntity,
  canManageRoles,
} from '@/app/utils/auth';
import { redirect } from 'next/navigation';

// Middleware for server actions that require authentication
export async function requireAuth() {
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

// Middleware for server actions that require CMS access (admin or super_admin)
export async function requireCmsAccess() {
  const user = await getUser();
  if (!user || !(user.role === 'admin' || user.role === 'super_admin')) {
    redirect('/');
  }
  return user;
}

// Middleware for server actions that require super_admin role
export async function requireSuperAdmin() {
  const user = await getUser();
  if (!user || user.role !== 'super_admin') {
    redirect('/');
  }
  return user;
}

// Check if current user can manage roles (update user roles)
export async function checkCanManageRoles() {
  const user = await getUser();
  return user ? canManageRoles(user.role) : false;
}

// Check if current user can delete entities
export async function checkCanDeleteEntities() {
  const user = await getUser();
  return user ? canDeleteEntities(user.role) : false;
}

// Check if current user can edit a specific entity
export async function checkCanEditEntity(resourceOwnerId: string) {
  const user = await getUser();
  return user ? canEditEntity(user.role, user.id, resourceOwnerId) : false;
}

// Check if current user can delete a specific entity
export async function checkCanDeleteEntity(resourceOwnerId: string) {
  const user = await getUser();
  return user ? canDeleteEntity(user.role, user.id, resourceOwnerId) : false;
}

// Get current user's role
export async function getCurrentUserRole() {
  const user = await getUser();
  return user?.role || null;
}

// Get current user's ID
export async function getCurrentUserId() {
  const user = await getUser();
  return user?.id || null;
}
