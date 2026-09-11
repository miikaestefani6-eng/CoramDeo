import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080D13] px-6 text-[#F8F2E8]">
      <section className="w-full max-w-xl rounded-[32px] border border-[#D5B579]/20 bg-white/[.035] p-8 text-center shadow-[0_30px_90px_rgba(0,0,0,.25)] sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D5B579]/30 bg-[#D5B579]/10 text-2xl text-[#D5B579]">✦</div>
        <p className="mt-6 text-[10px] font-bold uppercase tracking-[.25em] text-[#D5B579]">Coram Deo</p>
        <h1 className="mt-3 font-serif text-3xl font-semibold">Você está sem conexão.</h1>
        <p className="mt-4 text-sm leading-7 text-white/55">Assim que a internet voltar, abra novamente o Coram Deo para continuar sua jornada de estudos.</p>
        <Link href="/" className="mt-7 inline-flex rounded-full bg-[#D5B579] px-6 py-3 text-sm font-bold text-[#111820]">Tentar novamente</Link>
      </section>
    </main>
  );
}
