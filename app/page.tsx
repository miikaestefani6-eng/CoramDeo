import Link from "next/link";
import { CoramLogo } from "./components/CoramLogo";

const primaryNav = [
  { label: "Hoje", href: "/", icon: "⌂" },
  { label: "Estudar", href: "/estudar", icon: "◉" },
  { label: "Devocional", href: "/devocional", icon: "✦" },
  { label: "Biblioteca", href: "/biblioteca", icon: "▤" },
];

const journeyNav = [
  { label: "Meu progresso", href: "/progresso", icon: "◌" },
  { label: "Favoritos", href: "/favoritos", icon: "☆" },
  { label: "Anotações", href: "/anotacoes", icon: "□" },
];

const ministryNav = [
  { label: "Ministério", href: "/ministerio", icon: "◈" },
];

const explore = [
  { title: "Estudar", description: "Compreenda o texto em profundidade.", icon: "◉", href: "/estudar", tone: "#315494" },
  { title: "Devocional", description: "Pare, medite e responda à Palavra.", icon: "✦", href: "/devocional", tone: "#8C183F" },
  { title: "Biblioteca", description: "Encontre estudos para continuar aprendendo.", icon: "▤", href: "/biblioteca", tone: "#BF9B3E" },
  { title: "Ministério", description: "Transforme estudo em ensino responsável.", icon: "◈", href: "/ministerio", tone: "#1A707E" },
];

