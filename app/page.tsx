import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

const roleCards = [
  {
    title: "Players",
    description: "Find nearby courts, compare availability, and keep upcoming bookings in one place."
  },
  {
    title: "Court Owners",
    description: "Prepare court listings, booking views, and schedule tools for future operations."
  },
  {
    title: "Admins",
    description: "Set up the foundation for managing users, courts, bookings, and platform health."
  }
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1fr_0.95fr] lg:items-center">
        <div className="space-y-5">
          <PageHeader
            eyebrow="PickleBook"
            title="Book pickleball courts without the back-and-forth."
            description="A centralized booking and management platform for players, court owners, and admins."
          />

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/courts"
              className="rounded-lg bg-court-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-soft transition hover:bg-court-500"
            >
              Browse courts
            </Link>
            <Link
              href="/owner/dashboard"
              className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-800 transition hover:border-court-200 hover:text-court-700"
            >
              Owner dashboard
            </Link>
          </div>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-200 shadow-soft sm:aspect-[16/10]">
          <Image
            src="/images/court-hero.png"
            alt="Outdoor pickleball court ready for play"
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 48vw, 100vw"
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {roleCards.map((role) => (
          <article key={role.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-950">{role.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{role.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
