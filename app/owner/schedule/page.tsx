import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";

export default function OwnerSchedulePage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Court owner"
        title="Schedule"
        description="Schedule management will be added after court listings are ready."
      />

      <EmptyState
        title="Schedule tools coming next"
        description="This page is reserved for weekly hours, blocked times, and court-specific availability."
      />
    </div>
  );
}
