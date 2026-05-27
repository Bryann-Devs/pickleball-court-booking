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

function isUserRole(value: unknown): value is UserRole {
  return value === "player" || value === "court_owner" || value === "admin";
}

function getRoleFromUserMetadata(user: User | null | undefined): UserRole | null {
  const role = user?.user_metadata?.role;

  return isUserRole(role) ? role : null;
}

async function withTimeout<T>(promise: PromiseLike<T>, timeoutMs: number): Promise<T | null> {
  let timeoutId: ReturnType<typeof setTimeout>;

  const timeout = new Promise<null>((resolve) => {
    timeoutId = setTimeout(() => resolve(null), timeoutMs);
  });

  const result = await Promise.race([promise, timeout]);
  clearTimeout(timeoutId!);

  return result;
}

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

export function getFallbackRoleForUser(user: User | null | undefined): UserRole {
  return getRoleFromUserMetadata(user) ?? "player";
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
  const result = await withTimeout(
    supabase.from("profiles").select("id, full_name, phone, role").eq("id", userId).maybeSingle(),
    5000
  );

  if (!result) {
    return null;
  }

  const { data, error } = result;

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
