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

  // Idempotent: existing users/claims are left untouched; new confirmed users receive one 7-day trial.
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.rpc("bootstrap_coram_trial", { p_user_id: user.id });
  }

  return NextResponse.redirect(new URL(safeNext, url.origin));
}
