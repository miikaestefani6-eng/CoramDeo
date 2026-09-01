'use client';

import { useEffect, useMemo, useState } from "react";
import { ModuleShell } from "../components/ModuleShell";
import { createClient } from "../../lib/supabase/client";

const categories = ["Todos", "E-books", "Estudos", "Comentários", "Vídeos", "Ministério", "Livros"];
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const ASSETS_FUNCTION = SUPABASE_URL ? `${SUPABASE_URL}/functions/v1/coram-v1-assets` : "";

type Asset = {
  id: string;
  kind: "pdf" | "ebook" | "video";
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
  if (asset.kind === "video") return "Vídeos";
  return "Estudos";
}

function actionFor(asset: Asset) {
  if (asset.kind === "video") return "Assistir vídeo →";
  if (asset.kind === "ebook" || asset.kind === "pdf") return "Abrir no leitor →";
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
    setOpening(asset.id);
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível abrir este material.");
    } finally {
      setOpening(null);
    }
  }

  return (
    <ModuleShell title="Biblioteca" description="Um acervo para aprofundar seu conhecimento da Palavra e sua formação cristã.">
      <section className="rounded-2xl bg-[#0F2131] p-6 text-white md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#C4A47C]">Acervo oficial Coram Deo</p>
        <h2 className="mt-2 font-serif text-2xl font-bold">Conteúdo para estudar, ensinar e crescer</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">Materiais publicados pela plataforma aparecem aqui automaticamente. Aulas ao vivo permanecem como uma experiência própria e não são misturadas ao acervo.</p>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Pesquisar na biblioteca..." className="mt-5 w-full rounded-xl bg-white px-4 py-3 text-sm text-[#0F2131] outline-none" />
      </section>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`rounded-lg px-4 py-2 text-xs font-semibold ${category === item ? "bg-[#8C183F] text-white" : "border border-[#E1E7EA] bg-white text-[#5E6E82]"}`}>{item}</button>)}
      </div>

      {error && <div className="mt-6 rounded-2xl border border-[#E7C7D2] bg-[#FFF8FA] p-4 text-sm text-[#8C183F]">{error}</div>}

      {loading ? (
        <div className="mt-6 rounded-2xl border border-[#E1E7EA] bg-white p-10 text-center text-sm text-[#5E6E82]">Carregando o acervo oficial...</div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((asset) => {
            const categoryLabel = categoryFor(asset);
            const cover = asset.cover_url || asset.thumbnail_url;
            return <article key={asset.id} className="overflow-hidden rounded-2xl border border-[#E1E7EA] bg-white shadow-[0_4px_12px_rgba(0,0,0,.06)]">
              <div className="relative flex h-40 items-center justify-center bg-[#0F2131]">
                {cover ? <img src={cover} alt="" className="h-full w-full object-cover" /> : <span className="font-serif text-xl font-bold text-[#C4A47C]">{asset.kind === "video" ? "▶" : "✦"}</span>}
              </div>
              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5E6E82]">{categoryLabel}</span>
                  <span className="rounded-full bg-[#F6F5F2] px-2.5 py-1 text-[10px] font-semibold text-[#0F2131]">Conteúdo da plataforma</span>
                </div>
                <h2 className="mt-2 font-serif text-lg font-bold text-[#0F2131]">{asset.title}</h2>
                {asset.description && <p className="mt-2 line-clamp-3 text-sm leading-5 text-[#5E6E82]">{asset.description}</p>}
                <p className="mt-3 text-xs text-[#737B84]">{asset.author_name || asset.speaker_or_channel || (asset.page_count ? `${asset.page_count} páginas` : asset.duration_label || "Material oficial")}</p>
                <button onClick={() => openAsset(asset)} disabled={opening === asset.id} className="mt-5 w-full rounded-xl bg-[#8C183F] px-4 py-3 text-xs font-semibold text-white disabled:opacity-60">{opening === asset.id ? "Abrindo..." : actionFor(asset)}</button>
              </div>
            </article>;
          })}
        </div>
      )}

      {!loading && !filtered.length && !error && <div className="mt-6 rounded-2xl border border-dashed border-[#D8D0C5] p-10 text-center text-sm text-[#737B84]">Nenhum conteúdo publicado encontrado. Quando você publicar um material pelo CMS, ele aparecerá aqui automaticamente.</div>}
    </ModuleShell>
  );
}
