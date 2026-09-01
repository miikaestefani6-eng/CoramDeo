import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Entre na sua conta para concluir o estudo." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const study = body?.study ?? {};
  const reference = String(study.reference ?? body.reference ?? "").trim();
  const title = String(study.title ?? "Estudo bíblico").trim().slice(0, 200);
  const mode = ["equilibrado", "academico", "devocional", "ministerial"].includes(String(study.mode))
    ? String(study.mode)
    : "equilibrado";
  const minutes = Math.max(1, Math.min(600, Number(body.minutes ?? 1) || 1));

  if (reference.length < 2 || reference.length > 160) {
    return NextResponse.json({ error: "Não foi possível identificar este estudo." }, { status: 400 });
  }

  const { data: savedStudy, error: studyError } = await supabase
    .from("studies")
    .insert({
      user_id: user.id,
      reference,
      title,
      mode,
      content: study,
      evidence_index: Array.isArray(study.layers) ? study.layers : [],
      editorial_status: "draft",
    })
    .select("id, reference, title, created_at")
    .single();

  if (studyError) {
    return NextResponse.json({ error: "Não foi possível registrar o estudo." }, { status: 500 });
  }

  const { error: activityError } = await supabase.from("study_activity").insert({
    user_id: user.id,
    activity_type: "reading_completed",
    study_id: savedStudy.id,
    reference,
    minutes,
    activity_date: new Date().toISOString().slice(0, 10),
  });

  if (activityError) {
    return NextResponse.json({ error: "O estudo foi salvo, mas não conseguimos atualizar seu progresso." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, study: savedStudy });
}
