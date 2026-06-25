import { can, Role, ROLES } from "@/lib/rbac";
import { cookies } from "next/headers";
import { getOrCreateUser } from "@/lib/user";
import { db } from "@/lib/db";

export default async function InvoicesPage() {
  const store = await cookies();
  const raw = store.get("role")?.value;
  const CURRENT_ROLE: Role = ROLES.includes(raw as Role) ? (raw as Role) : "admin";

  if (!can(CURRENT_ROLE, "view_invoices")) {
    return <div style={deniedStyle}>🚫 You don't have access to Invoices.</div>;
  }

  const canDownload = can(CURRENT_ROLE, "download_invoices");
  const user = await getOrCreateUser();
  if (!user) return <div style={deniedStyle}>Not logged in.</div>;

  const invoices = await db.invoice.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px" }}>Invoices</h1>
        <button
          disabled={!canDownload}
          style={{
            padding: "8px 16px", borderRadius: "6px", border: "none",
            background: canDownload ? "#6366f1" : "#e2e8f0",
            color: canDownload ? "#fff" : "#94a3b8",
            cursor: canDownload ? "pointer" : "not-allowed",
            fontSize: "14px",
          }}
        >
          ⬇ Download CSV
        </button>
      </div>

      {!canDownload && (
        <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "16px" }}>
          Your role cannot download invoices.
        </p>
      )}

      <div style={{ background: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Amount</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id} style={{ borderTop: "1px solid #e2e8f0" }}>
                <td style={tdStyle}>{inv.description}</td>
                <td style={tdStyle}>{inv.createdAt.toLocaleDateString()}</td>
                <td style={tdStyle}>${inv.amount}</td>
                <td style={tdStyle}>
                  <span style={{
                    padding: "3px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: "500",
                    background: inv.status === "paid" ? "#dcfce7" : inv.status === "overdue" ? "#fee2e2" : "#fef9c3",
                    color: inv.status === "paid" ? "#166534" : inv.status === "overdue" ? "#991b1b" : "#854d0e",
                  }}>
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: "12px", fontSize: "12px", color: "#94a3b8" }}>
        ✅ {invoices.length} invoices loaded from real database
      </p>
    </div>
  );
}

const thStyle: React.CSSProperties = { padding: "12px 16px", fontSize: "13px", color: "#64748b", textAlign: "left", fontWeight: "600" };
const tdStyle: React.CSSProperties = { padding: "14px 16px", fontSize: "14px", color: "#334155" };
const deniedStyle: React.CSSProperties = { background: "#fee2e2", color: "#991b1b", padding: "20px", borderRadius: "8px" };