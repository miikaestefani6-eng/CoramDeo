import Link from "next/link";
import { ReactNode } from "react";

const nav = [
  ["Hoje", "/"], ["Estudar", "/estudar"], ["Devocional", "/devocional"],
  ["Biblioteca", "/biblioteca"], ["Progresso", "/progresso"], ["Sião", "/siao"], ["Perfil", "/perfil"],
] as const;

export function ModuleShell({ title, description, children }: { title: string; description: string; children?: ReactNode }) {
  return <div className="min-h-screen bg-[#F7F4EF] text-[#17283A]">
    <aside className="fixed inset-y-0 left-0 hidden w-[250px] border-r border-white/10 bg-[#17283A] px-5 py-7 lg:block">
      <Link href="/" className="font-serif text-2xl font-bold text-white">Coram Deo</Link>
      <p className="mt-1 text-[10px] text-white/45">Aprender · compreender · viver</p>
      <nav className="mt-10 space-y-1">{nav.map(([label,href])=><Link key={href} href={href} className="block rounded-xl px-4 py-3 text-sm text-white/65 transition hover:bg-white/10 hover:text-white">{label}</Link>)}</nav>
      <div className="absolute bottom-7 left-5 right-5 rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs text-white/50">Sua jornada</p><p className="mt-1 text-sm font-semibold text-white">Crescer em profundidade</p></div>
    </aside>
    <main className="lg:pl-[250px]">
      <header className="border-b border-[#E1DBD2] bg-[#F7F4EF] px-5 py-7 lg:px-10"><div className="mx-auto max-w-6xl"><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#8C183F]">Coram Deo</p><h1 className="mt-1 font-serif text-4xl font-bold tracking-tight">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#5E6E82]">{description}</p></div></header>
      <section className="mx-auto max-w-6xl px-5 py-8 pb-24 lg:px-10 lg:pb-10">{children ?? <div className="rounded-3xl border border-[#E1DBD2] bg-white p-8 text-sm text-[#5E6E82]">Estrutura do módulo pronta para receber dados e ações do V1.</div>}</section>
    </main>
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#E1DBD2] bg-white/95 px-2 py-2 backdrop-blur lg:hidden"><div className="mx-auto flex max-w-xl justify-around">{nav.slice(0,5).map(([label,href])=><Link key={href} href={href} className="px-2 py-2 text-[10px] font-semibold text-[#5E6E82]">{label}</Link>)}</div></div>
  </div>;
}
