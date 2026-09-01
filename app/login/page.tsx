"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

function safeNext(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export default function LoginPage() {
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
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const supabase = createClient();
    const result = mode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });

    if (result.error) setMessage(result.error.message);
    else if (mode === "signup") setMessage("Cadastro realizado. Verifique seu e-mail para confirmar a conta.");
    else router.push(next);
    setLoading(false);
  }

  async function social(provider: "google" | "apple") {
    setLoading(true);
    setMessage("");
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
    if (error) {
      setMessage(error.message);
      setLoading(false);
    }
  }

  return <main className="flex min-h-screen items-center justify-center bg-[#0F2131] px-5 py-10"><section className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl sm:p-9"><div className="text-center"><div className="mx-auto mb-5 text-3xl text-[#C4A47C]">✦</div><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#C4A47C]">Coram Deo</p><h1 className="mt-2 font-serif text-2xl font-bold text-[#0F2131]">Diante da Palavra. Diante de Deus.</h1><p className="mt-2 text-sm text-[#5E6E82]">Aprendizagem cristã e discipulado.</p></div><div className="mt-7 grid grid-cols-2 rounded-lg bg-[#F8F9FA] p-1 text-sm"><button onClick={()=>setMode("login")} className={`rounded-md py-2 font-semibold ${mode==="login"?"bg-white text-[#8C183F] shadow-sm":"text-[#5E6E82]"}`}>Entrar</button><button onClick={()=>setMode("signup")} className={`rounded-md py-2 font-semibold ${mode==="signup"?"bg-white text-[#8C183F] shadow-sm":"text-[#5E6E82]"}`}>Criar conta</button></div><form onSubmit={submit} className="mt-6 space-y-4">{mode==="signup"&&<label className="block text-sm font-medium">Como você quer ser chamado?<input required value={name} onChange={e=>setName(e.target.value)} className="mt-2 w-full rounded-xl border border-[#E1E7EA] px-4 py-3 outline-none focus:border-[#C4A47C]" placeholder="Seu nome"/></label>}<label className="block text-sm font-medium">E-mail<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-[#E1E7EA] px-4 py-3 outline-none focus:border-[#C4A47C]" placeholder="voce@email.com"/></label><label className="block text-sm font-medium">Senha<input required minLength={6} type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-[#E1E7EA] px-4 py-3 outline-none focus:border-[#C4A47C]" placeholder="••••••••"/></label>{message&&<p className="rounded-lg bg-[#F8F9FA] p-3 text-xs text-[#5E6E82]">{message}</p>}<button disabled={loading} className="w-full rounded-xl bg-[#8C183F] py-3.5 text-sm font-semibold text-white disabled:opacity-60">{loading?"Aguarde...":mode==="login"?"Entrar no Coram Deo":"Começar minha jornada"}</button></form><div className="my-5 flex items-center gap-3 text-xs text-[#5E6E82]"><span className="h-px flex-1 bg-[#E1E7EA]"/>ou<span className="h-px flex-1 bg-[#E1E7EA]"/></div><div className="grid grid-cols-2 gap-3"><button disabled={loading} onClick={()=>social("google")} className="rounded-xl border border-[#E1E7EA] py-3 text-sm font-semibold disabled:opacity-60">Google</button><button disabled={loading} onClick={()=>social("apple")} className="rounded-xl border border-[#E1E7EA] py-3 text-sm font-semibold disabled:opacity-60">Apple</button></div></section></main>;
}
