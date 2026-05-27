import { AdminUsersManager } from "@/components/AdminUsersManager";
import { PageHeader } from "@/components/PageHeader";

export default function AdminUsersPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Admin"
        title="Users"
        description="Review registered players, court owners, and admins."
      />

      <AdminUsersManager />
    </div>
  );
}
