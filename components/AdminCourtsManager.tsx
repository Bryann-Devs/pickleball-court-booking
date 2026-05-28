"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type CourtStatus = "pending" | "approved" | "rejected" | "inactive";
type StatusFilter = "all" | CourtStatus;

type AdminCourt = {
  id: string;
  address: string;
  city: string;
  court_count: number;
  created_at: string;
  description: string | null;
  name: string;
  price_per_hour: number;
  status: CourtStatus;
};

const pesoFormatter = new Intl.NumberFormat("en-PH", {
  currency: "PHP",
  style: "currency"
});

const filters: Array<{ label: string; value: StatusFilter }> = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Inactive", value: "inactive" }
];

const statusStyles: Record<CourtStatus, string> = {
  approved: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  inactive: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  rejected: "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
};

export function AdminCourtsManager() {
  const [courts, setCourts] = useState<AdminCourt[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingId, setIsSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadCourts = useCallback(async () => {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError("Supabase is not configured yet.");
      setIsLoading(false);
      return;
    }

    const { data, error: courtsError } = await supabase
      .from("courts")
      .select("id, name, address, city, description, price_per_hour, court_count, status, created_at")
      .order("created_at", { ascending: false });

    if (courtsError) {
      setError(courtsError.message);
      setIsLoading(false);
      return;
    }

    setCourts((data ?? []) as AdminCourt[]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");

    if (isStatusFilter(status)) {
      setFilter(status);
    }

    loadCourts();
  }, [loadCourts]);

  const filteredCourts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return courts.filter((court) => {
      const matchesStatus = filter === "all" || court.status === filter;
      const matchesQuery =
        !normalizedQuery ||
        court.name.toLowerCase().includes(normalizedQuery) ||
        court.city.toLowerCase().includes(normalizedQuery) ||
        court.address.toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });
  }, [courts, filter, query]);

  async function updateStatus(courtId: string, status: Extract<CourtStatus, "approved" | "rejected">) {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError("Supabase is not configured yet.");
      return;
    }

    setError(null);
    setMessage(null);
    setIsSavingId(courtId);

    const { error: updateError } = await supabase.from("courts").update({ status }).eq("id", courtId);

    if (updateError) {
      setError(updateError.message);
      setIsSavingId(null);
      return;
    }

    setMessage(`Court ${status}.`);
    await loadCourts();
    setIsSavingId(null);
  }

  if (isLoading) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-600 shadow-sm">Loading courts...</div>;
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.045)]">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
          <label className="block text-sm font-bold text-slate-700">
            Search courts
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-emerald-500 focus:bg-white"
              placeholder="Search by court, city, or address"
            />
          </label>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-black transition ${
                  filter === item.value
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {message ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700" role="status">
          {message}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700" role="alert">
          {error}
        </p>
      ) : null}

      {filteredCourts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-black text-slate-950">No courts found</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
            Court submissions will appear here when they match the current search or status filter.
          </p>
        </div>
      ) : (
        <section className="grid gap-4 xl:grid-cols-2">
          {filteredCourts.map((court) => {
            const isPending = court.status === "pending";

            return (
              <article
                key={court.id}
                className={`rounded-2xl border bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.045)] transition sm:p-5 ${
                  isPending ? "border-amber-200 shadow-amber-100" : "border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black text-[#071832]">{court.name}</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {court.address}, {court.city}
                    </p>
                    <p className="mt-1 text-xs font-bold text-slate-400">
                      Submitted {new Date(court.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-black capitalize ${statusStyles[court.status]}`}>
                    {court.status}
                  </span>
                </div>

                {court.description ? <p className="mt-4 text-sm leading-6 text-slate-600">{court.description}</p> : null}

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">Price</p>
                    <p className="mt-1 font-black text-slate-900">{pesoFormatter.format(court.price_per_hour)}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">Courts</p>
                    <p className="mt-1 font-black text-slate-900">{court.court_count}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => updateStatus(court.id, "approved")}
                    disabled={isSavingId === court.id || court.status !== "pending"}
                    className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus(court.id, "rejected")}
                    disabled={isSavingId === court.id || court.status !== "pending"}
                    className="rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-bold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                  >
                    Reject
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}

function isStatusFilter(value: string | null): value is StatusFilter {
  return value === "all" || value === "pending" || value === "approved" || value === "rejected" || value === "inactive";
}
