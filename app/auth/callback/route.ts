import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next");
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/";

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=auth_callback", url.origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL("/login?error=auth_callback", url.origin));
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const deviceId = typeof user.user_metadata?.trial_device_id === "string" ? user.user_metadata.trial_device_id : null;
    const { data: trial } = await supabase.rpc("bootstrap_coram_trial", {
      p_user_id: user.id,
      p_device_id: deviceId,
    });

    if (trial && trial.started === false && ["identity_already_claimed", "device_already_claimed", "trial_reuse_detected"].includes(trial.reason)) {
      return NextResponse.redirect(new URL("/assinatura?reason=trial_used", url.origin));
    }
  }

  return NextResponse.redirect(new URL(safeNext, url.origin));
}
