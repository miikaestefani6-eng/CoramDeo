'use client';

import { useEffect, useState } from "react";
import { ModuleShell } from "../components/ModuleShell";
import { createClient } from "../../lib/supabase/client";

type NotificationItem = { id: string; title: string; message: string; severity: string; action_label: string | null; action_url: string | null; read_at: string | null; created_at: string };
type PushPreferences = { enabled: boolean; devotional_daily: boolean; reading_plan: boolean; product_updates: boolean };
type PushState = { public_key: string; subscribed: boolean; subscription_count: number; preferences: PushPreferences };

const defaultPrefs: PushPreferences = { enabled: true, devotional_daily: true, reading_plan: true, product_updates: true };

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export default function NotificacoesPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [push, setPush] = useState<PushState | null>(null);
  const [currentDeviceSubscribed, setCurrentDeviceSubscribed] = useState(false);
  const [pushBusy, setPushBusy] = useState(false);
  const [pushMessage, setPushMessage] = useState("");
  const [supported, setSupported] = useState(false);
  const [iosNeedsInstall, setIosNeedsInstall] = useState(false);

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");

  async function authRequest(body?: Record<string, unknown>) {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) throw new Error("Sua sessão expirou.");
    if (!base) throw new Error("Backend indisponível.");
    const response = await fetch(`${base}/functions/v1/coram-v1-notifications`, {
      method: body ? "POST" : "GET",
      headers: { Authorization: `Bearer ${session.access_token}`, ...(body ? { "Content-Type": "application/json" } : {}) },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "Não foi possível concluir a operação.");
    return payload;
  }

  async function refreshPushDeviceState() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
      setSupported(false);
      return;
    }
    setSupported(true);
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIosNeedsInstall(isIOS && !standalone);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setCurrentDeviceSubscribed(!!subscription);
    } catch {
      setCurrentDeviceSubscribed(false);
    }
  }

  async function load() {
    try {
      setError("");
      const payload = await authRequest();
      setItems(payload.notifications || []);
      setPush(payload.push || null);
      await refreshPushDeviceState();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível carregar suas notificações.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function enablePush() {
    setPushBusy(true); setPushMessage(""); setError("");
    try {
      if (!push?.public_key) throw new Error("Configuração de push indisponível.");
      if (!supported) throw new Error("Este navegador ainda não oferece suporte a notificações push.");
      if (iosNeedsInstall) throw new Error("No iPhone, adicione primeiro o Coram Deo à Tela de Início e abra o aplicativo por lá.");
      const permission = await Notification.requestPermission();
      if (permission !== "granted") throw new Error("A permissão de notificações não foi concedida.");
      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(push.public_key),
        });
      }
      const json = subscription.toJSON();
      await authRequest({ action: "push_subscribe", subscription: json, user_agent: navigator.userAgent, platform: navigator.platform || null });
      setCurrentDeviceSubscribed(true);
      setPush((prev) => prev ? { ...prev, subscribed: true, subscription_count: Math.max(1, prev.subscription_count) } : prev);
      setPushMessage("Notificações ativadas neste dispositivo.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível ativar as notificações.");
    } finally { setPushBusy(false); }
  }

  async function disablePush() {
    setPushBusy(true); setPushMessage(""); setError("");
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      const endpoint = subscription?.endpoint || "";
      if (subscription) await subscription.unsubscribe();
      await authRequest({ action: "push_unsubscribe", endpoint });
      setCurrentDeviceSubscribed(false);
      setPushMessage("Notificações desativadas neste dispositivo.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível desativar as notificações.");
    } finally { setPushBusy(false); }
  }

  async function savePreference(key: keyof PushPreferences, value: boolean) {
    if (!push) return;
    const next = { ...push.preferences, [key]: value };
    setPush({ ...push, preferences: next });
    try {
      await authRequest({ action: "push_preferences", ...next });
    } catch (e) {
      setPush({ ...push, preferences: push.preferences });
      setError(e instanceof Error ? e.message : "Não foi possível salvar suas preferências.");
    }
  }

  async function testPush() {
    setPushBusy(true); setPushMessage(""); setError("");
    try {
      await authRequest({ action: "push_test" });
      setPushMessage("Push de teste enviado. Ele deve aparecer em alguns segundos.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível enviar o teste.");
    } finally { setPushBusy(false); }
  }

  const unread = items.filter((item) => !item.read_at).length;
  const prefs = push?.preferences || defaultPrefs;

  return (
    <ModuleShell title="Notificações" description="Avisos, novidades e mensagens importantes do Coram Deo.">
      <section className="rounded-[28px] border border-[#D5C8B5] bg-[#F7F1E7] p-6 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#8B6A34]">Central de avisos</p><h2 className="mt-2 font-serif text-2xl font-semibold">O que merece sua atenção.</h2><p className="mt-2 text-sm leading-6 text-[#665E54]">Atualizações da plataforma aparecem aqui sem interromper sua jornada de estudo.</p></div><span className="rounded-full bg-[#111820] px-4 py-2 text-xs font-bold text-[#F8F2E8]">{unread} {unread === 1 ? "não lida" : "não lidas"}</span></div>
      </section>

      {!loading && (
        <section className="mt-5 rounded-[28px] border border-[#D5C8B5] bg-white p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl"><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#8B6A34]">Push no celular</p><h2 className="mt-2 font-serif text-2xl font-semibold text-[#111820]">Receba o Coram Deo mesmo quando estiver fora do app.</h2><p className="mt-2 text-sm leading-6 text-[#665E54]">Você escolhe o que quer receber e pode desativar a qualquer momento.</p></div>
            <span className={`rounded-full px-4 py-2 text-xs font-bold ${currentDeviceSubscribed ? "bg-emerald-50 text-emerald-700" : "bg-[#F1ECE4] text-[#70675D]"}`}>{currentDeviceSubscribed ? "Ativo neste dispositivo" : "Desativado neste dispositivo"}</span>
          </div>

          {iosNeedsInstall && <div className="mt-5 rounded-[18px] border border-[#D5B579]/30 bg-[#FBF3E3] p-4 text-sm leading-6 text-[#6E5B3A]">No iPhone, instale primeiro o Coram Deo em <strong>Compartilhar → Adicionar à Tela de Início</strong>. Depois abra o app pela Tela de Início para ativar o push.</div>}
          {!supported && <div className="mt-5 rounded-[18px] border border-[#D5C8B5] bg-[#F7F1E7] p-4 text-sm text-[#665E54]">Este navegador não oferece suporte a Web Push neste momento.</div>}
          {pushMessage && <div className="mt-5 rounded-[18px] bg-emerald-50 p-4 text-sm text-emerald-700">{pushMessage}</div>}

          <div className="mt-6 flex flex-wrap gap-3">
            {!currentDeviceSubscribed ? <button disabled={pushBusy || !supported} onClick={enablePush} className="rounded-full bg-[#111820] px-5 py-3 text-xs font-bold text-[#F8F2E8] disabled:opacity-50">{pushBusy ? "Ativando..." : "Ativar notificações"}</button> : <><button disabled={pushBusy} onClick={testPush} className="rounded-full bg-[#D5B579] px-5 py-3 text-xs font-bold text-[#111820] disabled:opacity-50">Enviar push de teste</button><button disabled={pushBusy} onClick={disablePush} className="rounded-full border border-[#CBBCA8] px-5 py-3 text-xs font-bold text-[#665E54] disabled:opacity-50">Desativar neste dispositivo</button></>}
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-3">
            {([
              ["devotional_daily", "Devocional diário", "Lembretes e novos devocionais."],
              ["reading_plan", "Plano de leitura", "Lembretes ligados aos seus planos."],
              ["product_updates", "Novidades do Coram Deo", "Conteúdos, biblioteca e avisos da plataforma."],
            ] as const).map(([key, title, description]) => (
              <label key={key} className="flex cursor-pointer items-start justify-between gap-4 rounded-[20px] border border-[#E0D7CB] bg-[#FAF7F1] p-4">
                <span><span className="block text-sm font-semibold text-[#111820]">{title}</span><span className="mt-1 block text-xs leading-5 text-[#766C61]">{description}</span></span>
                <input type="checkbox" checked={prefs[key]} onChange={(e) => savePreference(key, e.target.checked)} className="mt-1 h-4 w-4" />
              </label>
            ))}
          </div>
        </section>
      )}

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
