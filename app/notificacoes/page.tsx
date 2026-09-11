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
      } catch (e) {
        setError(e instanceof Error ? e.message : "Não foi possível carregar suas notificações.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  return (
    <ModuleShell title="Notificações" description="Acompanhe novidades e avisos importantes do Coram Deo.">
      {error && <div className="mb-5 rounded-xl border border-[#E7C7D2] bg-[#FFF8FA] p-4 text-sm text-[#8C183F]">{error}</div>}
      {loading ? <div className="rounded-xl border border-[#E1E7EA] bg-white p-8 text-sm text-[#5E6E82]">Carregando notificações...</div> : (
        <div className="space-y-3">
          {items.map((item) => <article key={item.id} className={`rounded-2xl border bg-white p-5 shadow-sm ${item.read_at ? "border-[#E1E7EA]" : "border-[#C4A47C]"}`}><div className="flex items-start gap-4"><span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.read_at ? "bg-[#E1E7EA]" : "bg-[#1A707E]"}`} /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-serif text-lg font-bold text-[#0F2131]">{item.title}</h2><span className="text-xs text-[#5E6E82]">{new Date(item.created_at).toLocaleDateString("pt-BR")}</span></div><p className="mt-1 text-sm leading-6 text-[#5E6E82]">{item.message}</p>{item.action_url && <a href={item.action_url} className="mt-3 inline-block text-xs font-semibold text-[#8C183F]">{item.action_label || "Abrir"} →</a>}</div></div></article>)}
        </div>
      )}
      {!loading && !items.length && !error && <div className="rounded-xl border border-dashed border-[#D8D0C5] bg-white p-8 text-center text-sm text-[#5E6E82]">Você não tem novas notificações.</div>}
    </ModuleShell>
  );
}
