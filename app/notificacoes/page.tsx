'use client';

import { useEffect, useState } from "react";
import { ModuleShell } from "../components/ModuleShell";
import { createClient } from "../../lib/supabase/client";

type Notification = { id: string; title: string; message: string; severity: string; action_label: string | null; action_url: string | null; read_at: string | null; created_at: string };

export default function NotificacoesPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) throw new Error("Entre na sua conta para ver suas notificações.");
        const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
        if (!base) throw new Error("Backend indisponível.");
        const response = await fetch(`${base}/functions/v1/coram-v1-notifications`, { headers: { Authorization: `Bearer ${session.access_token}` }, cache: "no-store" });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || "Não foi possível carregar suas notificações.");
        setItems(payload.notifications || []);
      } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível carregar suas notificações."); }
      finally { setLoading(false); }
    }
    void load();
  }, []);

  const unread = items.filter((item) => !item.read_at).length;

  return (
    <ModuleShell title="Notificações" description="Avisos, novidades e mensagens importantes do Coram Deo.">
      <section className="rounded-[28px] border border-[#D5C8B5] bg-[#F7F1E7] p-6 md:p-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#8B6A34]">Central de avisos</p><h2 className="mt-2 font-serif text-2xl font-semibold">O que merece sua atenção.</h2><p className="mt-2 text-sm leading-6 text-[#665E54]">Atualizações da plataforma aparecem aqui sem interromper sua jornada de estudo.</p></div><span className="rounded-full bg-[#111820] px-4 py-2 text-xs font-bold text-[#F8F2E8]">{unread} {unread === 1 ? "não lida" : "não lidas"}</span></div></section>

      {error && <div className="mt-5 rounded-[22px] border border-[#A95E5E]/20 bg-[#F8ECE8] p-4 text-sm text-[#7C403E]">{error}</div>}
      {loading ? <div className="mt-5 rounded-[26px] border border-[#D5C8B5] bg-[#F7F1E7] p-8 text-sm text-[#665E54]">Carregando notificações...</div> : (
        <div className="mt-5 space-y-3">
          {items.map((item) => <article key={item.id} className={`rounded-[24px] border p-5 md:p-6 ${item.read_at ? "border-[#D5C8B5] bg-[#F7F1E7]" : "border-[#B99A64] bg-[#FBF3E3]"}`}><div className="flex items-start gap-4"><span className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${item.read_at ? "bg-[#B8AA98]" : "bg-[#D5B579]"}`} /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-2"><div><p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#8B6A34]">{item.read_at ? "Lida" : "Nova mensagem"}</p><h2 className="mt-1 font-serif text-xl font-semibold text-[#111820]">{item.title}</h2></div><span className="text-[11px] text-[#7E7469]">{new Date(item.created_at).toLocaleDateString("pt-BR")}</span></div><p className="mt-3 text-sm leading-7 text-[#665E54]">{item.message}</p>{item.action_url && <a href={item.action_url} className="mt-4 inline-flex rounded-full border border-[#BFAE97] px-4 py-2.5 text-xs font-bold text-[#111820]">{item.action_label || "Abrir"} →</a>}</div></div></article>)}
        </div>
      )}
      {!loading && !items.length && !error && <div className="mt-5 rounded-[28px] border border-dashed border-[#CBBCA8] bg-[#F7F1E7] p-10 text-center"><p className="font-serif text-xl text-[#111820]">Tudo em ordem por aqui.</p><p className="mt-2 text-sm text-[#70675D]">Você não tem novas notificações.</p></div>}
    </ModuleShell>
  );
}
