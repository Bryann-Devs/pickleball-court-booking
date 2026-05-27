import { AuthGuard } from "@/components/AuthGuard";
import { DashboardShell } from "@/components/DashboardShell";

export default function OwnerLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard allowedRoles={["court_owner", "admin"]}>
      <DashboardShell role="owner">{children}</DashboardShell>
    </AuthGuard>
  );
}
