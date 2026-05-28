import { AdminAnalyticsSummary } from "@/components/AdminAnalyticsSummary";

export default function AdminAnalyticsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <section className="py-2">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">Admin</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-[#071832]">Analytics</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Platform counts and distributions from current users and court listings.
        </p>
      </section>

      <AdminAnalyticsSummary />
    </div>
  );
}
