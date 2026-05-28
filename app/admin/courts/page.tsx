import { AdminCourtsManager } from "@/components/AdminCourtsManager";

export default function AdminCourtsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <section className="rounded-[2rem] border border-white bg-white/80 p-5 shadow-soft sm:p-6">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700">Admin</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Courts</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Review pending court submissions and update approval status.
        </p>
      </section>

      <AdminCourtsManager />
    </div>
  );
}
