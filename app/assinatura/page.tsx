import Link from "next/link";

const benefits = [
  "Zion com pesquisa bíblica estruturada em 16 camadas",
  "Contexto histórico, literário, teológico e cultural",
  "Hebraico e grego apresentados com clareza",
  "Fontes, evidências e distinção entre interpretação e hipótese",
  "Devocionais, biblioteca, anotações e favoritos",
  "Planos de leitura para uma jornada consistente",
];

export default function AssinaturaPage() {
  const checkoutUrl = process.env.NEXT_PUBLIC_KIWIFY_CHECKOUT_URL;

  return (
    <main className="min-h-screen bg-[#07111C] text-[#F3EBDD]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between border-b border-[#D0AA6A]/20 py-6">
          <Link href="/site" className="group flex items-center gap-3" aria-label="Voltar ao Coram Deo">
            <span className="flex h-10 w-9 items-end justify-center rounded-t-full border border-[#D0AA6A]/70 px-1.5 pb-1.5 text-[#D0AA6A] transition group-hover:border-[#E1C28B]">
              <span className="mb-0.5 h-4 w-px bg-current" />
              <span className="h-2 w-4 border-b border-current" />
            </span>
            <span>
              <span className="block font-serif text-xl tracking-[0.16em] text-[#F7F0E4]">CORAM DEO</span>
              <span className="block text-[9px] uppercase tracking-[0.3em] text-[#D0AA6A]">Diante de Deus</span>
            </span>
          </Link>
          <Link href="/login" className="text-sm font-medium text-[#D9D2C7] transition hover:text-white">
            Já sou assinante
          </Link>
        </header>

        <section className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1.08fr_.92fr] lg:py-16">
          <div className="max-w-2xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#D0AA6A]">Sua jornada começa aqui</p>
            <h1 className="font-serif text-4xl leading-[1.08] text-[#F7F0E4] sm:text-5xl lg:text-6xl">
              Vá mais fundo na Palavra. <span className="text-[#D0AA6A]">Permaneça diante de Deus.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#B9B7B1] sm:text-lg">
              Você já conheceu o Coram Deo. Agora é hora de abrir a experiência completa: pesquisa bíblica profunda com o Zion e ferramentas para transformar estudo em constância.
            </p>

            <div className="mt-9 rounded-2xl border border-[#D0AA6A]/20 bg-[#0B1825] p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D0AA6A]/35 bg-[#D0AA6A]/10 font-serif text-lg text-[#D0AA6A]">Z</div>
                <div>
                  <p className="font-serif text-xl text-[#F7F0E4]">Zion, seu companheiro de pesquisa bíblica</p>
                  <p className="mt-2 text-sm leading-6 text-[#AFAEA9]">Uma pesquisa organizada em 16 camadas — do contexto do texto às línguas bíblicas, teologia, arqueologia, aplicação e fontes.</p>
                </div>
              </div>
            </div>

            <p className="mt-8 max-w-lg border-l border-[#D0AA6A]/60 pl-5 font-serif text-lg italic leading-7 text-[#DDD3C4]">
              “Examinai tudo. Retende o bem.” <span className="not-italic text-[#9D9B96]">— 1 Tessalonicenses 5:21</span>
            </p>
          </div>

          <aside className="relative overflow-hidden rounded-[28px] border border-[#D0AA6A]/35 bg-[#F1E9DB] p-6 text-[#111B24] shadow-2xl sm:p-8">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#D0AA6A]/10 blur-3xl" />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8D6D39]">Acesso completo</p>
              <h2 className="mt-3 font-serif text-3xl text-[#0A1722]">Coram Deo</h2>
              <div className="mt-5 flex items-end gap-2 border-b border-[#B9A98D]/40 pb-6">
                <span className="font-serif text-5xl text-[#0A1722]">R$ 24,99</span>
                <span className="pb-1.5 text-sm text-[#6E6B65]">/ mês</span>
              </div>

              <ul className="mt-6 space-y-3.5">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3 text-sm leading-5 text-[#454A4D]">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0A1722] text-[11px] text-[#E5C68D]">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              {checkoutUrl ? (
                <a href={checkoutUrl} className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-[#0A1722] px-5 py-4 text-sm font-bold text-[#F7F0E4] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#12293B]">
                  Assinar agora
                </a>
              ) : (
                <div className="mt-8 rounded-xl bg-[#E6DED1] p-4 text-center text-sm text-[#69655F]">O checkout ainda não foi configurado neste ambiente.</div>
              )}

              <p className="mt-4 text-center text-xs leading-5 text-[#77736C]">Pagamento processado com segurança pela Kiwify. Cancele quando quiser.</p>
              <div className="mt-6 flex items-center justify-center gap-5 border-t border-[#B9A98D]/35 pt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#77736C]">
                <span>Acesso imediato</span><span>•</span><span>Plano único</span>
              </div>
            </div>
          </aside>
        </section>

        <footer className="flex flex-col gap-3 border-t border-[#D0AA6A]/15 py-6 text-xs text-[#777E83] sm:flex-row sm:items-center sm:justify-between">
          <p>Tudo para a glória de Deus.</p>
          <div className="flex gap-5"><Link href="/termos" className="hover:text-[#D0AA6A]">Termos</Link><Link href="/privacidade" className="hover:text-[#D0AA6A]">Privacidade</Link></div>
        </footer>
      </div>
    </main>
  );
}
