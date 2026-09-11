import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/admin");

  const { data: admin } = await supabase
    .from("coram_admins")
    .select("role,active")
    .eq("user_id", user.id)
    .eq("active", true)
    .maybeSingle();

  if (!admin) redirect("/");

  return <>
    <nav className="border-b border-[#E1E3E2] bg-[#0F2131] px-5 py-3 text-white lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 text-sm">
        <span className="mr-3 font-serif font-bold">Coram Deo CMS</span>
        <Link href="/admin" className="rounded-lg px-3 py-2 hover:bg-white/10">Visão geral</Link>
        <Link href="/admin/conteudos" className="rounded-lg px-3 py-2 hover:bg-white/10">Biblioteca e conteúdos</Link>
        <Link href="/admin/planos" className="rounded-lg px-3 py-2 hover:bg-white/10">Planos e preços</Link>
        <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] uppercase tracking-wider text-white/60">{admin.role}</span>
        <Link href="/" className="ml-auto rounded-lg border border-white/20 px-3 py-2">Aplicativo</Link>
      </div>
    </nav>
    {children}
  </>;
}
