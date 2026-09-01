import { ModuleShell } from "../components/ModuleShell";
import { createClient } from "@/lib/supabase/server";

export default async function PerfilPage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;
  const userId = claims?.sub;

  let profile: { full_name: string | null; username: string | null; avatar_url: string | null } | null = null;
  if (userId) {
    const { data } = await supabase.from("profiles").select("full_name, username, avatar_url").eq("id", userId).maybeSingle();
    profile = data;
  }

  const name = profile?.full_name || profile?.username || "Sua jornada";
  const initial = name.charAt(0).toUpperCase() || "C";

  return <ModuleShell title="Meu perfil" description="Seu espaço para acompanhar sua jornada de aprendizagem e discipulado no Coram Deo.">
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <section className="rounded-2xl bg-[#0F2131] p-7 text-white shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#C4A47C]/20 font-serif text-2xl text-[#C4A47C]">{profile?.avatar_url ? <img src={profile.avatar_url} alt="Foto do perfil" className="h-full w-full object-cover" /> : initial}</div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#C4A47C]">Minha jornada</p>
        <h2 className="mt-2 font-serif text-2xl font-bold">{name}</h2>
        <p className="mt-2 text-sm leading-6 text-white/60">{claims?.email ?? "Conta autenticada no Coram Deo."}</p>
        <p className="mt-4 text-xs text-white/45">Seu perfil é carregado da sua conta e protegido pelas políticas de acesso.</p>
      </section>
      <section className="rounded-2xl border border-[#E1E7EA] bg-white p-7 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C4A47C]">Sua jornada</p>
        <h2 className="mt-2 font-serif text-2xl font-bold text-[#0F2131]">Conheça seu momento</h2>
        <div className="mt-6 divide-y divide-[#E1E7EA]"><div className="flex flex-wrap items-center justify-between gap-3 py-4"><span className="text-sm text-[#5E6E82]">Conhecimento bíblico</span><span className="text-sm font-semibold text-[#0F2131]">Em construção</span></div><div className="flex flex-wrap items-center justify-between gap-3 py-4"><span className="text-sm text-[#5E6E82]">Objetivo</span><span className="text-sm font-semibold text-[#0F2131]">Aprofundar na Palavra</span></div><div className="flex flex-wrap items-center justify-between gap-3 py-4"><span className="text-sm text-[#5E6E82]">Plano ativo</span><span className="text-sm font-semibold text-[#0F2131]">Acompanhe em Progresso</span></div></div>
        <div className="mt-6 grid grid-cols-2 gap-3"><a href="/biblioteca" className="rounded-lg bg-[#F8F9FA] p-3 text-center text-xs font-semibold">Biblioteca</a><a href="/progresso" className="rounded-lg bg-[#F8F9FA] p-3 text-center text-xs font-semibold">Progresso</a></div>
      </section>
    </div>
  </ModuleShell>;
}
