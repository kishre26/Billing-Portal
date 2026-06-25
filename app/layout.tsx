import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Role, ROLES } from "@/lib/rbac";
import { cookies } from "next/headers";

async function getRole(): Promise<Role> {
  const store = await cookies();
  const value = store.get("role")?.value;
  return ROLES.includes(value as Role) ? (value as Role) : "admin";
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const role = await getRole();

  return (
    <ClerkProvider>
      <html lang="en">
        <body style={{ margin: 0, display: "flex" }}>
          <Sidebar role={role} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Header role={role} />
            <main style={{ padding: "32px", background: "#f8fafc", minHeight: "100vh" }}>
              {children}
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}