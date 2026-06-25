import { can, Role, ROLES } from "@/lib/rbac";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { CheckoutButton } from "./CheckoutButton";

export default async function PlansPage() {
  const store = await cookies();
  const raw = store.get("role")?.value;
  const CURRENT_ROLE: Role = ROLES.includes(raw as Role) ? (raw as Role) : "admin";

  if (!can(CURRENT_ROLE, "view_plans")) {
    return <div style={deniedStyle}>🚫 You don't have access to Plans.</div>;
  }

  const canChange = can(CURRENT_ROLE, "change_plan");

  const plans = await db.plan.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" },
  });

  const priceIds: Record<string, string> = {
    Starter: process.env.STRIPE_STARTER_PRICE_ID!,
    Growth: process.env.STRIPE_GROWTH_PRICE_ID!,
    Scale: process.env.STRIPE_SCALE_PRICE_ID!,
  };

  return (
    <div>
      <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>Plans</h1>
      <p style={{ color: "#64748b", marginBottom: "32px" }}>
        Choose the plan that fits your team.
      </p>

      <div style={{ display: "flex", gap: "20px" }}>
        {plans.map((plan, index) => (
          <div key={plan.id} style={{
            flex: 1, background: "#fff",
            border: index === 1 ? "2px solid #6366f1" : "1px solid #e2e8f0",
            borderRadius: "10px", padding: "24px", position: "relative",
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

            <CheckoutButton
              priceId={priceIds[plan.name]}
              planName={plan.name}
              canChange={canChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const deniedStyle: React.CSSProperties = {
  background: "#fee2e2", color: "#991b1b", padding: "20px", borderRadius: "8px",
};