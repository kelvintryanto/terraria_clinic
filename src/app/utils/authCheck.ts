export function canDeleteInvoice(role?: string): boolean {
  return role === "super_admin";
}

export function canCreateDiagnose(role?: string): boolean {
  return role === "super_admin" || role === "admin" || role === "admin2";
}

export function canDeleteDiagnose(role?: string): boolean {
  return role === "super_admin";
}

export function canEditDiagnose(role?: string): boolean {
  return role === "super_admin" || role === "admin";
}
