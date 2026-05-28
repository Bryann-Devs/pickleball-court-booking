"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import type { UserRole } from "@/lib/auth";

type CourtStatus = "pending" | "approved" | "rejected" | "inactive";

type ProfileRow = {
  id: string;
  created_at: string | null;
  full_name: string | null;
  phone: string | null;
  role: UserRole | null;
};

type CourtRow = {
  id: string;
  address: string;
  city: string;
  court_count: number;
  created_at: string;
  name: string;
  owner_id: string;
  price_per_hour: number;
  status: CourtStatus;
  updated_at: string | null;
};

type Stats = {
  admins: number;
  approvedCourts: number;
  courtOwners: number;
  inactiveCourts: number;
  pendingCourts: number;
  players: number;
  rejectedCourts: number;
  totalCourts: number;
  totalUsers: number;
};

type ActivityDay = {
  courts: number;
  key: string;
  label: string;
  users: number;
};

const pesoFormatter = new Intl.NumberFormat("en-PH", {
  currency: "PHP",
  maximumFractionDigits: 0,
  style: "currency"
});

const statusLabels: Record<CourtStatus, string> = {
  approved: "Approved",
  inactive: "Inactive",
  pending: "Pending",
  rejected: "Rejected"
};

const statusStyles: Record<CourtStatus, string> = {
  approved: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  inactive: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  rejected: "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
};

const statCards = [
  { helper: "Registered accounts", icon: "users", key: "totalUsers", label: "Total Users" },
  { helper: "Player profiles", icon: "player", key: "players", label: "Players" },
  { helper: "Court operators", icon: "owner", key: "courtOwners", label: "Court Owners" },
  { helper: "Platform admins", icon: "shield", key: "admins", label: "Admins" },
  { helper: "All submitted courts", icon: "court", key: "totalCourts", label: "Total Courts" },
  { helper: "Need review", icon: "clock", key: "pendingCourts", label: "Pending Approvals" },
  { helper: "Visible to players", icon: "check", key: "approvedCourts", label: "Approved Courts" },
  { helper: "Declined submissions", icon: "x", key: "rejectedCourts", label: "Rejected Courts" }
] as const;

type StatKey = (typeof statCards)[number]["key"];

