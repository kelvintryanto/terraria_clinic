export function isSuperAdmin(role?: string): boolean {
  return role === 'super_admin';
}

export function isAdmin(role?: string): boolean {
  return role === 'admin';
}

export function isAdmin2(role?: string): boolean {
  return role === 'admin2';
}

export function isCustomer(role?: string): boolean {
  return role === 'Customer';
}

export function canAccessCMS(role?: string): boolean {
  const hasAccess =
    role === 'super_admin' || role === 'admin' || role === 'admin2';
  return hasAccess;
}

export function canManageRoles(role?: string): boolean {
  return role === 'super_admin';
}

export function canDeleteEntities(role?: string): boolean {
  return role === 'super_admin';
}

// Customer permissions
export function canCreateCustomer(role?: string): boolean {
  return role === 'super_admin' || role === 'admin';
}

export function canEditCustomer(role?: string): boolean {
  return role === 'super_admin' || role === 'admin';
}

export function canDeleteCustomer(role?: string): boolean {
  return role === 'super_admin';
}

// Product permissions
export function canCreateProduct(role?: string): boolean {
  return role === 'super_admin' || role === 'admin';
}

export function canEditProduct(role?: string): boolean {
  return role === 'super_admin' || role === 'admin';
}

export function canDeleteProduct(role?: string): boolean {
  return role === 'super_admin';
}

// Category permissions
export function canCreateCategory(role?: string): boolean {
  return role === 'super_admin' || role === 'admin';
}

export function canEditCategory(role?: string): boolean {
  return role === 'super_admin' || role === 'admin';
}

export function canDeleteCategory(role?: string): boolean {
  return role === 'super_admin';
}

export function canEditEntity(
  role?: string,
  userId?: string,
  resourceOwnerId?: string
): boolean {
  if (isSuperAdmin(role)) return true;
  if (isAdmin(role)) return true;
  if (isAdmin2(role)) return true;
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

export function canCreateInvoice(role?: string): boolean {
  return role === 'super_admin' || role === 'admin' || role === 'admin2';
}

export function canEditInvoice(role?: string): boolean {
  return role === 'super_admin' || role === 'admin';
}

export function canDeleteInvoice(role?: string): boolean {
  return role === 'super_admin';
}

export function canCreateDiagnose(role?: string): boolean {
  return role === 'super_admin' || role === 'admin' || role === 'admin2';
}

export function canEditDiagnose(role?: string): boolean {
  return role === 'super_admin' || role === 'admin';
}

export function canDeleteDiagnose(role?: string): boolean {
  return role === 'super_admin';
}
