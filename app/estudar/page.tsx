"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const groups = [
  ["Evidências", ["Visão geral do livro", "Contexto do texto", "Contexto histórico-cultural", "Linha do tempo", "Línguas bíblicas", "Arqueologia", "Fontes e evidências"]],
  ["Interpretação", ["Aplicação", "Análise literária", "Contexto histórico e profético", "Escatologia", "Conexões bíblicas", "Teologia"]],
  ["Tradição", ["Camadas do texto", "Tradição judaica", "Interpretação histórica"]],
] as const;

const modes = ["equilibrado", "academico", "devocional", "ministerial"] as const;
const modeLabel: Record<string, string> = { equilibrado: "Equilibrado", academico: "Acadêmico", devocional: "Devocional", ministerial: "Ministerial" };

export default function EstudarPage() {
  const [query, setQuery] = useState("Romanos 8:28");
  const [mode, setMode] = useState<(typeof modes)[number]>("equilibrado");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [study, setStudy] = useState<any>(null);

  async function search(event?: FormEvent) {
    event?.preventDefault();
    if (query.trim().length < 2) return;
    setLoading(true); setError(""); setStudy(null);
    try {
      const response = await fetch("/api/estudos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: query.trim(), mode }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Não foi possível preparar o estudo.");
      setStudy(data);
    } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível preparar o estudo."); }
    finally { setLoading(false); }
  }

  const layers = Array.isArray(study?.layers) ? study.layers : [];
  const grouped = groups.map(([group, titles]) => ({ group, items: titles.map(title => layers.find((x: any) => x.title === title)).filter(Boolean) }));

  return (
    <main className="min-h-screen bg-[#F6F5F2] text-[#0F2131]">
      <header className="border-b border-[#E1E3E2] bg-white/95 px-5 py-4 backdrop-blur lg:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="font-serif text-xl font-bold">Coram Deo</Link>
          <Link href="/" className="text-xs font-semibold text-[#8C183F]">← Voltar para Hoje</Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 lg:px-10 lg:py-12">
        <section className="overflow-hidden rounded-[28px] bg-[#0F2131] px-6 py-9 shadow-[0_18px_50px_rgba(15,33,49,0.12)] sm:px-10 lg:px-14 lg:py-12">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C4A47C]">Estudar</p>
          <h1 className="mt-3 max-w-3xl font-serif text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">Não apenas leia. Compreenda.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">Pesquise uma passagem, personagem ou tema e explore o texto em camadas de evidência, interpretação e tradição.</p>

          <form onSubmit={search} className="mt-8 max-w-3xl rounded-2xl bg-white p-2 shadow-xl">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex min-w-0 flex-1 items-center gap-2 px-3"><span className="text-xl text-[#8C183F]">⌕</span><input value={query} onChange={e => setQuery(e.target.value)} className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none" placeholder="Ex.: Romanos 8:28, Ester, fé..." aria-label="Pesquisar passagem ou tema" /></div>
              <button disabled={loading} className="rounded-xl bg-[#8C183F] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#731333] disabled:cursor-wait disabled:opacity-60">{loading ? "Pesquisando…" : "Começar estudo"}</button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {modes.map(item => <button type="button" key={item} onClick={() => setMode(item)} className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${mode === item ? "border-[#C4A47C] bg-[#C4A47C]/15 text-[#F3D9A7]" : "border-white/10 text-white/45 hover:text-white"}`}>{modeLabel[item]}</button>)}
          </div>
        </section>

        {error && <div className="mt-6 rounded-2xl border border-[#8C183F]/15 bg-[#8C183F]/5 p-4 text-sm text-[#8C183F]">{error}</div>}

        {study ? (
          <section className="mt-10">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C4A47C]">Estudo gerado pelo Coram Deo</p><h2 className="mt-1 font-serif text-3xl font-bold">{study.title}</h2><p className="mt-1 text-sm text-[#5E6E82]">{study.reference} · modo {modeLabel[study.mode ?? mode]}</p></div>
              <div className="rounded-xl border border-[#E1E3E2] bg-white px-4 py-3 text-xs font-semibold text-[#5E6E82]">{study.cached ? "✓ Do acervo" : "✦ Novo estudo"}</div>
            </div>

            <div className="mt-8 space-y-10">
              {grouped.map(({ group, items }) => <div key={group}><div className="mb-4 flex items-center gap-3"><span className="h-px flex-1 bg-[#DDE2E3]" /><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C183F]">{group}</p><span className="h-px flex-1 bg-[#DDE2E3]" /></div><div className="grid gap-4 lg:grid-cols-2">{items.map((layer: any) => <article key={layer.key ?? layer.title} className="rounded-2xl border border-[#E1E3E2] bg-white p-6 shadow-sm"><div className="flex gap-4"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0F2131] text-xs font-bold text-[#C4A47C]">{String(layer.key ?? "").replace("l", "") || "•"}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-serif text-lg font-bold">{layer.title}</h3>{layer.confidence && <span className="rounded-full bg-[#F6F5F2] px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#5E6E82]">Confiança {layer.confidence}</span>}</div><p className="mt-3 text-sm leading-6 text-[#5E6E82]">{layer.text}</p>{layer.evidence_note && <p className="mt-4 border-l-2 border-[#C4A47C] pl-3 text-xs leading-5 text-[#7A8794]">{layer.evidence_note}</p>}</div></div></article>)}</div></div>)}
            </div>
          </section>
        ) : (
          <section className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-[#E1E3E2] bg-white p-6"><span className="text-2xl text-[#315494]">◉</span><h2 className="mt-4 font-serif text-xl font-bold">Evidências</h2><p className="mt-2 text-sm leading-6 text-[#5E6E82]">Contexto, história, línguas, arqueologia e fontes.</p></div>
            <div className="rounded-2xl border border-[#E1E3E2] bg-white p-6"><span className="text-2xl text-[#8C183F]">✦</span><h2 className="mt-4 font-serif text-xl font-bold">Interpretação</h2><p className="mt-2 text-sm leading-6 text-[#5E6E82]">Teologia, literatura, conexões e aplicação responsável.</p></div>
            <div className="rounded-2xl border border-[#E1E3E2] bg-white p-6"><span className="text-2xl text-[#BF9B3E]">◈</span><h2 className="mt-4 font-serif text-xl font-bold">Tradição</h2><p className="mt-2 text-sm leading-6 text-[#5E6E82]">Leituras históricas e tradição judaica com distinções claras.</p></div>
          </section>
        )}
      </div>

      <Link href="/siao" className="fixed bottom-6 right-5 z-40 flex items-center gap-2 rounded-full bg-[#8C183F] px-4 py-3 text-xs font-bold text-white shadow-xl"><span className="text-[#C4A47C]">✦</span> Perguntar ao Sião</Link>
    </main>
  );
}
