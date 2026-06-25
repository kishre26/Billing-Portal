import { can, Role, ROLES } from "@/lib/rbac";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export default async function PlansPage() {
  const store = await cookies();
  const raw = store.get("role")?.value;
  const CURRENT_ROLE: Role = ROLES.includes(raw as Role) ? (raw as Role) : "admin";

  if (!can(CURRENT_ROLE, "view_plans")) {
    return <div style={deniedStyle}>🚫 You don't have access to Plans.</div>;
  }

  const canChange = can(CURRENT_ROLE, "change_plan");

  // ✅ Reading from real database now!
  const plans = await db.plan.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" },
  });

  return (
    <div>
      <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>Plans</h1>
      <p style={{ color: "#64748b", marginBottom: "32px" }}>
        Choose the plan that fits your team.
      </p>

      <div style={{ display: "flex", gap: "20px" }}>
        {plans.map((plan, index) => (
          <div key={plan.id} style={{
            flex: 1,
            background: "#fff",
            border: index === 1 ? "2px solid #6366f1" : "1px solid #e2e8f0",
            borderRadius: "10px",
            padding: "24px",
            position: "relative",
          }}>
            {index === 1 && (
              <div style={{
                position: "absolute", top: "12px", right: "12px",
                background: "#6366f1", color: "#fff",
                fontSize: "11px", padding: "2px 8px", borderRadius: "4px",
              }}>
                POPULAR
              </div>
            )}
            <h2 style={{ fontSize: "20px", marginBottom: "4px" }}>{plan.name}</h2>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#1e293b", marginBottom: "4px" }}>
              ${plan.price}
              <span style={{ fontSize: "14px", fontWeight: "normal", color: "#94a3b8" }}>/month</span>
            </div>
            <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>
              Up to {plan.seats} seats
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {plan.features.map((f: string) => (
                <li key={f} style={{ fontSize: "14px", color: "#475569", display: "flex", gap: "8px" }}>
                  <span style={{ color: "#22c55e" }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <button
              disabled={!canChange}
              style={{
                width: "100%", padding: "10px", borderRadius: "6px", border: "none",
                background: canChange ? "#6366f1" : "#e2e8f0",
                color: canChange ? "#fff" : "#94a3b8",
                cursor: canChange ? "pointer" : "not-allowed",
                fontSize: "14px", fontWeight: "500",
              }}
            >
              {canChange ? `Select ${plan.name}` : "No permission to change plan"}
            </button>
          </div>
        ))}
      </div>

      <p style={{ marginTop: "16px", fontSize: "12px", color: "#94a3b8" }}>
        ✅ Plans loaded from real database
      </p>
    </div>
  );
}

const deniedStyle: React.CSSProperties = {
  background: "#fee2e2", color: "#991b1b", padding: "20px", borderRadius: "8px",
};