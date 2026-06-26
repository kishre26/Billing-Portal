"use client";

import { Role, ROLES, ROLE_LABELS } from "@/lib/rbac";
import { useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";

export function Header({ role }: { role: Role }) {
  const router = useRouter();
  const { user } = useUser();

  function handleRoleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    document.cookie = `role=${e.target.value}; path=/`;
    router.refresh();
  }

  return (
    <header style={{
      background: "#fff",
      borderBottom: "1px solid #e2e8f0",
      padding: "16px 32px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}>
      <div style={{ fontSize: "14px", color: "#64748b" }}>
        Welcome, <strong>{user?.firstName ?? "there"}</strong>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label style={{ fontSize: "13px", color: "#64748b" }}>Viewing as:</label>
          <select
            value={role}
            onChange={handleRoleChange}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              padding: "6px 12px",
              fontSize: "13px",
              color: "#334155",
              background: "#f8fafc",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            {ROLES.map(r => (
              <option key={r} value={r}>{ROLE_LABELS[r]}</option>
            ))}
          </select>
        </div>

        {/* Clerk's UserButton — shows avatar, name, and sign out option */}
        <UserButton />
      </div>
    </header>
  );
}