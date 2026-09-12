'use client';

import { useEffect, useMemo, useState } from "react";
import { ModuleShell } from "../components/ModuleShell";
import { createClient } from "../../lib/supabase/client";

type ReadingPlan = {
  id: string;
  catalog_id?: string | null;
  title: string;
  description: string | null;
  total_days: number;
  reading_progress: { id: string; day_number: number; reference: string; completed_at: string | null }[];
};

type CatalogPlan = {
  id: string;
  title: string;
  description: string | null;
  sort_order: number;
  reading_plan_days: { id: string; day_number: number; reference: string }[];
};

export default function PlanosPage() {
  const [plans, setPlans] = useState<ReadingPlan[]>([]);
  const [catalog, setCatalog] = useState<CatalogPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Entre na sua conta para acompanhar seus planos.");
      const [plansResult, catalogResult] = await Promise.all([
        supabase.from("reading_plans").select("id,catalog_id,title,description,total_days,reading_progress(id,day_number,reference,completed_at)").eq("user_id", user.id).order("created_at", { ascending: true }),
        supabase.from("reading_plan_catalog").select("id,title,description,sort_order,reading_plan_days(id,day_number,reference)").eq("status", "published").order("sort_order").order("created_at"),
      ]);
      if (plansResult.error) throw plansResult.error;
      if (catalogResult.error) throw catalogResult.error;
      setPlans((plansResult.data ?? []) as unknown as ReadingPlan[]);
      setCatalog((catalogResult.data ?? []) as unknown as CatalogPlan[]);
    } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível carregar seus planos."); }
    finally { setLoading(false); }
  }

  useEffect(() => { void load(); }, []);

  const available = useMemo(() => {
    const started = new Set(plans.map((plan) => plan.catalog_id).filter(Boolean));
    return catalog.filter((plan) => !started.has(plan.id));
  }, [plans, catalog]);

  async function startPlan(catalogId: string) {
    setStarting(catalogId); setError("");
    try {
      const supabase = createClient();
      const { error: rpcError } = await supabase.rpc("start_reading_plan_catalog", { p_catalog_id: catalogId });
      if (rpcError) throw rpcError;
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível iniciar este plano."); }
    finally { setStarting(null); }
  }

  async function toggleDay(dayId: string, completed: boolean) {
    const supabase = createClient();
    const { error: updateError } = await supabase.from("reading_progress").update({ completed_at: completed ? null : new Date().toISOString() }).eq("id", dayId);
    if (updateError) { setError("Não foi possível atualizar seu progresso."); return; }
    await load();
  }

  return (
    <ModuleShell title="Planos de leitura" description="Constância para permanecer na Palavra, um dia de cada vez.">
      <section className="rounded-[28px] border border-[#D5C8B5] bg-[#F7F1E7] p-7 md:p-8"><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#8B6A34]">Ritmo e constância</p><h2 className="mt-3 font-serif text-3xl font-semibold">Menos pressa. Mais permanência.</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[#665E54]">Acompanhe cada leitura concluída e escolha novos planos publicados pelo Coram Deo para avançar no seu próprio ritmo.</p></section>

      {error && <div className="mt-5 rounded-[22px] border border-[#A95E5E]/20 bg-[#F8ECE8] p-4 text-sm text-[#7C403E]">{error}</div>}
      {loading ? <div className="mt-5 rounded-[26px] border border-[#D5C8B5] bg-[#F7F1E7] p-8 text-sm text-[#665E54]">Carregando seus planos...</div> : <>
        {plans.length > 0 && <section className="mt-6"><div className="mb-4"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#8B6A34]">Em andamento</p><h2 className="mt-1 font-serif text-2xl font-semibold text-[#111820]">Seus planos</h2></div><div className="grid gap-5 lg:grid-cols-2">{plans.map((plan) => {
          const days = [...(plan.reading_progress || [])].sort((a,b)=>a.day_number-b.day_number);
          const completed = days.filter(day=>day.completed_at).length;
          const percent = plan.total_days ? Math.round((completed/plan.total_days)*100) : 0;
          return <article key={plan.id} className="overflow-hidden rounded-[28px] border border-[#D5C8B5] bg-[#F7F1E7]"><div className="bg-[#0B1119] p-6 text-white"><div className="flex items-center justify-between gap-4"><span className="text-[10px] font-bold uppercase tracking-[.2em] text-[#D5B579]">Plano de leitura</span><span className="font-serif text-2xl text-[#E7C98F]">{percent}%</span></div><h2 className="mt-4 font-serif text-2xl font-semibold">{plan.title}</h2>{plan.description&&<p className="mt-3 text-sm leading-6 text-white/48">{plan.description}</p>}<div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#D5B579]" style={{width:`${percent}%`}}/></div><p className="mt-2 text-[11px] text-white/38">{completed} de {plan.total_days} concluídos</p></div><div className="max-h-80 space-y-2 overflow-auto p-5">{days.map(day=><button key={day.id} onClick={()=>toggleDay(day.id,Boolean(day.completed_at))} className={`flex w-full items-center justify-between rounded-[18px] border px-4 py-3 text-left text-sm transition ${day.completed_at?"border-[#B99A64] bg-[#EEE5D7]":"border-[#DDD0BE] bg-[#FBF6EE] hover:border-[#B99A64]"}`}><span><strong className="text-[#111820]">Dia {day.day_number}</strong><span className="ml-2 text-[#6F665D]">{day.reference}</span></span><span className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs ${day.completed_at?"border-[#8B6A34] bg-[#D5B579] text-[#111820]":"border-[#CBBCA8] text-[#8B6A34]"}`}>{day.completed_at?"✓":"○"}</span></button>)}</div></article>;
        })}</div></section>}

        {available.length > 0 && <section className="mt-8"><div className="mb-4"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#8B6A34]">Catálogo</p><h2 className="mt-1 font-serif text-2xl font-semibold text-[#111820]">Novos planos disponíveis</h2></div><div className="grid gap-4 lg:grid-cols-2">{available.map(plan=><article key={plan.id} className="rounded-[26px] border border-[#D5C8B5] bg-[#F7F1E7] p-6"><div className="flex items-center justify-between gap-3"><span className="text-[10px] font-bold uppercase tracking-[.18em] text-[#8B6A34]">{(plan.reading_plan_days||[]).length} dias</span><span className="text-xl text-[#B99A64]">✦</span></div><h3 className="mt-3 font-serif text-2xl font-semibold text-[#111820]">{plan.title}</h3>{plan.description&&<p className="mt-3 text-sm leading-6 text-[#665E54]">{plan.description}</p>}<button onClick={()=>startPlan(plan.id)} disabled={starting===plan.id} className="mt-5 rounded-full bg-[#111820] px-5 py-3 text-xs font-bold text-[#F8F2E8] disabled:opacity-60">{starting===plan.id?"Iniciando...":"Começar plano →"}</button></article>)}</div></section>}
      </>}

      {!loading && !plans.length && !available.length && !error && <div className="mt-5 rounded-[28px] border border-dashed border-[#CBBCA8] bg-[#F7F1E7] p-10 text-center"><p className="font-serif text-xl text-[#111820]">Nenhum plano disponível no momento.</p><p className="mt-2 text-sm text-[#70675D]">Quando um novo plano for publicado pelo Coram Deo, ele aparecerá aqui.</p></div>}
    </ModuleShell>
  );
}
