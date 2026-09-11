import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const quickAccess = [
  { title: "Estudar", description: "Pesquise com o Zion em 16 camadas.", icon: "⌕", href: "/estudar" },
  { title: "Devocional", description: "Reflita, medite e pratique.", icon: "✦", href: "/devocional" },
  { title: "Biblioteca", description: "Explore conteúdos e materiais.", icon: "▤", href: "/biblioteca" },
  { title: "Planos", description: "Mantenha constância na leitura.", icon: "◫", href: "/planos" },
];

function Brand() {
  return <div className="flex items-center gap-3 text-[#D5B579]"><svg aria-hidden="true" viewBox="0 0 64 72" className="h-11 w-10" fill="none"><path d="M10 61V24C10 12.4 19.4 3 31 3h2c11.6 0 21 9.4 21 21v37" stroke="currentColor" strokeWidth="2.4"/><path d="M16 60V25c0-8.8 7.2-16 16-16s16 7.2 16 16v35" stroke="currentColor" strokeWidth="1.5" opacity=".65"/><path d="M15 59c8-4.4 13.7-4.5 17-.2 3.3-4.3 9-4.2 17 .2v6c-8-4.3-13.7-4.4-17-.1-3.3-4.3-9-4.2-17 .1v-6Z" fill="currentColor"/><path d="M32 20l2.7 8.3L43 31l-8.3 2.7L32 42l-2.7-8.3L21 31l8.3-2.7L32 20Z" fill="currentColor"/></svg><span><span className="block font-serif text-xl font-semibold tracking-[.16em] text-[#F8F2E8]">CORAM DEO</span><span className="mt-1 block text-[9px] font-semibold uppercase tracking-[.28em] text-[#C9AA72]">Estudo · vida · eternidade</span></span></div>;
}

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let latestStudy: { id: string; reference: string; title: string | null; created_at: string } | null = null;
  let isAdmin = false;
  if (user) {
    const [{ data: study }, { data: admin }] = await Promise.all([
      supabase.from("studies").select("id, reference, title, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("coram_admins").select("role").eq("user_id", user.id).eq("active", true).maybeSingle(),
    ]);
    latestStudy = study;
    isAdmin = Boolean(admin);
  }
  const resumeReference = latestStudy?.reference || "João 1:1";
  const resumeTitle = latestStudy?.title || "João 1:1";
  const resumeHref = `/estudar?query=${encodeURIComponent(resumeReference)}`;
  const nav = [["Início","/"],["Zion · Estudar","/estudar"],["Devocional","/devocional"],["Biblioteca","/biblioteca"],["Planos de leitura","/planos"],["Minha conta","/conta"]];

  return <div className="min-h-screen bg-[#EEE5D7] text-[#111820]">
    <aside className="fixed inset-y-0 left-0 hidden w-[276px] flex-col border-r border-white/8 bg-[#080D13] px-5 py-7 lg:flex"><Brand /><nav className="mt-12 space-y-1">{nav.map(([label,href],i)=><Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${i===0?'bg-[#D5B579]/10 text-[#E7C98F]':'text-white/46 hover:bg-white/[.035] hover:text-white'}`}><span className="h-1.5 w-1.5 rounded-full bg-[#D5B579]/70"/>{label}</Link>)}</nav>{isAdmin&&<Link href="/admin" className="mt-5 rounded-xl border border-[#D5B579]/30 bg-[#D5B579]/10 px-4 py-3 text-sm font-semibold text-[#E7C98F]">Abrir CMS administrativo →</Link>}<div className="mt-auto rounded-[22px] border border-[#C9AA72]/16 bg-[#C9AA72]/[.045] p-4"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#D5B579]">Sua jornada</p><p className="mt-2 font-serif text-lg text-[#F8F2E8]">Continue com constância.</p><p className="mt-2 text-xs leading-5 text-white/38">Estudos, favoritos e anotações permanecem organizados dentro da sua conta.</p></div></aside>

    <main className="lg:pl-[276px]"><header className="flex items-center justify-between border-b border-[#D7C9B5] px-5 py-5 lg:px-10"><div className="lg:hidden"><span className="font-serif text-lg font-semibold tracking-[.12em]">CORAM DEO</span></div><div className="hidden lg:block"><p className="text-xs uppercase tracking-[.18em] text-[#8B6A34]">Uma vida diante de Deus</p><p className="mt-1 font-serif text-xl font-semibold">Que bom ter você aqui.</p></div><div className="flex items-center gap-2">{isAdmin&&<Link href="/admin" className="rounded-full border border-[#B99A64] bg-[#F7F1E7] px-4 py-2 text-xs font-semibold text-[#6F5229]">CMS</Link>}<Link href="/notificacoes" aria-label="Notificações" title="Notificações" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#CABBA5] bg-[#F7F1E7] text-base">♢</Link></div></header>

      <section className="px-5 pt-7 lg:px-10 lg:pt-10"><div className="relative overflow-hidden rounded-[34px] bg-[#0B1119] px-6 py-12 text-white shadow-[0_30px_90px_rgba(21,18,14,.18)] sm:px-10 lg:px-14 lg:py-14"><div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(213,181,121,.14),transparent_28%)]"/><div className="relative max-w-3xl"><p className="text-[11px] font-bold uppercase tracking-[.28em] text-[#D5B579]">Pesquisa com Zion</p><h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.02] tracking-[-.025em] sm:text-5xl">O que você deseja compreender hoje?</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-white/48">Pesquise uma passagem, personagem ou tema e aprofunde a investigação em 16 camadas conectadas.</p><form action="/estudar" method="get" className="mt-7 flex max-w-2xl flex-col gap-2 rounded-[22px] border border-white/10 bg-white/[.055] p-2 sm:flex-row"><input name="query" className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/28" placeholder="Ex.: Romanos 8:28, aliança, Pedro..."/><button type="submit" className="rounded-full bg-[#D5B579] px-6 py-3 text-sm font-bold text-[#111820]">Pesquisar com Zion →</button></form></div></div></section>

      <section className="px-5 py-7 lg:px-10"><div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-4">{quickAccess.map((item,i)=><Link key={item.title} href={item.href} className="group rounded-[24px] border border-[#D7C9B5] bg-[#F7F1E7] p-5 transition hover:-translate-y-1 hover:border-[#B99A64]"><span className="text-lg text-[#8B6A34]">{item.icon}</span><p className="mt-4 font-serif text-xl font-semibold">{item.title}</p><p className="mt-2 text-xs leading-5 text-[#696157]">{item.description}</p><span className="mt-4 inline-block text-[10px] font-bold uppercase tracking-[.16em] text-[#8B6A34]">0{i+1}</span></Link>)}</div></section>

      <section className="px-5 pb-10 lg:px-10"><div className="flex items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#8B6A34]">Sua jornada</p><h2 className="mt-2 font-serif text-3xl font-semibold">{latestStudy ? "Continue de onde parou" : "Comece seu primeiro estudo"}</h2></div><Link href="/biblioteca" className="text-xs font-bold text-[#795C31]">Ver biblioteca →</Link></div><article className="mt-5 grid overflow-hidden rounded-[30px] border border-[#D7C9B5] bg-[#F7F1E7] md:grid-cols-[1.15fr_.85fr]"><div className="bg-[#111820] p-8 text-white md:p-10"><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#D5B579]">{latestStudy ? "Último estudo salvo" : "Estudo bíblico"}</p><h3 className="mt-4 font-serif text-3xl font-semibold">{resumeTitle}</h3><p className="mt-4 max-w-xl text-sm leading-7 text-white/50">{latestStudy ? `Retome sua investigação em ${resumeReference}.` : "Abra uma pesquisa com o Zion e transforme uma pergunta em uma jornada de compreensão."}</p><Link href={resumeHref} className="mt-7 inline-flex rounded-full bg-[#D5B579] px-6 py-3 text-sm font-bold text-[#111820]">{latestStudy ? "Continuar estudo →" : "Começar estudo →"}</Link></div><div className="flex items-center justify-center p-8"><div className="text-center"><div className="mx-auto flex h-28 w-24 items-end justify-center rounded-t-full border border-[#B99A64] pb-4 text-3xl text-[#8B6A34]">✦</div><p className="mt-4 max-w-[180px] text-xs leading-5 text-[#70675D]">A Palavra no centro. Tecnologia a serviço da compreensão.</p></div></div></article></section>
    </main>
  </div>;
}
