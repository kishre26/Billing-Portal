import { can, Role, ROLES, ROLE_LABELS } from "@/lib/rbac";
import { TEAM } from "@/lib/data";
import { cookies } from "next/headers";

export default async function TeamPage() {
  const store = await cookies();
  const raw = store.get("role")?.value;
  const CURRENT_ROLE: Role = ROLES.includes(raw as Role) ? (raw as Role) : "admin";

  if (!can(CURRENT_ROLE, "view_team")) {
    return <div style={deniedStyle}>🚫 You don't have access to Team & Roles.</div>;
  }

  const canManage = can(CURRENT_ROLE, "manage_team_roles");

  return (
    <div>
      <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>Team & Roles</h1>
      <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "32px" }}>
        {canManage
          ? "As an Admin you can change any team member's role."
          : "You can view the team but cannot change roles."}
      </p>

      <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
        {ROLES.map(r => (
          <div key={r} style={{
            flex: 1, background: "#fff", border: "1px solid #e2e8f0",
            borderRadius: "8px", padding: "16px", textAlign: "center",
          }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#6366f1" }}>
              {TEAM.filter(m => m.role === r).length}
            </div>
            <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
              {ROLE_LABELS[r]}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Role</th>
            </tr>
          </thead>
          <tbody>
            {TEAM.map(member => (
              <tr key={member.id} style={{ borderTop: "1px solid #e2e8f0" }}>
                <td style={tdStyle}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "50%",
                      background: "#6366f1", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "13px", fontWeight: "600", flexShrink: 0,
                    }}>
                      {member.name.charAt(0)}
                    </div>
                    {member.name}
                  </div>
                </td>
                <td style={{ ...tdStyle, color: "#64748b" }}>{member.email}</td>
                <td style={tdStyle}>
                  {canManage ? (
                    <select
                      defaultValue={member.role}
                      style={{
                        border: "1px solid #e2e8f0", borderRadius: "6px",
                        padding: "6px 10px", fontSize: "13px",
                        color: "#334155", background: "#f8fafc", cursor: "pointer",
                      }}
                    >
                      {ROLES.map(r => (
                        <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                      ))}
                    </select>
                  ) : (
                    <span style={{
                      background: "#f1f5f9", color: "#475569",
                      padding: "4px 10px", borderRadius: "4px", fontSize: "13px",
                    }}>
                      {ROLE_LABELS[member.role]}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: "12px 16px", fontSize: "13px", color: "#64748b", textAlign: "left", fontWeight: "600",
};
const tdStyle: React.CSSProperties = {
  padding: "14px 16px", fontSize: "14px", color: "#334155",
};
const deniedStyle: React.CSSProperties = {
  background: "#fee2e2", color: "#991b1b", padding: "20px", borderRadius: "8px",
};