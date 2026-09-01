import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const FUNCTION_NAME = "coram-v1-research";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return NextResponse.json({ error: "Entre na sua conta para iniciar um estudo." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const query = String(body.query ?? body.reference ?? "").trim();
  const mode = ["equilibrado", "academico", "devocional", "ministerial"].includes(String(body.mode)) ? String(body.mode) : "equilibrado";
  const familiarity = ["zero", "aprendendo", "frequente", "aprofundamento"].includes(String(body.familiarity)) ? String(body.familiarity) : undefined;

  if (query.length < 2 || query.length > 160) {
    return NextResponse.json({ error: "Digite uma passagem, personagem ou tema curto." }, { status: 400 });
  }

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return NextResponse.json({ error: "Backend indisponível." }, { status: 500 });

  const upstream = await fetch(`${base}/functions/v1/${FUNCTION_NAME}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, mode, ...(familiarity ? { familiarity } : {}) }),
    cache: "no-store",
  });

  const payload = await upstream.json().catch(() => ({ error: "Resposta inválida do mecanismo de estudo." }));
  return NextResponse.json(payload, { status: upstream.status });
}
