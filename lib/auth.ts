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

export function getRoleRedirect(role: UserRole | null | undefined) {
  if (role === "court_owner") {
    return "/owner/dashboard";
  }

  if (role === "admin") {
    return "/admin/dashboard";
  }

  return "/courts";
}

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
