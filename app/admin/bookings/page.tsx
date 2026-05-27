import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";

export default function AdminBookingsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Admin"
        title="Bookings"
        description="Reservation oversight will be available after booking logic is implemented."
      />

      <EmptyState
        title="Bookings coming soon"
        description="Bookings will appear here once players can request court reservations."
      />
    </div>
  );
}
