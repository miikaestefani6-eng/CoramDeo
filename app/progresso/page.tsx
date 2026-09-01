'use client';

import { useEffect, useState } from "react";
import { ModuleShell } from "../components/ModuleShell";
import { createClient } from "../../lib/supabase/client";

export default function ProgressoPage() {
  const [stats, setStats] = useState({ studies: 0, days: 0, minutes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data, error } = await supabase
        .from("study_activity")
        .select("activity_date, minutes, activity_type")
        .eq("user_id", user.id)
        .eq("activity_type", "reading_completed");
      if (error) { setLoading(false); return; }
      const rows = data ?? [];
      const days = new Set(rows.map((r) => r.activity_date)).size;
      const minutes = rows.reduce((sum, r) => sum + Number(r.minutes ?? 0), 0);
      setStats({ studies: rows.length, days, minutes });
      setLoading(false);
    }
    load();
  }, []);

  const metrics = [["Atividades concluídas", String(stats.studies)], ["Dias de constância", String(stats.days)], ["Tempo de estudo", `${Math.floor(stats.minutes / 60)}h ${stats.minutes % 60}min`]];

  return <ModuleShell title="Meu progresso" description="Acompanhe sua constância, seus estudos e os caminhos que você está construindo na Palavra.">
    <div className="grid gap-4 md:grid-cols-3">{metrics.map(([label, value]) => <div key={label} className="rounded-2xl border border-[#E1E7EA] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)]"><p className="text-sm text-[#5E6E82]">{label}</p><p className="mt-3 font-serif text-3xl font-bold text-[#0F2131]">{loading ? "—" : value}</p></div>)}</div>
    <section className="mt-6 rounded-2xl bg-[#0F2131] p-7 text-white"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C4A47C]">Sua caminhada</p><h2 className="mt-2 font-serif text-2xl font-bold">Constância antes de velocidade</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">Cada estudo registrado faz parte da sua formação. Continue de onde parou e avance com propósito.</p></section>
  </ModuleShell>;
}
