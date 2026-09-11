"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

const groups = [
  ["Evidência e contexto", ["Visão geral", "Contexto do livro", "Contexto do capítulo", "Histórico-cultural", "Linha do tempo", "Línguas bíblicas", "Arqueologia", "Fontes e evidências"]],
  ["Interpretação", ["Teologia", "Conexões bíblicas", "Histórico-profético", "Literário", "Escatológico", "Camadas do texto"]],
  ["Tradição e vida", ["Tradição judaica", "Aplicação"]],
] as const;

const modes = ["equilibrado", "academico", "devocional", "ministerial"] as const;
const modeLabel: Record<string, string> = { equilibrado: "Equilibrado", academico: "Acadêmico", devocional: "Devocional", ministerial: "Ministerial" };
const modeHelp: Record<string, string> = {
  equilibrado: "Contexto, teologia e aplicação em equilíbrio.",
  academico: "Mais atenção à linguagem, evidências e debates.",
  devocional: "Aprofundamento com ênfase na vida cristã.",
  ministerial: "Estrutura útil para preparo e ensino responsável.",
};

function Brand() {
  return <div className="flex items-center gap-3 text-[#D5B579]"><svg aria-hidden="true" viewBox="0 0 64 72" className="h-10 w-9" fill="none"><path d="M10 61V24C10 12.4 19.4 3 31 3h2c11.6 0 21 9.4 21 21v37" stroke="currentColor" strokeWidth="2.4"/><path d="M16 60V25c0-8.8 7.2-16 16-16s16 7.2 16 16v35" stroke="currentColor" strokeWidth="1.5" opacity=".65"/><path d="M15 59c8-4.4 13.7-4.5 17-.2 3.3-4.3 9-4.2 17 .2v6c-8-4.3-13.7-4.4-17-.1-3.3-4.3-9-4.2-17 .1v-6Z" fill="currentColor"/><path d="M32 20l2.7 8.3L43 31l-8.3 2.7L32 42l-2.7-8.3L21 31l8.3-2.7L32 20Z" fill="currentColor"/></svg><span><span className="block font-serif text-lg font-semibold tracking-[.15em] text-[#F8F2E8]">CORAM DEO</span><span className="mt-1 block text-[8px] font-semibold uppercase tracking-[.27em] text-[#C9AA72]">Zion · pesquisa bíblica</span></span></div>;
}

