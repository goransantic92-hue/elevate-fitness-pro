import type { User } from "@supabase/supabase-js";

/**
 * Public Training / Nutrition URLs: members with access see the page; others go to Pricing.
 * When Supabase is not configured, always use the real path (local dev).
 */
export function programPublicPath(
  path: "/training" | "/nutrition",
  options: {
    configured: boolean;
    hasProgramAccess: boolean;
    loading: boolean;
    user: User | null;
  }
): "/training" | "/nutrition" | "/pricing" {
  const { configured, hasProgramAccess, loading, user } = options;
  if (!configured) return path;
  if (hasProgramAccess) return path;
  if (loading && user) return path;
  return "/pricing";
}