export function AdminDashboardStats() {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [courts, setCourts] = useState<CourtRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingId, setIsSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError("Supabase is not configured yet.");
      setIsLoading(false);
      return;
    }

    const [profilesResult, courtsResult] = await Promise.all([
      supabase.from("profiles").select("id, full_name, phone, role, created_at").order("created_at", { ascending: false }),
      supabase
        .from("courts")
        .select("id, owner_id, name, address, city, price_per_hour, court_count, status, created_at, updated_at")
        .order("created_at", { ascending: false })
    ]);

    if (profilesResult.error) {
      setError(profilesResult.error.message);
      setIsLoading(false);
      return;
    }

    if (courtsResult.error) {
      setError(courtsResult.error.message);
      setIsLoading(false);
      return;
    }

    setProfiles((profilesResult.data ?? []) as ProfileRow[]);
    setCourts((courtsResult.data ?? []) as CourtRow[]);
    setError(null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const stats = useMemo<Stats>(() => {
    return {
      admins: profiles.filter((profile) => profile.role === "admin").length,
      approvedCourts: courts.filter((court) => court.status === "approved").length,
      courtOwners: profiles.filter((profile) => profile.role === "court_owner").length,
      inactiveCourts: courts.filter((court) => court.status === "inactive").length,
      pendingCourts: courts.filter((court) => court.status === "pending").length,
      players: profiles.filter((profile) => profile.role === "player").length,
      rejectedCourts: courts.filter((court) => court.status === "rejected").length,
      totalCourts: courts.length,
      totalUsers: profiles.length
    };
  }, [courts, profiles]);

  const activityDays = useMemo(() => getLastSevenDays(profiles, courts), [courts, profiles]);
  const recentActivity = useMemo(() => getRecentActivity(profiles, courts), [courts, profiles]);
  const profileById = useMemo(() => new Map(profiles.map((profile) => [profile.id, profile])), [profiles]);
  const pendingCourts = useMemo(() => courts.filter((court) => court.status === "pending").slice(0, 4), [courts]);
  const adminProfile = profiles.find((profile) => profile.role === "admin");

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
    await loadDashboard();
    setIsSavingId(null);
  }

  if (error) {
    return <p className="rounded-3xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 shadow-sm">{error}</p>;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="flex flex-col gap-4 rounded-[2rem] border border-white bg-white/80 p-5 shadow-soft sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700">PickleBook Control Center</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Admin Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Monitor courts, users, approvals, and platform activity.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <AdminIcon name="bell" />
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#082f26] text-sm font-black text-lime-200">
            {getInitials(adminProfile?.full_name)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-slate-950">{adminProfile?.full_name || "Admin User"}</p>
            <p className="text-xs font-semibold text-slate-500">Super Admin</p>
          </div>
        </div>
      </section>

      {message ? (
        <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-sm" role="status">
          {message}
        </p>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <article key={card.key} className="rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <AdminIcon name={card.icon} />
              </div>
              <span className="rounded-full bg-lime-100 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-emerald-950">
                Live
              </span>
            </div>
            <p className="mt-5 text-3xl font-black text-slate-950">{isLoading ? "..." : stats[card.key as StatKey]}</p>
            <p className="mt-1 text-sm font-black text-slate-900">{card.label}</p>
            <p className="mt-2 text-xs font-semibold text-slate-500">{card.helper}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
        <ActivityLineChart data={activityDays} isLoading={isLoading} />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-1">
          <StatusBarChart
            data={[
              { color: "bg-amber-400", label: "Pending", value: stats.pendingCourts },
              { color: "bg-emerald-500", label: "Approved", value: stats.approvedCourts },
              { color: "bg-rose-500", label: "Rejected", value: stats.rejectedCourts },
              { color: "bg-slate-400", label: "Inactive", value: stats.inactiveCourts }
            ]}
            isLoading={isLoading}
            title="Court Submissions"
          />
          <DonutChart
            data={[
              { color: "#10b981", label: "Players", value: stats.players },
              { color: "#84cc16", label: "Court Owners", value: stats.courtOwners },
              { color: "#082f26", label: "Admins", value: stats.admins }
            ]}
            isLoading={isLoading}
            title="User Roles"
          />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(320px,0.75fr)_minmax(0,1.25fr)]">
        <RecentActivityCard activities={recentActivity} isLoading={isLoading} />
        <PendingApprovalsCard
          courts={pendingCourts}
          isLoading={isLoading}
          isSavingId={isSavingId}
          onUpdateStatus={updateStatus}
          profileById={profileById}
        />
      </section>
    </div>
  );
}

function getLastSevenDays(profiles: ProfileRow[], courts: CourtRow[]): ActivityDay[] {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    const key = toDateKey(date);

    return {
      courts: 0,
      key,
      label: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      users: 0
    };
  });

  const byKey = new Map(days.map((day) => [day.key, day]));

  profiles.forEach((profile) => {
    if (!profile.created_at) {
      return;
    }

    const day = byKey.get(toDateKey(new Date(profile.created_at)));

    if (day) {
      day.users += 1;
    }
  });

  courts.forEach((court) => {
    const day = byKey.get(toDateKey(new Date(court.created_at)));

    if (day) {
      day.courts += 1;
    }
  });

  return days;
}

