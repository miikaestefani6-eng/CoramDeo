import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits ? `+${digits}` : "";
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Entre na sua conta." }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const phone = normalizePhone(String(body.phone ?? ""));
  if (phone.length < 9 || phone.length > 16) {
    return NextResponse.json({ error: "Informe um número de WhatsApp válido com DDI." }, { status: 400 });
  }

  const { error } = await supabase.from("whatsapp_accounts").upsert({
    user_id: user.id,
    phone_e164: phone,
    status: "pending",
    verified_at: null,
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id" });

  if (error) return NextResponse.json({ error: "Não foi possível iniciar o vínculo." }, { status: 500 });
  return NextResponse.json({ ok: true, phone, status: "pending" });
}

export async function DELETE() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Entre na sua conta." }, { status: 401 });
  const { error } = await supabase.from("whatsapp_accounts").update({
    status: "unlinked",
    updated_at: new Date().toISOString(),
  }).eq("user_id", user.id);
  if (error) return NextResponse.json({ error: "Não foi possível desvincular." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
