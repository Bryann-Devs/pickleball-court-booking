import { BookingCard } from "@/components/BookingCard";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { bookings } from "@/lib/placeholders";

export default function BookingsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Player"
        title="Bookings"
        description="Review upcoming placeholder bookings. Real booking data will be connected later."
      />

      {bookings.length > 0 ? (
        <section className="grid gap-4 md:grid-cols-2">
          {bookings.map((booking) => (
            <BookingCard key={`${booking.court}-${booking.date}`} {...booking} />
          ))}
        </section>
      ) : (
        <EmptyState title="No bookings yet" description="Confirmed court reservations will appear here." />
      )}
    </div>
  );
}
