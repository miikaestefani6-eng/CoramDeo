import Link from "next/link";

export default async function AssinaturaStatusPage({ params }: { params: Promise<{ status: string[] }> }) {
  const { status } = await params;
  const canceled = status?.[0] === "cancelada";
  return (
    <main className="min-h-screen bg-[#F6F5F2] px-5 py-12 text-[#0F2131]">
      <section className="mx-auto max-w-2xl rounded-3xl bg-[#0F2131] p-8 text-white shadow-xl sm:p-10">
        <span className="text-3xl text-[#C4A47C]">{canceled ? "↩" : "✓"}</span>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#C4A47C]">Coram Deo</p>
        <h1 className="mt-2 font-serif text-3xl font-bold">{canceled ? "Checkout cancelado" : "Assinatura recebida"}</h1>
        <p className="mt-3 text-sm leading-7 text-white/60">{canceled ? "Tudo bem. Você pode voltar quando quiser e continuar sua jornada." : "Recebemos sua assinatura. A confirmação e a liberação dos recursos acontecem automaticamente."}</p>
        <Link href={canceled ? "/assinatura" : "/"} className="mt-7 inline-flex rounded-xl bg-[#8C183F] px-5 py-3 text-sm font-bold text-white">{canceled ? "Ver plano novamente" : "Voltar ao Coram Deo"}</Link>
      </section>
    </main>
  );
}
