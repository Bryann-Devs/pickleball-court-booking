import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

const adminLinks = [
  { href: "/admin/users", label: "Users", value: "Role overview" },
  { href: "/admin/courts", label: "Courts", value: "Listing review" },
  { href: "/admin/bookings", label: "Bookings", value: "Platform activity" }
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Admin"
        title="Admin dashboard"
        description="A simple platform overview for future moderation and operations tools."
      />

      <section className="grid gap-4 md:grid-cols-3">
        {adminLinks.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-court-700">{item.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">{item.value}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