function NavGroup({ title, items }: { title: string; items: typeof primaryNav }) {
  return (
    <div>
      <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">{title}</p>
      <div className="space-y-1">
        {items.map((item) => (
          <Link key={item.label} href={item.href} className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${item.href === "/" ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/6 hover:text-white"}`}>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-[#C4A47C] transition group-hover:bg-[#C4A47C]/10">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F6F5F2] text-[#0F2131]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[276px] flex-col border-r border-white/10 bg-[#0F2131] px-5 py-7 lg:flex">
        <CoramLogo />

        <nav className="mt-12 space-y-7" aria-label="Navegação principal">
          <NavGroup title="Principal" items={primaryNav} />
          <NavGroup title="Jornada" items={journeyNav} />
          <NavGroup title="Serviço" items={ministryNav} />
        </nav>

        <div className="mt-auto">
          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-white">Plano de leitura</p>
              <span className="text-[10px] text-[#C4A47C]">29%</span>
            </div>
            <p className="mt-1 text-xs text-white/45">Evangelho de João</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[29%] rounded-full bg-[#C4A47C]" />
            </div>
            <p className="mt-2 text-[11px] text-white/35">6 de 21 capítulos</p>
          </div>

          <Link href="/perfil" className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C4A47C]/15 text-sm text-[#C4A47C]">M</div>
            <div>
              <p className="text-sm font-semibold text-white">Minha conta</p>
              <p className="text-[11px] text-white/35">Ver perfil</p>
            </div>
          </Link>
        </div>
      </aside>

      <main className="pb-24 lg:pl-[276px] lg:pb-0">
        <header className="flex items-center justify-between px-5 py-5 sm:px-8 lg:px-12 lg:py-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8C183F]">Coram Deo</p>
            <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight sm:text-3xl">Seu lugar diante da Palavra.</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/notificacoes" className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#DDE2E3] bg-white text-[#0F2131] shadow-sm" aria-label="Notificações">
              <span className="text-lg">♢</span>
              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-[#8C183F]" />
            </Link>
            <Link href="/perfil" className="hidden h-11 items-center gap-2 rounded-xl border border-[#DDE2E3] bg-white px-3 text-sm font-semibold shadow-sm sm:flex">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F2131] text-xs text-[#C4A47C]">M</span>
              Minha conta
            </Link>
          </div>
        </header>

        <div className="space-y-10 px-5 sm:px-8 lg:px-12 lg:pb-12">
          <section className="relative overflow-hidden rounded-[28px] bg-[#0F2131] px-6 py-10 shadow-[0_18px_50px_rgba(15,33,49,0.14)] sm:px-10 sm:py-12 lg:px-14 lg:py-14">
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-[#C4A47C]/10" />
            <div className="pointer-events-none absolute -right-8 -top-12 h-48 w-48 rounded-full border border-[#C4A47C]/10" />
            <div className="relative max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C4A47C]">Hoje</p>
              <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">O que você deseja compreender hoje?</h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">Pesquise uma passagem, personagem ou tema e deixe o Coram Deo conduzir você da curiosidade à compreensão.</p>

              <form action="/estudar" method="get" className="mt-8 flex max-w-2xl flex-col gap-2 rounded-2xl bg-white p-2 shadow-xl sm:flex-row">
                <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
                  <span className="text-xl text-[#8C183F]">⌕</span>
                  <input name="query" className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#0F2131] outline-none placeholder:text-[#788593]" placeholder="Ex.: Romanos 8:28, Ester, fé..." aria-label="Pesquisar na Bíblia" />
                </div>
                <button className="rounded-xl bg-[#8C183F] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#731333]" type="submit">Começar estudo</button>
              </form>
            </div>
          </section>

          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C4A47C]">Sua jornada</p>
                <h2 className="mt-1 font-serif text-2xl font-bold">Continue de onde parou</h2>
              </div>
              <Link href="/progresso" className="text-xs font-bold text-[#8C183F] sm:text-sm">Ver progresso →</Link>
            </div>

            <Link href="/estudar" className="group mt-5 grid overflow-hidden rounded-2xl border border-[#E1E3E2] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:grid-cols-[1fr_230px]">
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#315494]"><span className="h-1.5 w-1.5 rounded-full bg-[#315494]" /> Estudo em andamento</div>
                <h3 className="mt-3 font-serif text-2xl font-bold">Romanos 8</h3>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[#5E6E82]">Continue explorando o capítulo e compreenda como o contexto ilumina a promessa de Romanos 8:28.</p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="h-2 flex-1 max-w-sm overflow-hidden rounded-full bg-[#E9ECEC]"><div className="h-full w-[72%] rounded-full bg-[#315494]" /></div>
                  <span className="text-xs font-bold text-[#315494]">72%</span>
                </div>
              </div>
              <div className="flex items-center justify-center bg-[#F1F3F3] p-6 md:min-h-full">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0F2131] font-serif text-2xl text-[#C4A47C]">Rm</div>
                  <p className="mt-3 text-xs font-semibold text-[#5E6E82]">16 camadas de compreensão</p>
                </div>
              </div>
            </Link>
          </section>

          <section>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C4A47C]">Para hoje</p>
              <h2 className="mt-1 font-serif text-2xl font-bold">Um momento com a Palavra</h2>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1.35fr_1fr]">
              <Link href="/devocional" className="group relative overflow-hidden rounded-2xl bg-[#8C183F] p-7 text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-8">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F1C9D7]">Devocional de hoje</span>
                <h3 className="mt-4 max-w-lg font-serif text-2xl font-bold sm:text-3xl">Permaneça em mim.</h3>
                <p className="mt-3 max-w-lg text-sm leading-6 text-white/70">Um espaço para compreender, meditar, olhar para dentro, orar e praticar.</p>
                <span className="mt-7 inline-flex rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#8C183F]">Abrir devocional →</span>
                <span className="pointer-events-none absolute -bottom-14 -right-8 font-serif text-[150px] leading-none text-white/5">✦</span>
              </Link>

              <div className="rounded-2xl border border-[#E1E3E2] bg-white p-7 shadow-sm sm:p-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C4A47C]">Prática</p>
                <h3 className="mt-3 font-serif text-xl font-bold">Seu próximo passo</h3>
                <p className="mt-3 text-sm leading-6 text-[#5E6E82]">Reserve alguns minutos hoje para voltar ao texto que está estudando e registrar uma coisa que você aprendeu.</p>
                <Link href="/anotacoes" className="mt-6 inline-flex text-xs font-bold text-[#8C183F]">Abrir minhas anotações →</Link>
              </div>
            </div>
          </section>

          <section className="pb-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C4A47C]">Explore</p>
              <h2 className="mt-1 font-serif text-2xl font-bold">Tudo o que você pode fazer aqui</h2>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
              {explore.map((item) => (
                <Link key={item.title} href={item.href} className="group rounded-2xl border border-[#E1E3E2] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4F5F4] text-lg" style={{ color: item.tone }}>{item.icon}</span>
                  <h3 className="mt-4 font-serif font-bold">{item.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-[#5E6E82]">{item.description}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Link href="/sião" className="fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full bg-[#8C183F] px-4 py-3 text-xs font-bold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-[#731333] lg:bottom-8 lg:right-8">
        <span className="text-[#C4A47C]">✦</span> Perguntar ao Sião
      </Link>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[#DDE2E3] bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur lg:hidden" aria-label="Navegação mobile">
        <div className="mx-auto flex max-w-md items-center justify-around">
          {primaryNav.map((item) => (
            <Link key={item.label} href={item.href} className={`flex min-w-16 flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-semibold ${item.href === "/" ? "text-[#8C183F]" : "text-[#5E6E82]"}`}>
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <Link href="/sião" className="flex min-w-16 flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-semibold text-[#8C183F]"><span className="text-base">✦</span>Sião</Link>
        </div>
      </nav>
    </div>
  );
}
