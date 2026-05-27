import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export type UserRole = "player" | "court_owner" | "admin";

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole | null;
};

export type AuthStatus = {
  isConfigured: boolean;
  user: User | null;
};

export type CurrentUserProfile = {
  isConfigured: boolean;
  user: User | null;
  profile: Profile | null;
};

export function getDashboardPathForRole(role: UserRole | null | undefined) {
  if (role === "court_owner") {
    return "/owner/dashboard";
  }

  if (role === "admin") {
    return "/admin/dashboard";
  }

  return "/courts";
}

export const getRoleRedirect = getDashboardPathForRole;

export async function getAuthStatus(): Promise<AuthStatus> {
  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    return { isConfigured: false, user: null };
  }

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return { isConfigured: true, user: null };
  }

  return { isConfigured: true, user: data.user };
}

export async function fetchProfile(supabase: SupabaseClient, userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, phone, role")
    .eq("id", userId)
    .single();

  if (error) {
    return null;
  }

  return data as Profile;
}

export async function getCurrentUserProfile(): Promise<CurrentUserProfile> {
  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    return { isConfigured: false, user: null, profile: null };
  }

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return { isConfigured: true, user: null, profile: null };
  }

  const profile = await fetchProfile(supabase, data.user.id);

  return { isConfigured: true, user: data.user, profile };
}
