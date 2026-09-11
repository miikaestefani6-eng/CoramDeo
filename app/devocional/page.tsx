"use client";

import { FormEvent, useEffect, useState } from "react";
import { ModuleShell } from "../components/ModuleShell";

export default function DevocionalPage() {
  const [query, setQuery] = useState("João 1:1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [devotional, setDevotional] = useState<any>(null);

  useEffect(() => { const params = new URLSearchParams(window.location.search); const incomingQuery = params.get("query")?.trim(); if (incomingQuery) setQuery(incomingQuery); }, []);

  async function prepare(event?: FormEvent) {
    event?.preventDefault(); if (query.trim().length < 2) return; setLoading(true); setError(""); setDevotional(null);
    try {
      const response = await fetch("/api/devocional", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: query.trim() }) });
      const data = await response.json(); if (!response.ok) throw new Error(data?.error || "Não foi possível preparar o devocional."); setDevotional(data);
    } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível preparar o devocional."); } finally { setLoading(false); }
  }

  return <ModuleShell title="Devocional" description="Um espaço para parar, compreender a Palavra e responder a Deus com reverência e prática.">
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="relative overflow-hidden rounded-[30px] bg-[#111820] p-6 text-white shadow-[0_24px_70px_rgba(33,27,20,.16)] md:p-9"><div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(213,181,121,.13),transparent_34%)]"/><div className="relative"><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#D5B579]">Seu momento com a Palavra</p><h2 className="mt-3 font-serif text-3xl font-semibold leading-tight md:text-4xl">Pare. Leia. Compreenda. Responda.</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-white/48">Escolha uma passagem ou tema. O Coram Deo prepara uma reflexão ancorada no texto, sem transformar a Bíblia em pretexto para uma mensagem genérica.</p><form onSubmit={prepare} className="mt-7 flex flex-col gap-2 rounded-[20px] border border-white/10 bg-white/[.045] p-2 sm:flex-row"><input value={query} onChange={(e)=>setQuery(e.target.value)} aria-label="Tema ou referência bíblica" className="min-h-12 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/25" placeholder="Ex.: João 1:1 ou fé"/><button disabled={loading} className="rounded-full bg-[#D5B579] px-6 py-3 text-sm font-bold text-[#111820] disabled:opacity-60">{loading?"Preparando…":"Preparar devocional →"}</button></form></div></section>

      {error&&<div className="rounded-2xl border border-[#9B684E]/25 bg-[#F4E7DB] p-4 text-sm text-[#71452E]">{error}</div>}

      {devotional ? <section className="rounded-[30px] border border-[#D5C8B5] bg-[#F7F1E7] p-6 shadow-[0_16px_50px_rgba(64,48,27,.06)] md:p-9"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#8B6A34]">Devocional preparado</p><p className="mt-1 text-xs text-[#776E63]">{devotional.anchor_reference ?? devotional.reference_or_theme ?? query}</p></div><span className="rounded-full border border-[#D8CBB9] px-3 py-1.5 text-[10px] font-bold text-[#71675B]">{devotional.cached?"Do acervo":"Novo"}</span></div><h2 className="mt-6 font-serif text-3xl font-semibold">{devotional.title}</h2>
        {devotional.understand&&<article className="mt-7 rounded-[22px] border border-[#D8CBB9] bg-[#EFE5D6] p-6"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#8B6A34]">Entenda</p><p className="mt-3 text-sm leading-7 text-[#5F574D]">{devotional.understand}</p></article>}
        {devotional.meditate&&<article className="mt-4 rounded-[22px] border border-[#D8CBB9] p-6"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#8B6A34]">Medite</p><p className="mt-3 font-serif text-lg leading-7 text-[#504940]">{devotional.meditate}</p></article>}
        {Array.isArray(devotional.look_within)&&<article className="mt-4 rounded-[22px] border border-[#D8CBB9] p-6"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#8B6A34]">Olhe para dentro</p><ol className="mt-3 space-y-3 text-sm leading-6 text-[#5F574D]">{devotional.look_within.map((item:string,i:number)=><li key={i} className="flex gap-3"><span className="font-bold text-[#8B6A34]">0{i+1}</span><span>{item}</span></li>)}</ol></article>}
        {devotional.pray&&<article className="mt-4 rounded-[22px] bg-[#111820] p-6 text-white"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#D5B579]">Ore</p><p className="mt-3 text-sm leading-7 text-white/62">{devotional.pray}</p></article>}
        {devotional.practice_today&&<article className="mt-4 rounded-[22px] border-l-2 border-[#B99A64] bg-[#EFE5D6] p-6"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#8B6A34]">Pratique hoje</p><p className="mt-3 text-sm leading-6 text-[#5F574D]">{devotional.practice_today}</p></article>}
        {devotional.memory_line&&<blockquote className="mt-7 border-t border-[#D5C8B5] pt-6 font-serif text-xl italic leading-8">“{devotional.memory_line}”</blockquote>}
        {devotional.evidence_note&&<p className="mt-6 text-xs leading-5 text-[#776E63]">Nota de evidência: {devotional.evidence_note}</p>}
      </section> : <section className="grid gap-4 md:grid-cols-3">{[["01","Entenda","Comece pelo que o texto realmente diz."],["02","Medite","Deixe a verdade confrontar e iluminar o coração."],["03","Pratique","Transforme compreensão em uma resposta concreta."]].map(([n,t,d],i)=><article key={t} className={`rounded-[24px] border p-6 ${i===1?'border-[#111820] bg-[#111820] text-white':'border-[#D5C8B5] bg-[#F7F1E7]'}`}><span className={`text-[10px] font-bold tracking-[.2em] ${i===1?'text-[#D5B579]':'text-[#8B6A34]'}`}>{n}</span><h3 className="mt-4 font-serif text-xl font-semibold">{t}</h3><p className={`mt-2 text-sm leading-6 ${i===1?'text-white/45':'text-[#665E54]'}`}>{d}</p></article>)}</section>}
    </div>
  </ModuleShell>;
}
