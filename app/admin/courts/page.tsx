import { AdminCourtsManager } from "@/components/AdminCourtsManager";
import { PageHeader } from "@/components/PageHeader";

export default function AdminCourtsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Admin"
        title="Courts"
        description="Review pending court submissions and update approval status."
      />

      <AdminCourtsManager />
    </div>
  );
}
