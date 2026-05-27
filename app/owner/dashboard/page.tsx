import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

const ownerLinks = [
  { href: "/owner/courts", label: "Manage courts", value: "3 draft courts" },
  { href: "/owner/bookings", label: "Review bookings", value: "8 placeholder requests" },
  { href: "/owner/schedule", label: "Edit schedule", value: "Weekly view" }
];

export default function OwnerDashboardPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Court owner"
        title="Owner dashboard"
        description="A starting point for future court, booking, and schedule management."
      />

      <section className="grid gap-4 md:grid-cols-3">
        {ownerLinks.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-court-700">{item.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">{item.value}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
