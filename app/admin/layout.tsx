import { AuthGuard } from "@/components/AuthGuard";
import { DashboardShell } from "@/components/DashboardShell";

export default function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard allowedRoles={["admin"]}>
      <DashboardShell role="admin">{children}</DashboardShell>
    </AuthGuard>
  );
}
