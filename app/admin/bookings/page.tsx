export default function AdminBookingsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <section className="rounded-[2rem] border border-white bg-white/80 p-5 shadow-soft sm:p-6">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700">Admin</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Bookings</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Reservation oversight will be available after booking logic is implemented.
        </p>
      </section>

      <section className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-700">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect height="18" rx="3" width="18" x="3" y="4" />
            <path d="M3 10h18" />
          </svg>
        </div>
        <h2 className="mt-5 text-xl font-black text-slate-950">Bookings coming soon</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
          Bookings will appear here once players can request court reservations.
        </p>
      </section>
    </div>
  );
}
