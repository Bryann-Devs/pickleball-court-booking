import { OwnerDashboardStats } from "@/components/OwnerDashboardStats";
import { PageHeader } from "@/components/PageHeader";

export default function OwnerDashboardPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Court owner"
        title="Owner dashboard"
        description="Track the status of your submitted courts."
      />

      <OwnerDashboardStats />
    </div>
  );
}