function getRecentActivity(profiles: ProfileRow[], courts: CourtRow[]) {
  return [
    ...profiles
      .filter((profile) => profile.created_at)
      .map((profile) => ({
        date: profile.created_at!,
        detail: profile.full_name || profile.phone || "Unnamed user",
        title: "New user registered",
        type: "user" as const
      })),
    ...courts.map((court) => ({
      date: court.created_at,
      detail: `${court.name} in ${court.city}`,
      title: "New court submitted",
      type: "court" as const
    }))
  ]
    .sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime())
    .slice(0, 5);
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getInitials(name: string | null | undefined) {
  if (!name) {
    return "AU";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function ActivityLineChart({ data, isLoading }: { data: ActivityDay[]; isLoading: boolean }) {
  const maxValue = Math.max(1, ...data.flatMap((day) => [day.users, day.courts]));
  const width = 640;
  const height = 240;
  const padding = 28;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;
  const userPoints = data.map((day, index) => pointFor(index, day.users, data.length, maxValue, usableWidth, usableHeight, padding));
  const courtPoints = data.map((day, index) => pointFor(index, day.courts, data.length, maxValue, usableWidth, usableHeight, padding));
  const hasActivity = data.some((day) => day.users > 0 || day.courts > 0);

  return (
    <article className="rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-950">Platform Activity</h2>
          <p className="mt-1 text-sm text-slate-500">New users and court submissions over the last 7 days.</p>
        </div>
        <div className="flex gap-3 text-xs font-bold text-slate-600">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Users
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-lime-400" />
            Courts
          </span>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl bg-slate-50 p-3">
        <svg className="h-64 w-full" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Platform activity chart">
          <path d={`M ${padding} ${height - padding} H ${width - padding}`} className="stroke-slate-200" />
          <path d={`M ${padding} ${padding} V ${height - padding}`} className="stroke-slate-200" />
          {[0.25, 0.5, 0.75].map((position) => {
            const y = padding + usableHeight * position;

            return <path key={position} d={`M ${padding} ${y} H ${width - padding}`} className="stroke-slate-200/80" />;
          })}
          <polyline fill="none" points={userPoints.join(" ")} stroke="#10b981" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
          <polyline fill="none" points={courtPoints.join(" ")} stroke="#a3e635" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
          {userPoints.map((point) => {
            const [x, y] = point.split(",").map(Number);

            return <circle key={`user-${point}`} cx={x} cy={y} fill="#10b981" r="4" />;
          })}
          {courtPoints.map((point) => {
            const [x, y] = point.split(",").map(Number);

            return <circle key={`court-${point}`} cx={x} cy={y} fill="#a3e635" r="4" />;
          })}
        </svg>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 sm:text-xs">
        {data.map((day) => (
          <span key={day.key}>{day.label}</span>
        ))}
      </div>

      {!isLoading && !hasActivity ? (
        <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          No new users or court submissions in the last 7 days yet.
        </p>
      ) : null}
    </article>
  );
}

function pointFor(
  index: number,
  value: number,
  total: number,
  maxValue: number,
  usableWidth: number,
  usableHeight: number,
  padding: number
) {
  const x = padding + (total === 1 ? 0 : (usableWidth / (total - 1)) * index);
  const y = padding + usableHeight - (value / maxValue) * usableHeight;

  return `${x},${y}`;
}

function StatusBarChart({
  data,
  isLoading,
  title
}: {
  data: Array<{ color: string; label: string; value: number }>;
  isLoading: boolean;
  title: string;
}) {
  const maxValue = Math.max(1, ...data.map((item) => item.value));

  return (
    <article className="rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black text-slate-950">{title}</h2>
      <div className="mt-5 space-y-4">
        {data.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-slate-700">{item.label}</span>
              <span className="font-black text-slate-950">{isLoading ? "..." : item.value}</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full ${item.color}`} style={{ width: `${(item.value / maxValue) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function DonutChart({
  data,
  isLoading,
  title
}: {
  data: Array<{ color: string; label: string; value: number }>;
  isLoading: boolean;
  title: string;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let current = 0;
  const gradient =
    total > 0
      ? data
          .map((item) => {
            const start = current;
            current += (item.value / total) * 100;

            return `${item.color} ${start}% ${current}%`;
          })
          .join(", ")
      : "#e2e8f0 0% 100%";

  return (
    <article className="rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black text-slate-950">{title}</h2>
      <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row xl:flex-col 2xl:flex-row">
        <div
          className="flex h-36 w-36 shrink-0 items-center justify-center rounded-full"
          style={{ background: `conic-gradient(${gradient})` }}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-xl font-black text-slate-950">
            {isLoading ? "..." : total}
          </div>
        </div>
        <div className="w-full space-y-3">
          {data.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 font-bold text-slate-700">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                {item.label}
              </span>
              <span className="font-black text-slate-950">{isLoading ? "..." : item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function RecentActivityCard({
  activities,
  isLoading
}: {
  activities: Array<{ date: string; detail: string; title: string; type: "court" | "user" }>;
  isLoading: boolean;
}) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black text-slate-950">Recent Activity</h2>
      <div className="mt-5 space-y-4">
        {isLoading ? (
          <p className="text-sm font-semibold text-slate-500">Loading activity...</p>
        ) : activities.length === 0 ? (
          <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500">
            No platform activity yet.
          </p>
        ) : (
          activities.map((activity) => (
            <div key={`${activity.type}-${activity.date}-${activity.detail}`} className="flex gap-3">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <AdminIcon name={activity.type === "court" ? "court" : "users"} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-slate-950">{activity.title}</p>
                <p className="truncate text-sm text-slate-600">{activity.detail}</p>
                <p className="mt-1 text-xs font-semibold text-slate-400">{new Date(activity.date).toLocaleString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </article>
  );
}

function PendingApprovalsCard({
  courts,
  isLoading,
  isSavingId,
  onUpdateStatus,
  profileById
}: {
  courts: CourtRow[];
  isLoading: boolean;
  isSavingId: string | null;
  onUpdateStatus: (courtId: string, status: Extract<CourtStatus, "approved" | "rejected">) => void;
  profileById: Map<string, ProfileRow>;
}) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-950">Pending Court Approvals</h2>
          <p className="mt-1 text-sm text-slate-500">Review new court submissions before they appear publicly.</p>
        </div>
        <Link
          href="/admin/courts?status=pending"
          className="rounded-full bg-emerald-950 px-4 py-2 text-center text-sm font-black text-lime-200 transition hover:bg-emerald-900"
        >
          View all pending
        </Link>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {isLoading ? (
          <p className="text-sm font-semibold text-slate-500">Loading pending courts...</p>
        ) : courts.length === 0 ? (
          <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500">
            No pending court approvals right now.
          </p>
        ) : (
          courts.map((court) => {
            const owner = profileById.get(court.owner_id);

            return (
              <div key={court.id} className="rounded-3xl border border-amber-200 bg-amber-50/50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-black text-slate-950">{court.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {court.address}, {court.city}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${statusStyles[court.status]}`}>
                    {statusLabels[court.status]}
                  </span>
                </div>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-black uppercase tracking-wide text-slate-400">Owner</dt>
                    <dd className="mt-1 font-semibold text-slate-700">{owner?.full_name || owner?.phone || court.owner_id}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-black uppercase tracking-wide text-slate-400">Submitted</dt>
                    <dd className="mt-1 font-semibold text-slate-700">{new Date(court.created_at).toLocaleDateString()}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-black uppercase tracking-wide text-slate-400">Price</dt>
                    <dd className="mt-1 font-semibold text-slate-700">{pesoFormatter.format(court.price_per_hour)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-black uppercase tracking-wide text-slate-400">Courts</dt>
                    <dd className="mt-1 font-semibold text-slate-700">{court.court_count}</dd>
                  </div>
                </dl>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(court.id, "approved")}
                    disabled={isSavingId === court.id}
                    className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(court.id, "rejected")}
                    disabled={isSavingId === court.id}
                    className="rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm font-black text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:text-slate-400"
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </article>
  );
}

function AdminIcon({ name }: { name: string }) {
  const common = {
    className: "h-5 w-5",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2,
    viewBox: "0 0 24 24"
  };

  switch (name) {
    case "bell":
      return (
        <svg {...common}>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "court":
      return (
        <svg {...common}>
          <rect height="16" rx="2" width="18" x="3" y="4" />
          <path d="M12 4v16" />
          <path d="M3 12h18" />
        </svg>
      );
    case "owner":
      return (
        <svg {...common}>
          <path d="M3 21h18" />
          <path d="M4 21V8l8-5 8 5v13" />
          <path d="M9 21v-6h6v6" />
        </svg>
      );
    case "player":
      return (
        <svg {...common}>
          <circle cx="12" cy="7" r="4" />
          <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        </svg>
      );
    case "x":
      return (
        <svg {...common}>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
  }
}
