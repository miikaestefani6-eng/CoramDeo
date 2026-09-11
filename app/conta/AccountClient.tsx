"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  email: string;
  isAdmin: boolean;
  initialProfile: {
    display_name: string;
    preferred_translation: string;
    biblical_familiarity: string;
    study_minutes: number;
  };
};

const familiarityOptions = [
  ["zero", "Estou começando"],
  ["aprendendo", "Estou aprendendo"],
  ["frequente", "Estudo com frequência"],
  ["aprofundamento", "Quero aprofundamento"],
] as const;

export default function AccountClient({ email, isAdmin, initialProfile }: Props) {
  const [profile, setProfile] = useState(initialProfile);
  const [saving, setSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setProfileMessage("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setProfileMessage("Sua sessão expirou. Entre novamente.");
      setSaving(false);
      return;
    }
    const { error } = await supabase.from("profiles").upsert({
      user_id: user.id,
      display_name: profile.display_name.trim() || null,
      preferred_translation: profile.preferred_translation,
      biblical_familiarity: profile.biblical_familiarity,
      study_minutes: profile.study_minutes,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
    if (!error) {
      await supabase.auth.updateUser({ data: { full_name: profile.display_name.trim() } });
      setProfileMessage("Preferências salvas.");
    } else {
      setProfileMessage("Não foi possível salvar suas preferências agora.");
    }
    setSaving(false);
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordMessage("Use uma senha com pelo menos 6 caracteres.");
      return;
    }
    setChangingPassword(true);
    setPasswordMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) setPasswordMessage("Não foi possível alterar sua senha agora.");
    else {
      setNewPassword("");
      setPasswordMessage("Senha alterada com sucesso.");
    }
    setChangingPassword(false);
  }

  return (
    <>
      <section className="rounded-[28px] bg-[#0B1119] p-7 text-white md:p-8">
        <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#D5B579]">Minha conta</p>
        <h2 className="mt-3 font-serif text-3xl font-semibold">Seu perfil e sua jornada, do seu jeito.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/48">Atualize suas preferências, acesse conteúdos salvos e cuide da segurança da sua conta.</p>
      </section>

      {isAdmin && (
        <Link href="/admin" className="mt-5 flex items-center justify-between rounded-[24px] border border-[#B99A64] bg-[#E8D9BF] p-5 text-[#111820] transition hover:bg-[#E2CFB0]">
          <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#7A5A2C]">Administração</p><h3 className="mt-1 font-serif text-xl font-semibold">Abrir CMS do Coram Deo</h3><p className="mt-1 text-xs text-[#665E54]">Biblioteca, e-books, conteúdos, usuários, planos e notificações.</p></div><span className="text-xl">→</span>
        </Link>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
        <form onSubmit={saveProfile} className="rounded-[26px] border border-[#D5C8B5] bg-[#F7F1E7] p-6 md:p-7">
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#8B6A34]">Seus dados e preferências</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-[#5D554C] sm:col-span-2">Nome
              <input value={profile.display_name} onChange={(e)=>setProfile({...profile, display_name:e.target.value})} className="mt-2 w-full rounded-2xl border border-[#D5C8B5] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#B99A64]" placeholder="Seu nome" />
            </label>
            <label className="text-xs font-semibold text-[#5D554C] sm:col-span-2">E-mail
              <input value={email} readOnly className="mt-2 w-full rounded-2xl border border-[#D5C8B5] bg-[#EEE5D7] px-4 py-3 text-sm text-[#756C62]" />
            </label>
            <label className="text-xs font-semibold text-[#5D554C]">Tradução bíblica preferida
              <select value={profile.preferred_translation} onChange={(e)=>setProfile({...profile, preferred_translation:e.target.value})} className="mt-2 w-full rounded-2xl border border-[#D5C8B5] bg-white/70 px-4 py-3 text-sm outline-none">
                <option value="NVI">NVI</option><option value="NVT">NVT</option><option value="ARA">ARA</option><option value="ARC">ARC</option>
              </select>
            </label>
            <label className="text-xs font-semibold text-[#5D554C]">Tempo de estudo
              <select value={profile.study_minutes} onChange={(e)=>setProfile({...profile, study_minutes:Number(e.target.value)})} className="mt-2 w-full rounded-2xl border border-[#D5C8B5] bg-white/70 px-4 py-3 text-sm outline-none">
                {[5,10,15,20].map((m)=><option key={m} value={m}>{m} minutos</option>)}
              </select>
            </label>
            <label className="text-xs font-semibold text-[#5D554C] sm:col-span-2">Familiaridade bíblica
              <select value={profile.biblical_familiarity} onChange={(e)=>setProfile({...profile, biblical_familiarity:e.target.value})} className="mt-2 w-full rounded-2xl border border-[#D5C8B5] bg-white/70 px-4 py-3 text-sm outline-none">
                {familiarityOptions.map(([value,label])=><option key={value} value={value}>{label}</option>)}
              </select>
            </label>
          </div>
          {profileMessage && <p className="mt-4 text-xs font-semibold text-[#765B31]">{profileMessage}</p>}
          <button disabled={saving} className="mt-5 rounded-full bg-[#111820] px-6 py-3 text-sm font-bold text-[#F8F2E8] disabled:opacity-60">{saving?"Salvando...":"Salvar alterações"}</button>
        </form>

        <div className="space-y-5">
          <section className="rounded-[26px] border border-[#D5C8B5] bg-[#F7F1E7] p-6 md:p-7">
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#8B6A34]">Sua organização</p>
            <h3 className="mt-3 font-serif text-2xl font-semibold">Salvos e anotações</h3>
            <p className="mt-2 text-sm leading-6 text-[#665E54]">Acesse o que você marcou e escreveu sem ocupar a navegação principal.</p>
            <div className="mt-5 grid gap-2"><Link href="/favoritos" className="rounded-xl border border-[#D5C8B5] bg-white/55 px-4 py-3 text-sm font-semibold">Favoritos →</Link><Link href="/anotacoes" className="rounded-xl border border-[#D5C8B5] bg-white/55 px-4 py-3 text-sm font-semibold">Minhas anotações →</Link></div>
          </section>

          <form onSubmit={changePassword} className="rounded-[26px] border border-[#D5C8B5] bg-[#F7F1E7] p-6 md:p-7">
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#8B6A34]">Segurança</p>
            <h3 className="mt-3 font-serif text-2xl font-semibold">Alterar senha</h3>
            <p className="mt-2 text-sm leading-6 text-[#665E54]">Defina uma nova senha para sua conta.</p>
            <input type="password" minLength={6} value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} placeholder="Nova senha" className="mt-4 w-full rounded-2xl border border-[#D5C8B5] bg-white/70 px-4 py-3 text-sm outline-none" />
            {passwordMessage && <p className="mt-3 text-xs font-semibold text-[#765B31]">{passwordMessage}</p>}
            <button disabled={changingPassword} className="mt-4 rounded-full border border-[#B99A64] px-5 py-3 text-xs font-bold text-[#5E4727] disabled:opacity-60">{changingPassword?"Alterando...":"Alterar senha"}</button>
          </form>
        </div>
      </div>
    </>
  );
}
