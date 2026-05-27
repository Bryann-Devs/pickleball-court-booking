import { BookingCard } from "@/components/BookingCard";
import { PageHeader } from "@/components/PageHeader";
import { bookings } from "@/lib/placeholders";

export default function AdminBookingsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Admin"
        title="Bookings"
        description="Placeholder booking oversight for future admin workflows."
      />

      <section className="grid gap-4 md:grid-cols-2">
        {bookings.map((booking) => (
          <BookingCard key={`${booking.court}-${booking.date}`} {...booking} />
        ))}
      </section>
    </div>
  );
}
