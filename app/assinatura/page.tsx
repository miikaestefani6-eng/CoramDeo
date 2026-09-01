"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AssinaturaPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkout() {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { data, error: invokeError } = await supabase.functions.invoke("coram-v1-stripe-billing", {
      body: { action: "create_checkout", plan_code: "coram_essencial" },
    });

    if (invokeError) {
      setError("Não foi possível iniciar o checkout. Entre na sua conta e tente novamente.");
      setLoading(false);
      return;
    }

    if (!data?.checkout_url) {
      setError(data?.error || "O checkout não está disponível neste momento.");
      setLoading(false);
      return;
    }

    window.location.assign(data.checkout_url);
  }

  return (
    <main className="min-h-screen bg-[#F6F5F2] px-5 py-8 text-[#0F2131] sm:py-12">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="font-serif text-xl font-bold">Coram Deo</Link>
        <section className="mt-8 overflow-hidden rounded-[30px] bg-[#0F2131] p-7 text-white shadow-[0_18px_50px_rgba(15,33,49,0.14)] sm:p-10 lg:grid lg:grid-cols-[1.1fr_.9fr] lg:gap-10 lg:p-14">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C4A47C]">Coram Deo Essencial</p>
            <h1 className="mt-4 font-serif text-3xl font-bold leading-tight sm:text-5xl">Uma jornada mais profunda diante da Palavra.</h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base">Tenha acesso à experiência Essencial do Coram Deo para estudar, compreender e continuar sua jornada de aprendizagem cristã.</p>
            <div className="mt-8 space-y-3 text-sm text-white/75"><p>✓ Biblioteca Essencial</p><p>✓ Acesso ao aplicativo</p><p>✓ Até 30 pesquisas por dia</p><p>✓ Estudos em camadas de compreensão</p></div>
          </div>
          <div className="mt-8 rounded-3xl bg-white p-6 text-[#0F2131] shadow-xl lg:mt-0 lg:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8C183F]">Oferta de lançamento</p>
            <div className="mt-4 flex items-end gap-2"><span className="font-serif text-5xl font-bold">R$ 19,90</span><span className="pb-2 text-sm text-[#5E6E82]">no 1º mês</span></div>
            <p className="mt-2 text-sm text-[#5E6E82]">Depois, R$ 24,99/mês.</p>
            <p className="mt-5 rounded-xl bg-[#F6F5F2] p-3 text-xs leading-5 text-[#5E6E82]">Pagamento seguro processado pelo Stripe. A assinatura é mensal e pode ser gerenciada posteriormente pelo portal da conta.</p>
            {error && <p className="mt-4 rounded-xl bg-[#8C183F]/10 p-3 text-xs leading-5 text-[#8C183F]">{error}</p>}
            <button onClick={checkout} disabled={loading} className="mt-6 w-full rounded-xl bg-[#8C183F] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#731333] disabled:cursor-wait disabled:opacity-60">{loading ? "Preparando checkout…" : "Assinar Coram Deo Essencial"}</button>
            <Link href="/" className="mt-4 block text-center text-xs font-semibold text-[#5E6E82]">Voltar para a jornada</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
