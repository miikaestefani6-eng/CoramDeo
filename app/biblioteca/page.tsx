'use client';

import { useEffect, useMemo, useState } from "react";
import { ModuleShell } from "../components/ModuleShell";
import { createClient } from "../../lib/supabase/client";

const categories = ["Todos", "E-books", "Estudos", "Comentários", "Vídeos", "Ministério", "Livros"];
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const ASSETS_FUNCTION = SUPABASE_URL ? `${SUPABASE_URL}/functions/v1/coram-v1-assets` : "";

type Asset = {
  id: string;
  kind: "pdf" | "ebook" | "study" | "commentary" | "video" | "ministry";
  title: string;
  description?: string | null;
  category?: string | null;
  author_name?: string | null;
  speaker_or_channel?: string | null;
  duration_label?: string | null;
  thumbnail_url?: string | null;
  cover_url?: string | null;
  external_url?: string | null;
  page_count?: number | null;
};

function categoryFor(asset: Asset) {
  const value = (asset.category || "").toLowerCase();
  const match = categories.slice(1).find((item) => item.toLowerCase() === value);
  if (match) return match;
  if (asset.kind === "ebook") return "E-books";
  if (asset.kind === "study") return "Estudos";
  if (asset.kind === "commentary") return "Comentários";
  if (asset.kind === "video") return "Vídeos";
  if (asset.kind === "ministry") return "Ministério";
  if (asset.kind === "pdf") return "Livros";
  return "Estudos";
}

function actionFor(asset: Asset) {
  if (asset.kind === "video") return "Assistir vídeo →";
  if (asset.kind === "ebook" || asset.kind === "pdf") return "Abrir material →";
  return "Abrir conteúdo →";
}

export default function BibliotecaPage() {
  const [category, setCategory] = useState("Todos");
  const [query, setQuery] = useState("");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [opening, setOpening] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        if (!ASSETS_FUNCTION) throw new Error("Backend indisponível.");
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) throw new Error("Entre na sua conta para acessar o acervo.");
        const response = await fetch(ASSETS_FUNCTION, { headers: { Authorization: `Bearer ${session.access_token}` }, cache: "no-store" });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || "Não foi possível carregar o acervo.");
        setAssets(payload.assets || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Não foi possível carregar o acervo.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    return assets.filter((asset) => {
      const categoryMatch = category === "Todos" || categoryFor(asset) === category;
      const searchText = [asset.title, asset.description, asset.category, asset.author_name, asset.speaker_or_channel].filter(Boolean).join(" ").toLowerCase();
      return categoryMatch && (!normalized || searchText.includes(normalized));
    });
  }, [assets, category, query]);

  async function openAsset(asset: Asset) {
    setOpening(asset.id); setError("");
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Sua sessão expirou.");
      const response = await fetch(`${ASSETS_FUNCTION}?id=${encodeURIComponent(asset.id)}`, { headers: { Authorization: `Bearer ${session.access_token}` }, cache: "no-store" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Não foi possível abrir este material.");
      const url = payload.asset?.access_url || payload.asset?.external_url;
      if (!url) throw new Error("Este material ainda não possui um arquivo ou link disponível.");
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) { setError(err instanceof Error ? err.message : "Não foi possível abrir este material."); }
    finally { setOpening(null); }
  }

  return <ModuleShell title="Biblioteca" description="Um acervo para aprofundar seu conhecimento da Palavra e sua formação cristã.">
    <section className="relative overflow-hidden rounded-[30px] bg-[#0B1119] p-7 text-white shadow-[0_24px_70px_rgba(21,18,14,.16)] md:p-9"><div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(213,181,121,.14),transparent_30%)]"/><div className="relative max-w-3xl"><p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#D5B579]">Acervo Coram Deo</p><h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-.02em]">Conteúdo para estudar, ensinar e crescer.</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-white/48">E-books, estudos e materiais selecionados para acompanhar sua jornada sem tirar a Bíblia do centro.</p><div className="mt-6 rounded-[20px] border border-white/10 bg-white/[.055] p-2"><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Pesquisar título, autor ou tema..." className="w-full bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/28"/></div></div></section>
    <div className="mt-6 flex flex-wrap gap-2">{categories.map(item=><button key={item} onClick={()=>setCategory(item)} className={`rounded-full px-4 py-2 text-xs font-semibold transition ${category===item?"bg-[#D5B579] text-[#111820]":"border border-[#D5C8B5] bg-[#F7F1E7] text-[#665E54] hover:border-[#B99A64]"}`}>{item}</button>)}</div>
    {error&&<div className="mt-6 rounded-[22px] border border-[#A95E5E]/20 bg-[#F8ECE8] p-4 text-sm text-[#7C403E]">{error}</div>}
    {loading?<div className="mt-6 rounded-[26px] border border-[#D5C8B5] bg-[#F7F1E7] p-10 text-center text-sm text-[#665E54]">Carregando o acervo oficial...</div>:<div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map(asset=>{const categoryLabel=categoryFor(asset);const cover=asset.cover_url||asset.thumbnail_url;return <article key={asset.id} className="group overflow-hidden rounded-[26px] border border-[#D5C8B5] bg-[#F7F1E7] transition hover:-translate-y-1 hover:border-[#B99A64] hover:shadow-[0_20px_55px_rgba(48,38,26,.10)]"><div className="relative flex h-48 items-center justify-center overflow-hidden bg-[#0B1119]">{cover?<img src={cover} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"/>:<div className="text-center"><span className="font-serif text-3xl text-[#D5B579]">{asset.kind==="video"?"▶":"✦"}</span><p className="mt-3 text-[9px] font-bold uppercase tracking-[.22em] text-white/35">Coram Deo</p></div>}</div><div className="p-6"><div className="flex flex-wrap items-center justify-between gap-2"><span className="text-[10px] font-bold uppercase tracking-[.18em] text-[#8B6A34]">{categoryLabel}</span><span className="rounded-full border border-[#D5C8B5] px-2.5 py-1 text-[9px] font-semibold text-[#6D6257]">Acervo oficial</span></div><h2 className="mt-4 font-serif text-xl font-semibold leading-tight text-[#111820]">{asset.title}</h2>{asset.description&&<p className="mt-3 line-clamp-3 text-sm leading-6 text-[#665E54]">{asset.description}</p>}<p className="mt-4 text-xs text-[#7A7066]">{asset.author_name||asset.speaker_or_channel||(asset.page_count?`${asset.page_count} páginas`:asset.duration_label||"Material oficial")}</p><button onClick={()=>openAsset(asset)} disabled={opening===asset.id} className="mt-6 w-full rounded-full bg-[#111820] px-4 py-3 text-xs font-bold text-[#F8F2E8] transition hover:bg-[#1A2430] disabled:opacity-60">{opening===asset.id?"Abrindo...":actionFor(asset)}</button></div></article>})}</div>}
    {!loading&&!filtered.length&&!error&&<div className="mt-6 rounded-[26px] border border-dashed border-[#CBBCA8] bg-[#F7F1E7] p-10 text-center"><p className="font-serif text-xl text-[#111820]">Nenhum material encontrado.</p><p className="mt-2 text-sm text-[#70675D]">Tente outra busca ou categoria.</p></div>}
  </ModuleShell>;
}
