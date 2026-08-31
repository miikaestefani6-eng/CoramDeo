import Link from "next/link";

const nav = [
  ["Início", "/"], ["Estudar", "/estudar"], ["Devocional", "/devocional"],
  ["Ministério", "/ministerio"], ["Biblioteca", "/biblioteca"], ["Favoritos", "/favoritos"],
  ["Minhas Anotações", "/anotacoes"], ["Planos de leitura", "/planos"], ["Notificações", "/notificacoes"], ["Minha conta", "/conta"],
] as const;

export function ModuleShell({ title, description, children }: { title: string; description: string; children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0F2131]">
      <aside className="fixed inset-y-0 left-0 hidden w-[268px] bg-[#0F2131] px-5 py-7 lg:block">
        <Link href="/" className="font-serif text-xl font-bold text-white">Coram Deo</Link>
        <p className="mt-1 text-[10px] text-white/45">Aprendizagem cristã e discipulado</p>
        <nav className="mt-10 space-y-1">
          {nav.map(([label, href]) => <Link key={href} href={href} className="block rounded-xl px-4 py-3 text-sm text-[#5E6E82] transition hover:bg-white/5 hover:text-white">{label}</Link>)}
        </nav>
      </aside>
      <main className="lg:pl-[268px]">
        <header className="border-b border-[#E1E7EA] bg-white px-5 py-6 lg:px-10"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C4A47C]">Coram Deo</p><h1 className="mt-1 font-serif text-3xl font-bold">{title}</h1><p className="mt-2 max-w-2xl text-sm text-[#5E6E82]">{description}</p></header>
        <section className="px-5 py-8 lg:px-10">{children ?? <div className="rounded-xl border border-[#E1E7EA] bg-white p-8 text-sm text-[#5E6E82]">Estrutura inicial do módulo pronta para receber dados e ações do V1.</div>}</section>
      </main>
    </div>
  );
}
