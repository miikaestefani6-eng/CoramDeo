import Link from "next/link";

const nav = [
  ["Início", "/"],
  ["Zion · Estudar", "/estudar"],
  ["Devocional", "/devocional"],
  ["Biblioteca", "/biblioteca"],
  ["Favoritos", "/favoritos"],
  ["Anotações", "/anotacoes"],
  ["Planos de leitura", "/planos"],
  ["Notificações", "/notificacoes"],
  ["Minha conta", "/conta"],
] as const;

function Brand() {
  return (
    <div className="flex items-center gap-3 text-[#D5B579]">
      <svg aria-hidden="true" viewBox="0 0 64 72" className="h-11 w-10" fill="none">
        <path d="M10 61V24C10 12.4 19.4 3 31 3h2c11.6 0 21 9.4 21 21v37" stroke="currentColor" strokeWidth="2.4" />
        <path d="M16 60V25c0-8.8 7.2-16 16-16s16 7.2 16 16v35" stroke="currentColor" strokeWidth="1.5" opacity=".65" />
        <path d="M15 59c8-4.4 13.7-4.5 17-.2 3.3-4.3 9-4.2 17 .2v6c-8-4.3-13.7-4.4-17-.1-3.3-4.3-9-4.2-17 .1v-6Z" fill="currentColor" />
        <path d="M32 20l2.7 8.3L43 31l-8.3 2.7L32 42l-2.7-8.3L21 31l8.3-2.7L32 20Z" fill="currentColor" />
      </svg>
      <span>
        <span className="block font-serif text-xl font-semibold tracking-[.16em] text-[#F8F2E8]">CORAM DEO</span>
        <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[.28em] text-[#C9AA72]">Estudo · vida · eternidade</span>
      </span>
    </div>
  );
}

export function ModuleShell({ title, description, children }: { title: string; description: string; children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#EEE5D7] text-[#111820]">
      <aside className="fixed inset-y-0 left-0 hidden w-[276px] flex-col border-r border-white/8 bg-[#080D13] px-5 py-7 lg:flex">
        <Link href="/"><Brand /></Link>
        <nav className="mt-12 space-y-1" aria-label="Navegação principal">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/46 transition hover:bg-white/[.035] hover:text-[#F8F2E8]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D5B579]/65" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto rounded-[22px] border border-[#C9AA72]/16 bg-[#C9AA72]/[.045] p-4">
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#D5B579]">Coram Deo</p>
          <p className="mt-2 font-serif text-lg text-[#F8F2E8]">A Palavra no centro.</p>
          <p className="mt-2 text-xs leading-5 text-white/36">Cada recurso existe para servir à sua caminhada de estudo e formação cristã.</p>
        </div>
      </aside>

      <main className="lg:pl-[276px]">
        <header className="border-b border-[#D5C8B5] bg-[#F2EBDD] px-5 py-6 lg:px-10 lg:py-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-5 flex items-center justify-between lg:hidden">
              <Link href="/" className="font-serif text-lg font-semibold tracking-[.12em]">CORAM DEO</Link>
              <Link href="/" className="text-xs font-semibold text-[#7A5C2E]">Início</Link>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#8B6A34]">Sua jornada</p>
            <h1 className="mt-2 font-serif text-4xl font-semibold tracking-[-.025em] sm:text-5xl">{title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#665E54]">{description}</p>
          </div>
        </header>
        <section className="mx-auto max-w-6xl px-5 py-8 lg:px-10 lg:py-10">
          {children ?? <div className="rounded-[26px] border border-[#D5C8B5] bg-[#F7F1E7] p-8 text-sm leading-7 text-[#665E54]">Estrutura inicial do módulo pronta para receber dados e ações do V1.</div>}
        </section>
      </main>
    </div>
  );
}
