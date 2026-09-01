'use client';

import { useMemo, useState } from "react";
import { ModuleShell } from "../components/ModuleShell";

const resources = [
  { type: "E-book", category: "E-books", title: "Panorama Bíblico", meta: "PDF / ePub · Coram Deo", action: "Abrir no leitor →" },
  { type: "Estudo", category: "Estudos", title: "Antigo Testamento", meta: "Material oficial de estudo", action: "Abrir estudo →" },
  { type: "Comentário", category: "Comentários", title: "João — Contexto e interpretação", meta: "Comentário bíblico", action: "Abrir conteúdo →" },
  { type: "Vídeo", category: "Vídeos", title: "O Verbo que se fez carne", meta: "Vídeo externo · YouTube", action: "Assistir vídeo →" },
  { type: "Ministério", category: "Ministério", title: "Guia para líderes", meta: "Material oficial · PDF", action: "Abrir material →" },
  { type: "Livro", category: "Livros", title: "Introdução ao estudo bíblico", meta: "Livro autorizado", action: "Abrir no leitor →" },
];
const categories = ["Todos", "E-books", "Estudos", "Comentários", "Vídeos", "Ministério", "Livros"];

export default function BibliotecaPage() {
  const [category, setCategory] = useState("Todos");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => resources.filter((r) => (category === "Todos" || r.category === category) && `${r.title} ${r.meta}`.toLowerCase().includes(query.toLowerCase())), [category, query]);
  return <ModuleShell title="Biblioteca" description="Um acervo oficial para aprofundar seu conhecimento da Palavra e sua formação cristã.">
    <section className="rounded-2xl bg-[#0F2131] p-6 text-white md:p-8"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C4A47C]">Acervo oficial</p><h2 className="mt-2 font-serif text-2xl font-bold">Conteúdo para estudar, ensinar e crescer</h2><div className="mt-5 flex gap-3 rounded-xl bg-white p-2"><span className="pl-3 text-xl text-[#8C183F]">⌕</span><input value={query} onChange={(e)=>setQuery(e.target.value)} className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm text-[#0F2131] outline-none" placeholder="Pesquisar na biblioteca..." /></div></section>
    <div className="mt-6 flex flex-wrap gap-2">{categories.map((c)=><button key={c} onClick={()=>setCategory(c)} className={`rounded-lg px-4 py-2 text-xs font-semibold ${category===c?"bg-[#8C183F] text-white":"border border-[#E1E7EA] bg-white text-[#5E6E82]"}`}>{c}</button>)}</div>
    <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((r)=><article key={r.title} className="overflow-hidden rounded-2xl border border-[#E1E7EA] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)]"><div className="relative flex h-36 items-center justify-center bg-[#0F2131] px-6"><span className="absolute left-4 top-4 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/70">{r.type}</span><span className="text-center font-serif text-xl font-bold text-[#C4A47C]">{r.type==="Vídeo"?"▶":"✦"}</span></div><div className="p-5"><span className="text-[11px] font-semibold uppercase tracking-wider text-[#5E6E82]">{r.meta}</span><h2 className="mt-2 font-serif text-lg font-bold text-[#0F2131]">{r.title}</h2><p className="mt-2 text-xs leading-5 text-[#5E6E82]">Conteúdo oficial disponível na biblioteca Coram Deo.</p><button className="mt-5 w-full rounded-xl bg-[#8C183F] px-4 py-3 text-xs font-semibold text-white">{r.action}</button></div></article>)}</div>
    {!filtered.length && <div className="mt-6 rounded-2xl border border-dashed border-[#D8D0C5] p-10 text-center text-sm text-[#737B84]">Nenhum conteúdo encontrado.</div>}
  </ModuleShell>;
}