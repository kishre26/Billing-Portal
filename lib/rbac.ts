// The 3 roles in our portal
export const ROLES = ["admin", "billing_manager", "viewer"] as const;
export type Role = (typeof ROLES)[number];

// Every action a user might take
export const PERMISSIONS = [
  "view_dashboard",
  "view_plans",
  "change_plan",
  "view_invoices",
  "download_invoices",
  "view_payment_methods",
  "manage_payment_methods",
  "view_team",
  "manage_team_roles",
] as const;
export type Permission = (typeof PERMISSIONS)[number];

// Who can do what
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    "view_dashboard",
    "view_plans",
    "change_plan",
    "view_invoices",
    "download_invoices",
    "view_payment_methods",
    "manage_payment_methods",
    "view_team",
    "manage_team_roles",
  ],
  billing_manager: [
    "view_dashboard",
    "view_plans",
    "change_plan",
    "view_invoices",
    "download_invoices",
    "view_payment_methods",
    "manage_payment_methods",
    "view_team",
  ],
  viewer: [
    "view_dashboard",
    "view_plans",
    "view_invoices",
    "view_payment_methods",
  ],
};

// The main helper: can this role do this action?
export function can(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

// Human-readable role names
export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  billing_manager: "Billing Manager",
  viewer: "Viewer",
};