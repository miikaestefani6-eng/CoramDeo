"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ModuleShell } from "../components/ModuleShell";

export default function DevocionalPage() {
  const [query, setQuery] = useState("João 1:1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [devotional, setDevotional] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const incomingQuery = params.get("query")?.trim();
    if (incomingQuery) setQuery(incomingQuery);
  }, []);

  async function prepare(event?: FormEvent) {
    event?.preventDefault();
    if (query.trim().length < 2) return;
    setLoading(true); setError(""); setDevotional(null);
    try {
      const response = await fetch("/api/devocional", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: query.trim() }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Não foi possível preparar o devocional.");
      setDevotional(data);
    } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível preparar o devocional."); }
    finally { setLoading(false); }
  }

  return (
    <ModuleShell title="Devocional" description="Um espaço para parar, compreender a Palavra e responder a Deus com reverência e prática.">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-[26px] bg-[#0F2131] p-6 text-white shadow-[0_18px_50px_rgba(15,33,49,0.12)] md:p-9">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C4A47C]">Seu momento com a Palavra</p>
          <h2 className="mt-3 font-serif text-3xl font-bold leading-tight md:text-4xl">O que Deus está mostrando no texto?</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">Escolha uma passagem ou tema. O Coram Deo prepara uma reflexão ancorada no texto, sem transformar a Bíblia em pretexto para uma mensagem genérica.</p>
          <form onSubmit={prepare} className="mt-7 flex flex-col gap-2 rounded-2xl bg-white p-2 sm:flex-row">
            <input value={query} onChange={e => setQuery(e.target.value)} aria-label="Tema ou referência bíblica" className="min-h-12 flex-1 rounded-xl px-4 text-sm text-[#0F2131] outline-none" placeholder="Ex.: João 1:1 ou fé" />
            <button disabled={loading} className="rounded-xl bg-[#8C183F] px-6 py-3 text-sm font-bold text-white disabled:opacity-60">{loading ? "Preparando…" : "Preparar devocional"}</button>
          </form>
        </section>

        {error && <div className="rounded-2xl border border-[#8C183F]/15 bg-[#8C183F]/5 p-4 text-sm text-[#8C183F]">{error}</div>}

        {devotional ? <section className="rounded-[26px] border border-[#E1E3E2] bg-white p-6 shadow-sm md:p-9">
          <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8C183F]">Devocional preparado</p><p className="mt-1 text-xs text-[#7A8794]">{devotional.anchor_reference ?? devotional.reference_or_theme ?? query}</p></div><span className="rounded-full bg-[#F6F5F2] px-3 py-1.5 text-[10px] font-bold text-[#5E6E82]">{devotional.cached ? "Do acervo" : "Novo"}</span></div>
          <h2 className="mt-6 font-serif text-3xl font-bold">{devotional.title}</h2>
          {devotional.understand && <article className="mt-7 rounded-2xl bg-[#F6F5F2] p-6"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C4A47C]">Entenda</p><p className="mt-3 text-sm leading-7 text-[#425365]">{devotional.understand}</p></article>}
          {devotional.meditate && <article className="mt-4 rounded-2xl border border-[#E1E3E2] p-6"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8C183F]">Medite</p><p className="mt-3 font-serif text-lg leading-7 text-[#425365]">{devotional.meditate}</p></article>}
          {Array.isArray(devotional.look_within) && <article className="mt-4 rounded-2xl border border-[#E1E3E2] p-6"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C4A47C]">Olhe para dentro</p><ol className="mt-3 space-y-3 text-sm leading-6 text-[#425365]">{devotional.look_within.map((item: string, i: number) => <li key={i} className="flex gap-3"><span className="font-bold text-[#8C183F]">0{i + 1}</span><span>{item}</span></li>)}</ol></article>}
          {devotional.pray && <article className="mt-4 rounded-2xl bg-[#0F2131] p-6 text-white"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C4A47C]">Ore</p><p className="mt-3 text-sm leading-7 text-white/70">{devotional.pray}</p></article>}
          {devotional.practice_today && <article className="mt-4 rounded-2xl border-l-4 border-[#C4A47C] bg-[#FBFAF7] p-6"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8C183F]">Pratique hoje</p><p className="mt-3 text-sm leading-6 text-[#425365]">{devotional.practice_today}</p></article>}
          {devotional.memory_line && <blockquote className="mt-7 border-t border-[#E1E3E2] pt-6 font-serif text-xl italic leading-8 text-[#0F2131]">“{devotional.memory_line}”</blockquote>}
          {devotional.evidence_note && <p className="mt-6 text-xs leading-5 text-[#7A8794]">Nota de evidência: {devotional.evidence_note}</p>}
        </section> : <section className="grid gap-4 md:grid-cols-3"><div className="rounded-2xl border border-[#E1E3E2] bg-white p-6"><span className="text-2xl text-[#8C183F]">✦</span><h3 className="mt-4 font-serif text-xl font-bold">Entenda</h3><p className="mt-2 text-sm leading-6 text-[#5E6E82]">Comece pelo que o texto realmente diz.</p></div><div className="rounded-2xl border border-[#E1E3E2] bg-white p-6"><span className="text-2xl text-[#C4A47C]">◌</span><h3 className="mt-4 font-serif text-xl font-bold">Medite</h3><p className="mt-2 text-sm leading-6 text-[#5E6E82]">Deixe a verdade confrontar e iluminar o coração.</p></div><div className="rounded-2xl border border-[#E1E3E2] bg-white p-6"><span className="text-2xl text-[#315494]">→</span><h3 className="mt-4 font-serif text-xl font-bold">Pratique</h3><p className="mt-2 text-sm leading-6 text-[#5E6E82]">Transforme compreensão em uma resposta concreta.</p></div></section>}
      </div>
    </ModuleShell>
  );
}
