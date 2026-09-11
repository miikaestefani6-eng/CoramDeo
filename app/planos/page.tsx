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
      const { data, error: queryError } = await supabase
        .from("reading_plans")
        .select("id,title,description,total_days,reading_progress(id,day_number,reference,completed_at)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
      if (queryError) throw queryError;
      setPlans((data ?? []) as unknown as ReadingPlan[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível carregar seus planos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function toggleDay(plan: ReadingPlan, dayId: string, completed: boolean) {
    const supabase = createClient();
    const { error: updateError } = await supabase.from("reading_progress").update({ completed_at: completed ? null : new Date().toISOString() }).eq("id", dayId);
    if (updateError) {
      setError("Não foi possível atualizar seu progresso.");
      return;
    }
    await load();
  }

  return (
    <ModuleShell title="Planos de leitura" description="Organize sua leitura da Palavra, acompanhe o progresso e avance no seu próprio ritmo.">
      {error && <div className="mb-5 rounded-xl border border-[#E7C7D2] bg-[#FFF8FA] p-4 text-sm text-[#8C183F]">{error}</div>}
      {loading ? <div className="rounded-xl border border-[#E1E7EA] bg-white p-8 text-sm text-[#5E6E82]">Carregando seus planos...</div> : (
        <div className="grid gap-5 lg:grid-cols-2">
          {plans.map((plan) => {
            const days = [...(plan.reading_progress || [])].sort((a, b) => a.day_number - b.day_number);
            const completed = days.filter((day) => day.completed_at).length;
            const percent = plan.total_days ? Math.round((completed / plan.total_days) * 100) : 0;
            return <article key={plan.id} className="rounded-2xl border border-[#E1E7EA] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-wider text-[#C4A47C]">Plano de leitura</span><span className="text-xs font-bold text-[#8C183F]">{percent}%</span></div>
              <h2 className="mt-4 font-serif text-xl font-bold text-[#0F2131]">{plan.title}</h2>
              {plan.description && <p className="mt-2 text-sm leading-6 text-[#5E6E82]">{plan.description}</p>}
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#E1E7EA]"><div className="h-full rounded-full bg-[#C4A47C]" style={{ width: `${percent}%` }} /></div>
              <p className="mt-2 text-xs text-[#5E6E82]">{completed} de {plan.total_days} concluídos</p>
              <div className="mt-5 max-h-72 space-y-2 overflow-auto pr-1">
                {days.map((day) => <button key={day.id} onClick={() => toggleDay(plan, day.id, Boolean(day.completed_at))} className="flex w-full items-center justify-between rounded-xl border border-[#E1E7EA] px-4 py-3 text-left text-sm hover:bg-[#F8F9FA]"><span><strong>Dia {day.day_number}</strong><span className="ml-2 text-[#5E6E82]">{day.reference}</span></span><span className={day.completed_at ? "text-[#1A707E]" : "text-[#C4A47C]"}>{day.completed_at ? "✓" : "○"}</span></button>)}
              </div>
            </article>;
          })}
        </div>
      )}
      {!loading && !plans.length && !error && <div className="rounded-xl border border-dashed border-[#D8D0C5] bg-white p-8 text-center text-sm text-[#5E6E82]">Nenhum plano de leitura está associado à sua conta ainda.</div>}
    </ModuleShell>
  );
}