export default function EstudarPage() {
  const [query, setQuery] = useState("Romanos 8:28");
  const [mode, setMode] = useState<(typeof modes)[number]>("equilibrado");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");
  const [study, setStudy] = useState<any>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);

  useEffect(() => { const params = new URLSearchParams(window.location.search); const incomingQuery = params.get("query")?.trim(); if (incomingQuery) setQuery(incomingQuery); }, []);
  useEffect(() => { if (!study || startedAt) return; setStartedAt(Date.now()); }, [study, startedAt]);

  async function search(event?: FormEvent) {
    event?.preventDefault(); if (query.trim().length < 2) return;
    setLoading(true); setError(""); setStudy(null); setCompleted(false); setStartedAt(null);
    try {
      const response = await fetch("/api/estudos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: query.trim(), mode }) });
      const data = await response.json(); if (!response.ok) throw new Error(data?.error || "Não foi possível preparar o estudo."); setStudy(data);
    } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível preparar o estudo."); } finally { setLoading(false); }
  }

  async function completeStudy() {
    if (!study || saving || completed) return; setSaving(true); setError("");
    const minutes = startedAt ? Math.max(1, Math.round((Date.now() - startedAt) / 60000)) : 1;
    try {
      const response = await fetch("/api/estudos/concluir", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ study, minutes }) });
      const data = await response.json(); if (!response.ok) throw new Error(data?.error || "Não foi possível concluir o estudo."); setCompleted(true);
    } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível concluir o estudo."); } finally { setSaving(false); }
  }

  const layers = Array.isArray(study?.layers) ? study.layers : [];
  const grouped = groups.map(([group, titles]) => ({ group, items: titles.map((title) => layers.find((item: any) => item.title === title)).filter(Boolean) }));

  return <main className="min-h-screen bg-[#EEE5D7] text-[#111820]">
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[#080D13]/95 px-5 py-4 text-white backdrop-blur-xl lg:px-10"><div className="mx-auto flex max-w-7xl items-center justify-between"><Link href="/"><Brand /></Link><div className="flex items-center gap-4"><span className="hidden text-[10px] font-bold uppercase tracking-[.22em] text-white/28 sm:inline">16 camadas · 4 modos</span><Link href="/" className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white/55 transition hover:border-[#D5B579]/35 hover:text-[#E7C98F]">← Início</Link></div></div></header>

    <section className="bg-[#080D13] px-5 pb-16 pt-12 text-white lg:px-10 lg:pb-20 lg:pt-16"><div className="mx-auto max-w-7xl"><div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-end"><div><p className="text-[11px] font-bold uppercase tracking-[.28em] text-[#D5B579]">Conheça o texto por inteiro</p><h1 className="mt-4 font-serif text-5xl font-semibold leading-[.98] tracking-[-.035em] sm:text-6xl">Zion.<br/><span className="text-[#D5B579]">Profundidade com responsabilidade.</span></h1><p className="mt-6 max-w-xl text-sm leading-7 text-white/48">Uma pergunta se transforma em uma investigação organizada. Contexto, línguas bíblicas, teologia, tradição, arqueologia, aplicação e evidências — sem misturar hipótese com certeza.</p></div>
      <div className="rounded-[30px] border border-[#C9AA72]/20 bg-[#0D141C] p-5 shadow-[0_30px_90px_rgba(0,0,0,.3)] sm:p-7"><form onSubmit={search}><label className="text-[10px] font-bold uppercase tracking-[.22em] text-[#C9AA72]">O que você deseja investigar?</label><div className="mt-3 flex flex-col gap-2 rounded-[20px] border border-white/10 bg-white/[.04] p-2 sm:flex-row"><input value={query} onChange={(e)=>setQuery(e.target.value)} className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/25" placeholder="Ex.: Romanos 8:28, aliança, Pedro..." aria-label="Pesquisar passagem ou tema"/><button type="submit" disabled={loading} className="rounded-full bg-[#D5B579] px-6 py-3 text-sm font-bold text-[#111820] transition hover:bg-[#E7C98F] disabled:cursor-wait disabled:opacity-55">{loading ? "Zion está pesquisando…" : "Pesquisar com Zion →"}</button></div></form><div className="mt-5 grid gap-2 sm:grid-cols-4">{modes.map(item=><button type="button" key={item} onClick={()=>setMode(item)} title={modeHelp[item]} className={`rounded-2xl border px-3 py-3 text-left transition ${mode===item?'border-[#D5B579]/55 bg-[#D5B579]/10':'border-white/8 bg-white/[.02] hover:border-white/16'}`}><span className={`block text-[11px] font-bold ${mode===item?'text-[#E7C98F]':'text-white/58'}`}>{modeLabel[item]}</span><span className="mt-1 hidden text-[9px] leading-4 text-white/30 xl:block">{modeHelp[item]}</span></button>)}</div></div>
    </div></div></section>

    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-10 lg:py-14">
      {error && <div className="mb-7 rounded-2xl border border-[#9B684E]/25 bg-[#F4E7DB] p-4 text-sm text-[#71452E]">{error}</div>}

      {study ? <section><div className="flex flex-wrap items-end justify-between gap-5 border-b border-[#CFC1AD] pb-7"><div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#8B6A34]">Pesquisa estruturada por Zion</p><h2 className="mt-2 font-serif text-4xl font-semibold tracking-[-.02em]">{study.title}</h2><p className="mt-2 text-sm text-[#71685D]">{study.reference} · modo {modeLabel[study.mode ?? mode]} · {layers.length} camadas</p></div><span className="rounded-full border border-[#C8B89F] bg-[#F7F1E7] px-4 py-2 text-[10px] font-bold uppercase tracking-[.14em] text-[#7A623B]">{study.cached ? "Do acervo" : "Nova pesquisa"}</span></div>

        <div className="mt-9 space-y-12">{grouped.map(({group,items},groupIndex)=><section key={group}><div className="mb-5 flex items-center gap-4"><span className="text-[10px] font-bold tracking-[.2em] text-[#8B6A34]">0{groupIndex+1}</span><h3 className="font-serif text-2xl font-semibold">{group}</h3><span className="h-px flex-1 bg-[#CFC1AD]"/></div><div className="grid gap-4 lg:grid-cols-2">{items.map((layer:any,index:number)=><article key={layer.key ?? layer.title} className="group rounded-[26px] border border-[#D5C8B5] bg-[#F7F1E7] p-6 transition hover:border-[#B99A64] hover:shadow-[0_18px_55px_rgba(64,48,27,.07)]"><div className="flex items-start gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#111820] text-[11px] font-bold text-[#D5B579]">{String(layer.key ?? index+1).replace("l","")}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h4 className="font-serif text-xl font-semibold">{layer.title}</h4>{layer.confidence&&<span className="rounded-full border border-[#D8CBB9] px-2 py-1 text-[8px] font-bold uppercase tracking-[.12em] text-[#81776B]">Confiança {layer.confidence}</span>}</div><p className="mt-3 text-sm leading-7 text-[#625B52]">{layer.text}</p>{layer.evidence_note&&<div className="mt-5 border-l border-[#B99A64] pl-4"><p className="text-[9px] font-bold uppercase tracking-[.16em] text-[#8B6A34]">Nota de evidência</p><p className="mt-1 text-xs leading-5 text-[#776E63]">{layer.evidence_note}</p></div>}</div></div></article>)}</div></section>)}</div>

        {layers.length < 16 && <div className="mt-8 rounded-2xl border border-[#B99A64]/30 bg-[#F7F1E7] p-4 text-xs leading-6 text-[#6E6254]">Esta resposta retornou {layers.length} das 16 camadas esperadas. O conteúdo disponível foi preservado; uma nova pesquisa pode completar a estrutura.</div>}

        <div className="mt-12 rounded-[28px] bg-[#111820] p-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8"><div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#D5B579]">Sua caminhada</p><p className="mt-2 font-serif text-2xl font-semibold">Terminou este estudo?</p><p className="mt-2 text-xs leading-6 text-white/42">Registre a conclusão para manter sua jornada organizada e poder retomar seus estudos com contexto.</p></div><button type="button" onClick={completeStudy} disabled={saving||completed} className="mt-5 w-full rounded-full bg-[#D5B579] px-6 py-3.5 text-sm font-bold text-[#111820] transition hover:bg-[#E7C98F] disabled:cursor-default disabled:opacity-65 sm:mt-0 sm:w-auto">{completed?"✓ Estudo concluído":saving?"Registrando…":"Concluir estudo"}</button></div>
      </section> : <section><div className="mx-auto max-w-3xl text-center"><p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#8B6A34]">Como Zion organiza a pesquisa</p><h2 className="mt-3 font-serif text-4xl font-semibold">Três movimentos. Dezesseis camadas.</h2><p className="mt-4 text-sm leading-7 text-[#6A6259]">Primeiro o que podemos observar. Depois como o texto é interpretado. Por fim, tradição e aplicação — mantendo as distinções visíveis.</p></div><div className="mt-8 grid gap-4 md:grid-cols-3"><article className="rounded-[26px] border border-[#D5C8B5] bg-[#F7F1E7] p-7"><span className="text-[10px] font-bold tracking-[.2em] text-[#8B6A34]">01 · 08 camadas</span><h3 className="mt-4 font-serif text-2xl font-semibold">Evidência e contexto</h3><p className="mt-3 text-sm leading-7 text-[#665E54]">Livro, capítulo, história, cultura, cronologia, línguas, arqueologia e fontes.</p></article><article className="rounded-[26px] border border-[#D5C8B5] bg-[#111820] p-7 text-white"><span className="text-[10px] font-bold tracking-[.2em] text-[#D5B579]">02 · 06 camadas</span><h3 className="mt-4 font-serif text-2xl font-semibold">Interpretação</h3><p className="mt-3 text-sm leading-7 text-white/48">Teologia, conexões bíblicas, leitura histórica-profética, literatura, escatologia e camadas do texto.</p></article><article className="rounded-[26px] border border-[#D5C8B5] bg-[#F7F1E7] p-7"><span className="text-[10px] font-bold tracking-[.2em] text-[#8B6A34]">03 · 02 camadas</span><h3 className="mt-4 font-serif text-2xl font-semibold">Tradição e vida</h3><p className="mt-3 text-sm leading-7 text-[#665E54]">Tradição judaica claramente identificada e aplicação conectada ao contexto.</p></article></div></section>}
    </div>
  </main>;
}
