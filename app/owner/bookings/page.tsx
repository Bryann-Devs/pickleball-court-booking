import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";

export default function OwnerBookingsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Court owner"
        title="Owner bookings"
        description="Booking management will be added after court listings are ready."
      />

      <EmptyState
        title="Booking tools coming soon"
        description="Court booking requests will appear here once booking logic is implemented."
      />
    </div>
  );
}
