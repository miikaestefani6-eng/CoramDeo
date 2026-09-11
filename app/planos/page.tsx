'use client';

import { useEffect, useState } from "react";
import { ModuleShell } from "../components/ModuleShell";
import { createClient } from "../../lib/supabase/client";

type ReadingPlan = {
  id: string;
  title: string;
  description: string | null;
  total_days: number;
  reading_progress: { id: string; day_number: number; reference: string; completed_at: string | null }[];
};

export default function PlanosPage() {
  const [plans, setPlans] = useState<ReadingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Entre na sua conta para acompanhar seus planos.");
      const { data, error: queryError } = await supabase.from("reading_plans").select("id,title,description,total_days,reading_progress(id,day_number,reference,completed_at)").eq("user_id", user.id).order("created_at", { ascending: true });
      if (queryError) throw queryError;
      setPlans((data ?? []) as unknown as ReadingPlan[]);
    } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível carregar seus planos."); }
    finally { setLoading(false); }
  }

  useEffect(() => { void load(); }, []);

  async function toggleDay(plan: ReadingPlan, dayId: string, completed: boolean) {
    const supabase = createClient();
    const { error: updateError } = await supabase.from("reading_progress").update({ completed_at: completed ? null : new Date().toISOString() }).eq("id", dayId);
    if (updateError) { setError("Não foi possível atualizar seu progresso."); return; }
    await load();
  }

  return (
    <ModuleShell title="Planos de leitura" description="Constância para permanecer na Palavra, um dia de cada vez.">
      <section className="rounded-[28px] border border-[#D5C8B5] bg-[#F7F1E7] p-7 md:p-8"><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#8B6A34]">Ritmo e constância</p><h2 className="mt-3 font-serif text-3xl font-semibold">Menos pressa. Mais permanência.</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[#665E54]">Acompanhe cada leitura concluída e avance no seu próprio ritmo sem perder o fio da jornada.</p></section>

      {error && <div className="mt-5 rounded-[22px] border border-[#A95E5E]/20 bg-[#F8ECE8] p-4 text-sm text-[#7C403E]">{error}</div>}
      {loading ? <div className="mt-5 rounded-[26px] border border-[#D5C8B5] bg-[#F7F1E7] p-8 text-sm text-[#665E54]">Carregando seus planos...</div> : (
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {plans.map((plan) => {
            const days = [...(plan.reading_progress || [])].sort((a, b) => a.day_number - b.day_number);
            const completed = days.filter((day) => day.completed_at).length;
            const percent = plan.total_days ? Math.round((completed / plan.total_days) * 100) : 0;
            return <article key={plan.id} className="overflow-hidden rounded-[28px] border border-[#D5C8B5] bg-[#F7F1E7]"><div className="bg-[#0B1119] p-6 text-white"><div className="flex items-center justify-between gap-4"><span className="text-[10px] font-bold uppercase tracking-[.2em] text-[#D5B579]">Plano de leitura</span><span className="font-serif text-2xl text-[#E7C98F]">{percent}%</span></div><h2 className="mt-4 font-serif text-2xl font-semibold">{plan.title}</h2>{plan.description && <p className="mt-3 text-sm leading-6 text-white/48">{plan.description}</p>}<div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#D5B579]" style={{ width: `${percent}%` }} /></div><p className="mt-2 text-[11px] text-white/38">{completed} de {plan.total_days} concluídos</p></div><div className="max-h-80 space-y-2 overflow-auto p-5">{days.map((day) => <button key={day.id} onClick={() => toggleDay(plan, day.id, Boolean(day.completed_at))} className={`flex w-full items-center justify-between rounded-[18px] border px-4 py-3 text-left text-sm transition ${day.completed_at ? "border-[#B99A64] bg-[#EEE5D7]" : "border-[#DDD0BE] bg-[#FBF6EE] hover:border-[#B99A64]"}`}><span><strong className="text-[#111820]">Dia {day.day_number}</strong><span className="ml-2 text-[#6F665D]">{day.reference}</span></span><span className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs ${day.completed_at ? "border-[#8B6A34] bg-[#D5B579] text-[#111820]" : "border-[#CBBCA8] text-[#8B6A34]"}`}>{day.completed_at ? "✓" : "○"}</span></button>)}</div></article>;
          })}
        </div>
      )}
      {!loading && !plans.length && !error && <div className="mt-5 rounded-[28px] border border-dashed border-[#CBBCA8] bg-[#F7F1E7] p-10 text-center"><p className="font-serif text-xl text-[#111820]">Nenhum plano associado à sua conta.</p><p className="mt-2 text-sm text-[#70675D]">Quando um plano de leitura estiver disponível para você, ele aparecerá aqui.</p></div>}
    </ModuleShell>
  );
}
