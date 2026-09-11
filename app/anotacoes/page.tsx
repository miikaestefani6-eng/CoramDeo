'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { ModuleShell } from "../components/ModuleShell";
import { createClient } from "../../lib/supabase/client";

type Note = { id: string; study_id: string; section_key: string; body: string; created_at: string; studies: { reference: string; title: string | null } | null };

export default function AnotacoesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Entre na sua conta para ver suas anotações.");
        const { data, error: queryError } = await supabase.from("study_notes").select("id,study_id,section_key,body,created_at,studies(reference,title)").eq("user_id", user.id).order("created_at", { ascending: false });
        if (queryError) throw queryError;
        setNotes((data ?? []) as unknown as Note[]);
      } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível carregar suas anotações."); }
      finally { setLoading(false); }
    }
    void load();
  }, []);

  return (
    <ModuleShell title="Minhas Anotações" description="Ideias, observações e descobertas que nasceram durante seus estudos.">
      <section className="rounded-[28px] bg-[#0B1119] p-7 text-white md:p-8"><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#D5B579]">Memória de estudo</p><h2 className="mt-3 font-serif text-3xl font-semibold">O que você escreveu também faz parte da jornada.</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-white/48">Cada anotação permanece ligada ao estudo de origem para você reencontrar contexto, passagem e reflexão.</p></section>

      {error && <div className="mt-5 rounded-[22px] border border-[#A95E5E]/20 bg-[#F8ECE8] p-4 text-sm text-[#7C403E]">{error}</div>}
      {loading ? (
        <div className="mt-5 rounded-[26px] border border-[#D5C8B5] bg-[#F7F1E7] p-8 text-sm text-[#665E54]">Carregando suas anotações...</div>
      ) : notes.length ? (
        <div className="mt-5 space-y-4">
          {notes.map((note) => {
            const reference = note.studies?.reference || "Estudo bíblico";
            return <article key={note.id} className="rounded-[26px] border border-[#D5C8B5] bg-[#F7F1E7] p-6 md:p-7"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#8B6A34]">{note.section_key === "geral" ? "Anotação de estudo" : note.section_key}</p><span className="text-[11px] text-[#8A8075]">{new Date(note.created_at).toLocaleDateString("pt-BR")}</span></div><h2 className="mt-3 font-serif text-2xl font-semibold text-[#111820]">{note.studies?.title || reference}</h2><p className="mt-1 text-xs font-semibold text-[#8B6A34]">{reference}</p><div className="mt-5 border-l border-[#CBBCA8] pl-5"><p className="whitespace-pre-wrap text-sm leading-7 text-[#665E54]">{note.body}</p></div><Link href={`/estudar?query=${encodeURIComponent(reference)}`} className="mt-6 inline-flex rounded-full border border-[#BFAE97] px-5 py-3 text-xs font-bold text-[#111820] transition hover:border-[#8B6A34]">Voltar ao estudo →</Link></article>;
          })}
        </div>
      ) : (
        <div className="mt-5 rounded-[28px] border border-dashed border-[#CBBCA8] bg-[#F7F1E7] p-10 text-center"><p className="font-serif text-xl text-[#111820]">Sua primeira anotação ainda está por vir.</p><p className="mt-2 text-sm text-[#70675D]">Durante um estudo com o Zion, registre o que merece ser lembrado.</p><Link href="/estudar" className="mt-5 inline-flex rounded-full bg-[#D5B579] px-5 py-3 text-xs font-bold text-[#111820]">Começar um estudo →</Link></div>
      )}
    </ModuleShell>
  );
}
