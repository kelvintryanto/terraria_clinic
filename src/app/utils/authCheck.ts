export function canDeleteInvoice(role?: string): boolean {
  return role === "super_admin";
}
