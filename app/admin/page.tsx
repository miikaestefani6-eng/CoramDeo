"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AdminUser = {
  id: string;
  email?: string | null;
  display_name?: string | null;
  created_at?: string | null;
  last_sign_in_at?: string | null;
  is_owner?: boolean;
  access?: { access_status?: string; notice_count?: number; block_reason?: string | null };
  subscription?: { status?: string; current_period_end?: string | null } | null;
  alert?: string;
};

type LaunchConfig = {
  official_app_url?: string;
  support_email?: string;
  legal_responsible?: string;
  payment_provider?: string;
  monthly_price_cents?: string;
  registrations_open?: boolean;
  maintenance_mode?: boolean;
  maintenance_message?: string;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? "";

async function authHeaders() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("Entre com uma conta administrativa.");
  return { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" };
}

async function callFunction(slug: string, init?: RequestInit) {
  if (!SUPABASE_URL) throw new Error("Backend indisponível.");
  const headers = await authHeaders();
  const response = await fetch(`${SUPABASE_URL}/functions/v1/${slug}`, { ...init, headers: { ...headers, ...(init?.headers || {}) }, cache: "no-store" });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || "Não foi possível concluir a operação.");
  return payload;
}

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [config, setConfig] = useState<LaunchConfig>({});
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function load(search = "") {
    setLoading(true); setError("");
    try {
      const [userPayload, launchPayload] = await Promise.all([
        callFunction(`coram-v1-admin-users${search ? `?q=${encodeURIComponent(search)}` : ""}`),
        callFunction("coram-v1-launch-config"),
      ]);
      setUsers(userPayload.users || []);
      setConfig(launchPayload.config || {});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível carregar o painel administrativo.");
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function searchUsers(event: FormEvent) { event.preventDefault(); await load(query.trim()); }

  async function setStatus(user: AdminUser, status: string) {
    if (user.is_owner) return;
    setSaving(true); setError(""); setMessage("");
    try {
      await callFunction("coram-v1-admin-users", { method: "POST", body: JSON.stringify({ action: "set_status", user_id: user.id, status }) });
      setMessage(`Acesso de ${user.display_name || user.email || "usuário"} atualizado para ${status}.`);
      await load(query.trim());
    } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível atualizar o acesso."); }
    finally { setSaving(false); }
  }

  async function sendNotice(event: FormEvent) {
    event.preventDefault();
    if (!selectedUser) return;
    setSaving(true); setError(""); setMessage("");
    try {
      await callFunction("coram-v1-notifications", { method: "POST", body: JSON.stringify({ action: "admin_send", user_id: selectedUser.id, title: noticeTitle, message: noticeMessage, severity: "info", type: "admin", source: "admin_panel" }) });
      setMessage("Notificação enviada com sucesso.");
      setNoticeTitle(""); setNoticeMessage(""); setSelectedUser(null);
    } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível enviar a notificação."); }
    finally { setSaving(false); }
  }

  const counts = useMemo(() => ({
    total: users.length,
    active: users.filter(u => ["active", "courtesy"].includes(u.access?.access_status || "active")).length,
    pending: users.filter(u => ["payment_due", "grace"].includes(u.access?.access_status || "")).length,
    blocked: users.filter(u => u.access?.access_status === "blocked").length,
  }), [users]);

  return (
    <main className="min-h-screen bg-[#F6F5F2] px-5 py-8 text-[#0F2131] lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C4A47C]">Administração V1</p>
            <h1 className="mt-2 font-serif text-3xl font-bold">Painel Coram Deo</h1>
            <p className="mt-2 text-sm text-[#5E6E82]">Gestão mínima de usuários, acessos, notificações e configuração de lançamento.</p>
          </div>
          <a href="/" className="rounded-xl border border-[#DDE2E3] bg-white px-4 py-2 text-sm font-semibold">Voltar ao aplicativo</a>
        </header>

        {error && <div className="rounded-2xl border border-[#8C183F]/20 bg-[#8C183F]/5 p-4 text-sm text-[#8C183F]">{error}</div>}
        {message && <div className="rounded-2xl border border-[#1A707E]/20 bg-[#1A707E]/5 p-4 text-sm text-[#1A707E]">{message}</div>}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[['Usuários', counts.total], ['Ativos', counts.active], ['Pendências', counts.pending], ['Bloqueados', counts.blocked]].map(([label, value]) => (
            <article key={String(label)} className="rounded-2xl border border-[#E1E3E2] bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#7A8794]">{label}</p>
              <p className="mt-2 font-serif text-3xl font-bold">{value}</p>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-[#E1E3E2] bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div><h2 className="font-serif text-2xl font-bold">Usuários e acesso</h2><p className="mt-1 text-sm text-[#5E6E82]">Busca e controle de acesso usando o backend administrativo existente.</p></div>
            <form onSubmit={searchUsers} className="flex gap-2"><input value={query} onChange={e => setQuery(e.target.value)} className="rounded-xl border border-[#DDE2E3] px-4 py-2 text-sm outline-none" placeholder="Nome ou e-mail" /><button className="rounded-xl bg-[#8C183F] px-4 py-2 text-sm font-bold text-white">Buscar</button></form>
          </div>

          {loading ? <p className="mt-6 text-sm text-[#5E6E82]">Carregando dados administrativos...</p> : <div className="mt-6 overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead><tr className="border-b border-[#E1E3E2] text-xs uppercase tracking-wider text-[#7A8794]"><th className="pb-3">Usuário</th><th className="pb-3">Acesso</th><th className="pb-3">Assinatura</th><th className="pb-3">Último login</th><th className="pb-3">Ações</th></tr></thead><tbody>{users.map(user => <tr key={user.id} className="border-b border-[#EEF0F0] align-top"><td className="py-4"><p className="font-semibold">{user.display_name || "Sem nome"}</p><p className="mt-1 text-xs text-[#7A8794]">{user.email}</p></td><td className="py-4"><span className="rounded-full bg-[#F6F5F2] px-2.5 py-1 text-xs font-semibold">{user.access?.access_status || "active"}</span></td><td className="py-4 text-[#5E6E82]">{user.subscription?.status || "—"}</td><td className="py-4 text-[#5E6E82]">{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString("pt-BR") : "—"}</td><td className="py-4"><div className="flex flex-wrap gap-2"><button disabled={saving || user.is_owner} onClick={() => setStatus(user, "active")} className="rounded-lg border border-[#DDE2E3] px-3 py-1.5 text-xs font-semibold disabled:opacity-40">Ativar</button><button disabled={saving || user.is_owner} onClick={() => setStatus(user, "courtesy")} className="rounded-lg border border-[#DDE2E3] px-3 py-1.5 text-xs font-semibold disabled:opacity-40">Cortesia</button><button disabled={saving || user.is_owner} onClick={() => setStatus(user, "blocked")} className="rounded-lg border border-[#8C183F]/30 px-3 py-1.5 text-xs font-semibold text-[#8C183F] disabled:opacity-40">Bloquear</button><button onClick={() => setSelectedUser(user)} className="rounded-lg bg-[#0F2131] px-3 py-1.5 text-xs font-semibold text-white">Notificar</button></div></td></tr>)}</tbody></table></div>}
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-[#E1E3E2] bg-white p-6 shadow-sm">
            <h2 className="font-serif text-xl font-bold">Configuração de lançamento</h2>
            <div className="mt-5 space-y-3 text-sm"><p><span className="font-semibold">URL oficial:</span> {config.official_app_url || "Não configurada"}</p><p><span className="font-semibold">Suporte:</span> {config.support_email || "Não configurado"}</p><p><span className="font-semibold">Responsável legal:</span> {config.legal_responsible || "Não configurado"}</p><p><span className="font-semibold">Pagamentos:</span> {config.payment_provider || "Não configurado"}</p><p><span className="font-semibold">Cadastros:</span> {config.registrations_open === false ? "Fechados" : "Abertos"}</p><p><span className="font-semibold">Manutenção:</span> {config.maintenance_mode ? "Ativa" : "Desativada"}</p></div>
          </article>
          <article className="rounded-2xl border border-[#E1E3E2] bg-white p-6 shadow-sm"><h2 className="font-serif text-xl font-bold">Escopo deste painel</h2><p className="mt-3 text-sm leading-6 text-[#5E6E82]">Esta primeira tela administrativa cobre somente operações já suportadas pelo backend atual. CMS de conteúdos e gestão de preços permanecem separados até validarmos a camada administrativa existente para esses dados.</p></article>
        </section>

        {selectedUser && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-5"><form onSubmit={sendNotice} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-wider text-[#C4A47C]">Notificação administrativa</p><h2 className="mt-1 font-serif text-xl font-bold">{selectedUser.display_name || selectedUser.email}</h2></div><button type="button" onClick={() => setSelectedUser(null)} className="text-xl">×</button></div><input value={noticeTitle} onChange={e => setNoticeTitle(e.target.value)} required className="mt-5 w-full rounded-xl border border-[#DDE2E3] px-4 py-3 text-sm outline-none" placeholder="Título" /><textarea value={noticeMessage} onChange={e => setNoticeMessage(e.target.value)} required rows={5} className="mt-3 w-full rounded-xl border border-[#DDE2E3] px-4 py-3 text-sm outline-none" placeholder="Mensagem" /><button disabled={saving} className="mt-4 w-full rounded-xl bg-[#8C183F] px-4 py-3 text-sm font-bold text-white disabled:opacity-60">{saving ? "Enviando..." : "Enviar notificação"}</button></form></div>}
      </div>
    </main>
  );
}
