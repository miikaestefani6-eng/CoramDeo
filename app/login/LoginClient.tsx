"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

function safeNext(value: string | null) { return value && value.startsWith("/") && !value.startsWith("//") ? value : "/"; }

function Brand() {
  return <div className="flex items-center gap-3 text-[#D5B579]"><svg aria-hidden="true" viewBox="0 0 64 72" className="h-12 w-11" fill="none"><path d="M10 61V24C10 12.4 19.4 3 31 3h2c11.6 0 21 9.4 21 21v37" stroke="currentColor" strokeWidth="2.4"/><path d="M16 60V25c0-8.8 7.2-16 16-16s16 7.2 16 16v35" stroke="currentColor" strokeWidth="1.5" opacity=".65"/><path d="M15 59c8-4.4 13.7-4.5 17-.2 3.3-4.3 9-4.2 17 .2v6c-8-4.3-13.7-4.4-17-.1-3.3-4.3-9-4.2-17 .1v-6Z" fill="currentColor"/><path d="M32 20l2.7 8.3L43 31l-8.3 2.7L32 42l-2.7-8.3L21 31l8.3-2.7L32 20Z" fill="currentColor"/></svg><span><span className="block font-serif text-2xl font-semibold tracking-[.16em] text-[#F8F2E8]">CORAM DEO</span><span className="mt-1 block text-[9px] font-semibold uppercase tracking-[.28em] text-[#C9AA72]">Estudo · vida · eternidade</span></span></div>;
}

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));
  const callbackError = searchParams.get("error");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(callbackError ? "Não foi possível concluir o acesso. Tente novamente." : "");

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setMessage("");
    const supabase = createClient();
    const result = mode === "login" ? await supabase.auth.signInWithPassword({ email, password }) : await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
    if (result.error) setMessage(result.error.message); else if (mode === "signup") setMessage("Cadastro realizado. Verifique seu e-mail para confirmar a conta."); else router.push(next);
    setLoading(false);
  }

  async function social(provider: "google" | "apple") {
    setLoading(true); setMessage("");
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
    if (error) { setMessage(error.message); setLoading(false); }
  }

  return <main className="min-h-screen bg-[#080D13] text-[#F8F2E8]"><div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[.95fr_1.05fr]">
    <section className="relative hidden overflow-hidden border-r border-white/8 p-12 lg:flex lg:flex-col lg:justify-between"><div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(213,181,121,.13),transparent_30%)]"/><div className="relative"><Link href="/site"><Brand /></Link></div><div className="relative max-w-xl"><p className="text-[11px] font-bold uppercase tracking-[.28em] text-[#D5B579]">Diante da Palavra. Diante de Deus.</p><h1 className="mt-5 font-serif text-5xl font-semibold leading-[1.02] tracking-[-.03em]">Entre para continuar sua jornada com profundidade.</h1><p className="mt-5 text-sm leading-7 text-white/48">Seus estudos, anotações, favoritos, devocionais e planos permanecem organizados para que a caminhada não recomece do zero.</p></div><p className="relative text-xs text-white/28">Tudo para a glória de Deus.</p></section>
    <section className="flex items-center justify-center px-5 py-10 sm:px-8"><div className="w-full max-w-md"><div className="mb-8 lg:hidden"><Link href="/site"><Brand /></Link></div><p className="text-[11px] font-bold uppercase tracking-[.25em] text-[#D5B579]">{mode === "login" ? "Bem-vindo de volta" : "Comece sua jornada"}</p><h2 className="mt-3 font-serif text-4xl font-semibold text-[#F8F2E8]">{mode === "login" ? "Entre no Coram Deo." : "Crie seu acesso."}</h2><p className="mt-3 text-sm leading-6 text-white/42">{mode === "login" ? "Continue de onde você parou." : "Sua jornada de estudo começa com um acesso simples e seguro."}</p>
      <div className="mt-7 grid grid-cols-2 rounded-full border border-white/8 bg-white/[.035] p-1 text-sm"><button type="button" onClick={()=>setMode("login")} className={`rounded-full py-2.5 font-semibold transition ${mode==="login"?"bg-[#D5B579] text-[#111820]":"text-white/48"}`}>Entrar</button><button type="button" onClick={()=>setMode("signup")} className={`rounded-full py-2.5 font-semibold transition ${mode==="signup"?"bg-[#D5B579] text-[#111820]":"text-white/48"}`}>Criar conta</button></div>
      <form onSubmit={submit} className="mt-6 space-y-4">{mode==="signup"&&<label className="block text-xs font-semibold text-white/60">Como você quer ser chamado?<input required value={name} onChange={e=>setName(e.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0D141C] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#D5B579]/60" placeholder="Seu nome"/></label>}<label className="block text-xs font-semibold text-white/60">E-mail<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0D141C] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#D5B579]/60" placeholder="voce@email.com"/></label><label className="block text-xs font-semibold text-white/60">Senha<input required minLength={6} type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0D141C] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#D5B579]/60" placeholder="••••••••"/></label>{message&&<p className="rounded-2xl border border-[#D5B579]/16 bg-[#D5B579]/6 p-3 text-xs leading-5 text-[#E8D7B8]">{message}</p>}<button disabled={loading} className="w-full rounded-full bg-[#D5B579] py-4 text-sm font-bold text-[#111820] transition hover:bg-[#E7C98F] disabled:opacity-60">{loading?"Aguarde...":mode==="login"?"Entrar no Coram Deo":"Começar minha jornada"}</button></form>
      <div className="my-5 flex items-center gap-3 text-[11px] text-white/25"><span className="h-px flex-1 bg-white/8"/>ou<span className="h-px flex-1 bg-white/8"/></div><div className="grid grid-cols-2 gap-3"><button disabled={loading} onClick={()=>social("google")} className="rounded-full border border-white/10 py-3 text-sm font-semibold text-white/70 transition hover:border-[#D5B579]/40 disabled:opacity-60">Google</button><button disabled={loading} onClick={()=>social("apple")} className="rounded-full border border-white/10 py-3 text-sm font-semibold text-white/70 transition hover:border-[#D5B579]/40 disabled:opacity-60">Apple</button></div><p className="mt-6 text-center text-[11px] text-white/28">Ao continuar, você concorda com nossos <Link href="/termos" className="text-[#C9AA72]">Termos</Link> e <Link href="/privacidade" className="text-[#C9AA72]">Privacidade</Link>.</p>
    </div></section>
  </div></main>;
}
