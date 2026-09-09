import { createClient } from "@/lib/supabase/server";

export const CORAM_ENTITLEMENT_KEY = "coram_deo";

export async function hasActiveCoramAccess() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, allowed: false };

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("user_entitlements")
    .select("enabled, entitlement_key, expires_at")
    .eq("user_id", user.id)
    .eq("enabled", true)
    .or(`entitlement_key.eq.${CORAM_ENTITLEMENT_KEY},entitlement_key.is.null`)
    .or(`expires_at.is.null,expires_at.gte.${now}`)
    .limit(1)
    .maybeSingle();

  if (error) return { user, allowed: false, error };
  return { user, allowed: Boolean(data) };
}

export async function requireCoramAccess() {
  const result = await hasActiveCoramAccess();
  if (!result.user) return { ...result, status: 401 as const };
  if (!result.allowed) return { ...result, status: 402 as const };
  return { ...result, status: 200 as const };
}
