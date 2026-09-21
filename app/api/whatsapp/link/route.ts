import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits ? `+${digits}` : "";
}
async function hashCode(code: string) {
  const bytes = new TextEncoder().encode(code);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Entre na sua conta." }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const phone = normalizePhone(String(body.phone ?? ""));
  if (phone.length < 9 || phone.length > 16) return NextResponse.json({ error: "Informe um número de WhatsApp válido com DDI." }, { status: 400 });
  const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1000000).padStart(6, "0");
  const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  const { error } = await supabase.from("whatsapp_accounts").upsert({
    user_id: user.id, phone_e164: phone, status: "pending", verified_at: null,
    verification_code_hash: await hashCode(code), verification_expires_at: expires,
    verification_attempts: 0, updated_at: new Date().toISOString(),
  }, { onConflict: "user_id" });
  if (error) return NextResponse.json({ error: "Não foi possível iniciar o vínculo." }, { status: 500 });
  return NextResponse.json({ ok: true, phone, status: "pending", verification_code: code, expires_at: expires,
    instruction: "Envie este código de 6 dígitos para o WhatsApp oficial do Coram Deo para confirmar o vínculo." });
}
export async function DELETE() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Entre na sua conta." }, { status: 401 });
  const { error } = await supabase.from("whatsapp_accounts").update({
    status: "unlinked", verification_code_hash: null, verification_expires_at: null, updated_at: new Date().toISOString(),
  }).eq("user_id", user.id);
  if (error) return NextResponse.json({ error: "Não foi possível desvincular." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
