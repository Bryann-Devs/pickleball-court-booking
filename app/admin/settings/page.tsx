import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Admin"
        title="Settings"
        description="Platform configuration will live here in a later release."
      />

      <EmptyState
        title="Settings coming soon"
        description="Future settings may include platform rules, booking policies, and support contact details."
      />
    </div>
  );
}
