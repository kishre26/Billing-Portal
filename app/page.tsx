import { can, Role, ROLES } from "@/lib/rbac";
import { PLANS, INVOICES } from "@/lib/data";
import { cookies } from "next/headers";

export default async function DashboardPage() {
  const store = await cookies();
  const raw = store.get("role")?.value;
  const CURRENT_ROLE: Role = ROLES.includes(raw as Role) ? (raw as Role) : "admin";

  const currentPlan = PLANS.find(p => p.current);
  const totalPaid = INVOICES.filter(inv => inv.status === "paid").reduce((sum, inv) => sum + inv.amount, 0);
  const overdueInvoices = INVOICES.filter(inv => inv.status === "overdue");

  if (!can(CURRENT_ROLE, "view_dashboard")) {
    return <div style={deniedStyle}>🚫 You don't have access to the dashboard.</div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: "24px", fontSize: "24px" }}>Dashboard</h1>
      <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
        <div style={cardStyle}>
          <div style={cardLabel}>Current Plan</div>
          <div style={cardValue}>{currentPlan?.name ?? "None"}</div>
          <div style={cardSub}>${currentPlan?.price}/month</div>
        </div>
        <div style={cardStyle}>
          <div style={cardLabel}>Total Paid</div>
          <div style={cardValue}>${totalPaid}</div>
          <div style={cardSub}>across {INVOICES.length} invoices</div>
        </div>
        <div style={{ ...cardStyle, borderLeft: overdueInvoices.length ? "4px solid #ef4444" : "4px solid #22c55e" }}>
          <div style={cardLabel}>Outstanding</div>
          <div style={{ ...cardValue, color: overdueInvoices.length ? "#ef4444" : "#22c55e" }}>
            {overdueInvoices.length ? `$${overdueInvoices.reduce((s, i) => s + i.amount, 0)}` : "$0"}
          </div>
          <div style={cardSub}>{overdueInvoices.length ? `${overdueInvoices.length} overdue` : "All settled"}</div>
        </div>
      </div>
      <h2 style={{ marginBottom: "12px", fontSize: "16px" }}>Recent Invoices</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "8px", overflow: "hidden" }}>
        <thead>
          <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Amount</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {INVOICES.slice(0, 3).map(inv => (
            <tr key={inv.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
              <td style={tdStyle}>{inv.id}</td>
              <td style={tdStyle}>{inv.description}</td>
              <td style={tdStyle}>{inv.date}</td>
              <td style={tdStyle}>${inv.amount}</td>
              <td style={tdStyle}>
                <span style={{
                  padding: "2px 8px", borderRadius: "4px", fontSize: "12px",
                  background: inv.status === "paid" ? "#dcfce7" : inv.status === "overdue" ? "#fee2e2" : "#fef9c3",
                  color: inv.status === "paid" ? "#166534" : inv.status === "overdue" ? "#991b1b" : "#854d0e",
                }}>{inv.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const cardStyle: React.CSSProperties = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px", flex: 1 };
const cardLabel: React.CSSProperties = { fontSize: "12px", color: "#64748b", marginBottom: "8px" };
const cardValue: React.CSSProperties = { fontSize: "28px", fontWeight: "bold", color: "#1e293b" };
const cardSub: React.CSSProperties   = { fontSize: "13px", color: "#94a3b8", marginTop: "4px" };
const thStyle: React.CSSProperties  = { padding: "12px 16px", fontSize: "13px", color: "#64748b" };
const tdStyle: React.CSSProperties  = { padding: "12px 16px", fontSize: "14px", color: "#334155" };
const deniedStyle: React.CSSProperties = { background: "#fee2e2", color: "#991b1b", padding: "20px", borderRadius: "8px" };