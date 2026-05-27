"use client";

import { useMemo, useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import type { UserRole } from "@/lib/auth";

type AdminProfile = {
  id: string;
  created_at: string | null;
  full_name: string | null;
  phone: string | null;
  role: UserRole | null;
};

type RoleFilter = "all" | UserRole;

const roleFilters: Array<{ label: string; value: RoleFilter }> = [
  { label: "All", value: "all" },
  { label: "Players", value: "player" },
  { label: "Court owners", value: "court_owner" },
  { label: "Admins", value: "admin" }
];

const roleBadgeStyles: Record<UserRole, string> = {
  admin: "bg-slate-900 text-white",
  court_owner: "bg-court-50 text-court-700",
  player: "bg-slate-100 text-slate-700"
};

export function AdminUsersManager() {
  const [profiles, setProfiles] = useState<AdminProfile[]>([]);
  const [filter, setFilter] = useState<RoleFilter>("all");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfiles() {
      const supabase = createSupabaseBrowserClient();

      if (!supabase) {
        setError("Supabase is not configured yet.");
        setIsLoading(false);
        return;
      }

      const { data, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, phone, role, created_at")
        .order("created_at", { ascending: false });

      if (profilesError) {
        setError(profilesError.message);
        setIsLoading(false);
        return;
      }

      setProfiles((data ?? []) as AdminProfile[]);
      setIsLoading(false);
    }

    loadProfiles();
  }, []);

  const filteredProfiles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return profiles.filter((profile) => {
      const matchesRole = filter === "all" || profile.role === filter;
      const matchesQuery =
        !normalizedQuery ||
        profile.full_name?.toLowerCase().includes(normalizedQuery) ||
        profile.phone?.toLowerCase().includes(normalizedQuery);

      return matchesRole && matchesQuery;
    });
  }, [filter, profiles, query]);

  if (error) {
    return <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <label className="block text-sm font-medium text-slate-700">
          Search users
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-court-500"
            placeholder="Search by name or phone"
          />
        </label>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {roleFilters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
                filter === item.value ? "bg-court-600 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">Loading users...</div>
      ) : filteredProfiles.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
          <h2 className="text-base font-semibold text-slate-950">No users found</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
            Try another role filter or search term.
          </p>
        </div>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProfiles.map((profile) => {
            const role = profile.role ?? "player";

            return (
              <article key={profile.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-slate-950">{profile.full_name || "Unnamed user"}</h2>
                    <p className="mt-1 text-sm text-slate-600">{profile.phone || "No phone saved"}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${roleBadgeStyles[role]}`}>
                    {role}
                  </span>
                </div>
                <p className="mt-4 text-xs font-medium text-slate-500">
                  Created {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "Unknown"}
                </p>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
