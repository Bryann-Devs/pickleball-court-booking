export default function AdminSettingsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <section className="rounded-[2rem] border border-white bg-white/80 p-5 shadow-soft sm:p-6">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700">Admin</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Settings</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Platform configuration will live here in a later release.
        </p>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700">Coming Soon</p>
            <h2 className="mt-3 text-2xl font-black text-slate-950">Admin settings are planned for a later release.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Future settings may include platform rules, booking policies, support contact details, and court approval
              requirements.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:w-96">
            {["Platform rules", "Booking policies", "Support contact", "Court approval requirements"].map((item) => (
              <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm font-black text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
