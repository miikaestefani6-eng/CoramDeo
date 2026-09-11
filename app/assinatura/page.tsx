import Link from "next/link";

const benefits = [
  "Zion com pesquisa bíblica estruturada em 16 camadas",
  "Contexto histórico, literário, teológico e cultural",
  "Hebraico e grego apresentados com clareza",
  "Fontes, evidências e distinção entre interpretação e hipótese",
  "Devocionais, biblioteca, anotações e favoritos",
  "Planos de leitura para uma jornada consistente",
];

function Brand() {
  return (
    <div className="flex items-center gap-3 text-[#D5B579]">
      <svg aria-hidden="true" viewBox="0 0 64 72" className="h-11 w-10" fill="none">
        <path d="M10 61V24C10 12.4 19.4 3 31 3h2c11.6 0 21 9.4 21 21v37" stroke="currentColor" strokeWidth="2.4"/>
        <path d="M16 60V25c0-8.8 7.2-16 16-16s16 7.2 16 16v35" stroke="currentColor" strokeWidth="1.5" opacity=".65"/>
        <path d="M15 59c8-4.4 13.7-4.5 17-.2 3.3-4.3 9-4.2 17 .2v6c-8-4.3-13.7-4.4-17-.1-3.3-4.3-9-4.2-17 .1v-6Z" fill="currentColor"/>
        <path d="M32 20l2.7 8.3L43 31l-8.3 2.7L32 42l-2.7-8.3L21 31l8.3-2.7L32 20Z" fill="currentColor"/>
      </svg>
      <span><span className="block font-serif text-xl font-semibold tracking-[0.16em] text-[#F8F2E8]">CORAM DEO</span><span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.28em] text-[#C9AA72]">Estudo · vida · eternidade</span></span>
    </div>
  );
}

export default function AssinaturaPage() {
  const checkoutUrl = process.env.NEXT_PUBLIC_KIWIFY_CHECKOUT_URL;
  return (
    <main className="min-h-screen bg-[#080D13] text-[#F8F2E8]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 md:px-8">
        <header className="flex items-center justify-between border-b border-white/8 py-5">
          <Link href="/site" aria-label="Voltar ao Coram Deo"><Brand /></Link>
          <Link href="/login" className="text-xs font-semibold text-white/60 transition hover:text-[#E7C98F]">Já sou assinante</Link>
        </header>
        <section className="grid flex-1 items-center gap-12 py-14 lg:grid-cols-[.95fr_1.05fr] lg:py-20">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.28em] text-[#D5B579]">Sua jornada começa aqui</p>
            <h1 className="mt-5 max-w-2xl font-serif text-5xl font-semibold leading-[1.02] tracking-[-.03em] sm:text-6xl">Continue mais fundo na Palavra. <span className="text-[#D5B579]">Agora por dentro do Coram Deo.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/55">Você já conheceu a proposta. Agora ative o acesso completo ao Zion e às ferramentas que acompanham sua rotina de estudo, reflexão e continuidade.</p>
            <div className="mt-8 rounded-[26px] border border-[#C9AA72]/18 bg-[#0D141C] p-6">
              <div className="flex items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#C9AA72]/30 bg-[#C9AA72]/8 font-serif text-lg text-[#D5B579]">Z</span><div><h2 className="font-serif text-2xl text-[#F8F2E8]">Zion, seu companheiro de pesquisa bíblica</h2><p className="mt-2 text-sm leading-7 text-white/48">Uma investigação organizada em 16 camadas — contexto, línguas bíblicas, teologia, arqueologia, aplicação, fontes e evidências.</p></div></div>
            </div>
            <p className="mt-7 border-l border-[#C9AA72]/60 pl-5 font-serif text-lg italic text-[#EADFCB]">“Examinai tudo. Retende o que é bom.” <span className="text-sm not-italic text-white/35">1 Tessalonicenses 5:21</span></p>
          </div>
          <aside className="relative overflow-hidden rounded-[34px] border border-[#C9AA72]/25 bg-[#F2EBDD] p-7 text-[#111820] shadow-[0_35px_110px_rgba(0,0,0,.35)] sm:p-9">
            <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#D5B579]/15 blur-3xl" />
            <div className="relative"><p className="text-[11px] font-bold uppercase tracking-[.24em] text-[#8B6A34]">Plano Coram Deo</p><div className="mt-4 flex items-end gap-2 border-b border-[#D3C5AF] pb-6"><strong className="font-serif text-5xl font-semibold">R$ 24,99</strong><span className="pb-1 text-sm text-[#6F685F]">/mês</span></div>
              <ul className="mt-6 space-y-3.5">{benefits.map((item)=><li key={item} className="flex gap-3 text-sm leading-6 text-[#514B43]"><span className="mt-1 text-[#8B6A34]">✓</span><span>{item}</span></li>)}</ul>
              {checkoutUrl ? <a href={checkoutUrl} className="mt-8 inline-flex w-full justify-center rounded-full bg-[#111820] px-6 py-4 text-sm font-bold text-[#F8F2E8] transition hover:bg-[#1B2732]">Assinar agora →</a> : <div className="mt-8 rounded-2xl bg-[#E6DDCF] p-4 text-center text-sm text-[#686158]">O checkout ainda não foi configurado neste ambiente.</div>}
              <p className="mt-4 text-center text-[11px] leading-5 text-[#777067]">Pagamento processado pela Kiwify. Acesso imediato após confirmação.</p>
            </div>
          </aside>
        </section>
        <footer className="flex flex-col gap-3 border-t border-white/8 py-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between"><p>Tudo para a glória de Deus.</p><div className="flex gap-5"><Link href="/termos">Termos</Link><Link href="/privacidade">Privacidade</Link></div></footer>
      </div>
    </main>
  );
}
