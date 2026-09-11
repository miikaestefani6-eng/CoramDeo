'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { ModuleShell } from "../components/ModuleShell";
import { createClient } from "../../lib/supabase/client";

type Note = {
  id: string;
  study_id: string;
  section_key: string;
  body: string;
  created_at: string;
  studies: { reference: string; title: string | null } | null;
};

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
        const { data, error: queryError } = await supabase
          .from("study_notes")
          .select("id,study_id,section_key,body,created_at,studies(reference,title)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (queryError) throw queryError;
        setNotes((data ?? []) as unknown as Note[]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Não foi possível carregar suas anotações.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  return (
    <ModuleShell title="Minhas Anotações" description="Anotações vinculadas aos estudos que você realizou.">
      {error && <div className="mb-5 rounded-xl border border-[#E7C7D2] bg-[#FFF8FA] p-4 text-sm text-[#8C183F]">{error}</div>}
      {loading ? (
        <div className="rounded-xl border border-[#E1E7EA] bg-white p-8 text-sm text-[#5E6E82]">Carregando suas anotações...</div>
      ) : notes.length ? (
        <div className="space-y-4">
          {notes.map((note) => {
            const reference = note.studies?.reference || "Estudo bíblico";
            return <article key={note.id} className="rounded-2xl border border-[#E1E7EA] bg-white p-6 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C4A47C]">{note.section_key === "geral" ? "Anotação" : note.section_key}</p>
              <h2 className="mt-2 font-serif text-xl font-bold text-[#0F2131]">{note.studies?.title || reference}</h2>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-[#5E6E82]">{note.body}</p>
              <Link href={`/estudar?query=${encodeURIComponent(reference)}`} className="mt-5 inline-block text-xs font-semibold text-[#8C183F]">Voltar ao estudo →</Link>
            </article>;
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#D8D0C5] bg-white p-8 text-center text-sm text-[#5E6E82]">Suas anotações de estudo aparecerão aqui quando você salvar a primeira.</div>
      )}
    </ModuleShell>
  );
}
