import { BookingCard } from "@/components/BookingCard";
import { PageHeader } from "@/components/PageHeader";
import { bookings } from "@/lib/placeholders";

export default function OwnerBookingsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Court owner"
        title="Owner bookings"
        description="A placeholder queue for future reservation approvals and changes."
      />

      <section className="grid gap-4 md:grid-cols-2">
        {bookings.map((booking) => (
          <BookingCard key={`${booking.court}-${booking.date}`} {...booking} />
        ))}
      </section>
    </div>
  );
}
