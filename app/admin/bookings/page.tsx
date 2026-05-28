export default function AdminBookingsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <section className="py-2">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">Admin</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-[#071832]">Bookings</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Reservation oversight will be available after booking logic is implemented.
        </p>
      </section>

      <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-[0_10px_28px_rgba(15,23,42,0.045)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect height="18" rx="3" width="18" x="3" y="4" />
            <path d="M3 10h18" />
          </svg>
        </div>
        <h2 className="mt-5 text-xl font-black text-[#071832]">Bookings coming soon</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
          Bookings will appear here once players can request court reservations.
        </p>
      </section>
    </div>
  );
}
