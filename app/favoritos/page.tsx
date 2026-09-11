'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { ModuleShell } from "../components/ModuleShell";
import { createClient } from "../../lib/supabase/client";

type Bookmark = {
  id: string;
  study_id: string | null;
  reference: string;
  title: string | null;
  created_at: string;
};

export default function FavoritosPage() {
  const [items, setItems] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Entre na sua conta para ver seus favoritos.");
      const { data, error: queryError } = await supabase
        .from("bookmarks")
        .select("id,study_id,reference,title,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (queryError) throw queryError;
      setItems(data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível carregar seus favoritos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function remove(id: string) {
    const supabase = createClient();
    const { error: deleteError } = await supabase.from("bookmarks").delete().eq("id", id);
    if (deleteError) {
      setError("Não foi possível remover este favorito.");
      return;
    }
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <ModuleShell title="Favoritos" description="Seus estudos salvos para voltar quando quiser.">
      {error && <div className="mb-5 rounded-xl border border-[#E7C7D2] bg-[#FFF8FA] p-4 text-sm text-[#8C183F]">{error}</div>}
      {loading ? (
        <div className="rounded-xl border border-[#E1E7EA] bg-white p-8 text-sm text-[#5E6E82]">Carregando seus favoritos...</div>
      ) : items.length ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} className="rounded-2xl border border-[#E1E7EA] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C4A47C]">Estudo</span>
                <button onClick={() => remove(item.id)} aria-label={`Remover ${item.title || item.reference} dos favoritos`} className="text-lg text-[#8C183F]">★</button>
              </div>
              <h2 className="mt-4 font-serif text-xl font-bold text-[#0F2131]">{item.title || item.reference}</h2>
              <p className="mt-2 text-sm leading-6 text-[#5E6E82]">{item.reference}</p>
              <Link href={`/estudar?query=${encodeURIComponent(item.reference)}`} className="mt-5 inline-block rounded-lg border border-[#E1E7EA] px-4 py-2 text-xs font-semibold text-[#0F2131]">Abrir estudo →</Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#D8D0C5] bg-white p-8 text-center text-sm text-[#5E6E82]">Você ainda não salvou nenhum estudo como favorito.</div>
      )}
    </ModuleShell>
  );
}
