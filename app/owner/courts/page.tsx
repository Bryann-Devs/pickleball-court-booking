import { OwnerCourtsManager } from "@/components/OwnerCourtsManager";
import { PageHeader } from "@/components/PageHeader";

export default function OwnerCourtsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Court owner"
        title="My courts"
        description="Add and manage the courts players will eventually discover and book."
      />

      <OwnerCourtsManager />
    </div>
  );
}
