import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return NextResponse.json({ error: "Entre na sua conta para preparar um devocional." }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const query = String(body.query ?? body.reference ?? "").trim();
  if (query.length < 2 || query.length > 160) return NextResponse.json({ error: "Digite uma passagem ou tema bíblico curto." }, { status: 400 });

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return NextResponse.json({ error: "Backend indisponível." }, { status: 500 });

  const upstream = await fetch(`${base}/functions/v1/coram-v1-devotional`, {
    method: "POST",
    headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
    cache: "no-store",
  });
  const payload = await upstream.json().catch(() => ({ error: "Resposta inválida do mecanismo devocional." }));
  return NextResponse.json(payload, { status: upstream.status });
}
