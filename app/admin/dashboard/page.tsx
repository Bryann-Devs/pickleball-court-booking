import { AdminDashboardStats } from "@/components/AdminDashboardStats";
import { PageHeader } from "@/components/PageHeader";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Admin"
        title="Admin dashboard"
        description="Review court submission status across the platform."
      />

      <AdminDashboardStats />
    </div>
  );
}
