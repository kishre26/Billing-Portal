import Link from "next/link";
import { Role, can } from "@/lib/rbac";

// Each nav item and which permission is needed to see it
const NAV = [
  { href: "/",                  label: "Dashboard",        permission: "view_dashboard"        as const },
  { href: "/plans",             label: "Plans",            permission: "view_plans"            as const },
  { href: "/invoices",          label: "Invoices",         permission: "view_invoices"         as const },
  { href: "/payment-methods",   label: "Payment Methods",  permission: "view_payment_methods"  as const },
  { href: "/team",              label: "Team & Roles",     permission: "view_team"             as const },
];

export function Sidebar({ role }: { role: Role }) {
  return (
    <aside style={{
      width: "220px",
      minHeight: "100vh",
      background: "#1e293b",
      padding: "24px 16px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    }}>
      <div style={{ color: "#fff", fontSize: "20px", fontWeight: "bold", marginBottom: "24px" }}>
        💳 Billing Portal
      </div>

      {NAV.filter(item => can(role, item.permission)).map(item => (
        <Link
          key={item.href}
          href={item.href}
          style={{
            color: "#94a3b8",
            textDecoration: "none",
            padding: "10px 12px",
            borderRadius: "6px",
            fontSize: "14px",
            display: "block",
          }}
        >
          {item.label}
        </Link>
      ))}
    </aside>
  );
}