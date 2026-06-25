import { can, Role, ROLES } from "@/lib/rbac";
import { cookies } from "next/headers";
import { getOrCreateUser } from "@/lib/user";
import { db } from "@/lib/db";

export default async function PaymentMethodsPage() {
  const store = await cookies();
  const raw = store.get("role")?.value;
  const CURRENT_ROLE: Role = ROLES.includes(raw as Role) ? (raw as Role) : "admin";

  if (!can(CURRENT_ROLE, "view_payment_methods")) {
    return <div style={deniedStyle}>🚫 You don't have access to Payment Methods.</div>;
  }

  const canManage = can(CURRENT_ROLE, "manage_payment_methods");
  const user = await getOrCreateUser();
  if (!user) return <div style={deniedStyle}>Not logged in.</div>;

  const paymentMethods = await db.paymentMethod.findMany({
    where: { userId: user.id },
    orderBy: { isDefault: "desc" },
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px" }}>Payment Methods</h1>
        <button
          disabled={!canManage}
          style={{
            padding: "8px 16px", borderRadius: "6px", border: "none",
            background: canManage ? "#6366f1" : "#e2e8f0",
            color: canManage ? "#fff" : "#94a3b8",
            cursor: canManage ? "pointer" : "not-allowed",
            fontSize: "14px",
          }}
        >
          + Add Card
        </button>
      </div>

      {!canManage && (
        <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "16px" }}>
          Your role cannot add or remove payment methods.
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {paymentMethods.map(pm => (
          <div key={pm.id} style={{
            background: "#fff",
            border: pm.isDefault ? "2px solid #6366f1" : "1px solid #e2e8f0",
            borderRadius: "10px", padding: "20px 24px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{
                background: "#f1f5f9", borderRadius: "6px", padding: "8px 14px",
                fontSize: "14px", fontWeight: "600", color: "#334155",
              }}>
                {pm.brand}
              </div>
              <div>
                <div style={{ fontSize: "15px", fontWeight: "500", color: "#1e293b" }}>
                  •••• •••• •••• {pm.last4}
                </div>
                <div style={{ fontSize: "13px", color: "#94a3b8" }}>Expires {pm.expiry}</div>
              </div>
              {pm.isDefault && (
                <span style={{
                  background: "#ede9fe", color: "#6d28d9",
                  fontSize: "11px", fontWeight: "600",
                  padding: "2px 8px", borderRadius: "4px",
                }}>
                  DEFAULT
                </span>
              )}
            </div>
            {canManage && !pm.isDefault && (
              <button style={{
                background: "none", border: "1px solid #fca5a5",
                color: "#ef4444", borderRadius: "6px",
                padding: "6px 12px", fontSize: "13px", cursor: "pointer",
              }}>
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
      <p style={{ marginTop: "16px", fontSize: "12px", color: "#94a3b8" }}>
        ✅ Payment methods loaded from real database
      </p>
    </div>
  );
}

const deniedStyle: React.CSSProperties = {
  background: "#fee2e2", color: "#991b1b", padding: "20px", borderRadius: "8px",
};