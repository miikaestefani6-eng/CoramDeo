'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { ModuleShell } from "../components/ModuleShell";
import { createClient } from "../../lib/supabase/client";

type Bookmark = { id: string; study_id: string | null; reference: string; title: string | null; created_at: string };

export default function FavoritosPage() {
  const [items, setItems] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true); setError("");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Entre na sua conta para ver seus favoritos.");
      const { data, error: queryError } = await supabase.from("bookmarks").select("id,study_id,reference,title,created_at").eq("user_id", user.id).order("created_at", { ascending: false });
      if (queryError) throw queryError;
      setItems(data ?? []);
    } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível carregar seus favoritos."); }
    finally { setLoading(false); }
  }

  useEffect(() => { void load(); }, []);

  async function remove(id: string) {
    const supabase = createClient();
    const { error: deleteError } = await supabase.from("bookmarks").delete().eq("id", id);
    if (deleteError) { setError("Não foi possível remover este favorito."); return; }
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <ModuleShell title="Favoritos" description="Estudos que merecem ser reencontrados com facilidade.">
      <section className="rounded-[28px] border border-[#D5C8B5] bg-[#F7F1E7] p-6 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#8B6A34]">Sua seleção</p><h2 className="mt-2 font-serif text-2xl font-semibold">Volte ao que marcou sua jornada.</h2><p className="mt-2 text-sm leading-6 text-[#665E54]">Abra novamente um estudo salvo ou retire o que já não precisa ficar em destaque.</p></div><span className="rounded-full border border-[#CBBCA8] px-4 py-2 text-xs font-semibold text-[#6E6255]">{items.length} {items.length === 1 ? "favorito" : "favoritos"}</span></div>
      </section>

      {error && <div className="mt-5 rounded-[22px] border border-[#A95E5E]/20 bg-[#F8ECE8] p-4 text-sm text-[#7C403E]">{error}</div>}
      {loading ? (
        <div className="mt-5 rounded-[26px] border border-[#D5C8B5] bg-[#F7F1E7] p-8 text-sm text-[#665E54]">Carregando seus favoritos...</div>
      ) : items.length ? (
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {items.map((item, index) => (
            <article key={item.id} className="rounded-[26px] border border-[#D5C8B5] bg-[#F7F1E7] p-6 transition hover:-translate-y-1 hover:border-[#B99A64] hover:shadow-[0_18px_45px_rgba(48,38,26,.09)]">
              <div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[.2em] text-[#8B6A34]">Estudo salvo · {String(index + 1).padStart(2, "0")}</span><button onClick={() => remove(item.id)} aria-label={`Remover ${item.title || item.reference} dos favoritos`} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D5C8B5] text-[#8B6A34] transition hover:bg-[#EEE5D7]">★</button></div>
              <h2 className="mt-5 font-serif text-2xl font-semibold leading-tight text-[#111820]">{item.title || item.reference}</h2>
              <p className="mt-2 text-sm text-[#70675D]">{item.reference}</p>
              <p className="mt-4 text-xs text-[#8A8075]">Salvo em {new Date(item.created_at).toLocaleDateString("pt-BR")}</p>
              <Link href={`/estudar?query=${encodeURIComponent(item.reference)}`} className="mt-6 inline-flex rounded-full bg-[#111820] px-5 py-3 text-xs font-bold text-[#F8F2E8]">Abrir com Zion →</Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-[28px] border border-dashed border-[#CBBCA8] bg-[#F7F1E7] p-10 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#D5C8B5] text-xl text-[#8B6A34]">☆</div><p className="mt-4 font-serif text-xl text-[#111820]">Sua estante de favoritos está vazia.</p><p className="mt-2 text-sm text-[#70675D]">Quando um estudo merecer voltar com você, salve-o aqui.</p><Link href="/estudar" className="mt-5 inline-flex rounded-full bg-[#D5B579] px-5 py-3 text-xs font-bold text-[#111820]">Explorar com Zion →</Link></div>
      )}
    </ModuleShell>
  );
}
