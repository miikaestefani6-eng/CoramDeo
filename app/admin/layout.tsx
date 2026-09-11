import Link from "next/link";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>
    <nav className="border-b border-[#E1E3E2] bg-[#0F2131] px-5 py-3 text-white lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 text-sm">
        <span className="mr-3 font-serif font-bold">Coram Deo Admin</span>
        <Link href="/admin" className="rounded-lg px-3 py-2 hover:bg-white/10">Visão geral</Link>
        <Link href="/admin/conteudos" className="rounded-lg px-3 py-2 hover:bg-white/10">Conteúdos</Link>
        <Link href="/admin/planos" className="rounded-lg px-3 py-2 hover:bg-white/10">Planos e preços</Link>
        <Link href="/" className="ml-auto rounded-lg border border-white/20 px-3 py-2">Aplicativo</Link>
      </div>
    </nav>
    {children}
  </>;
}
