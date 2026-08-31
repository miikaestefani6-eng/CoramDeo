import { ModuleShell } from "../components/ModuleShell";

export default function EstudarPage() {
  return <ModuleShell title="Estudar" description="Pesquise e aprofunde-se na Palavra com o estudo em 16 camadas do Coram Deo."><div className="rounded-xl bg-[#0F2131] p-8 text-center"><h2 className="font-serif text-2xl font-bold text-white">O que você deseja compreender?</h2><div className="mx-auto mt-6 flex max-w-2xl rounded-xl bg-white p-2"><input className="min-w-0 flex-1 px-3 py-3 text-sm outline-none" placeholder="João 1, Paulo, justificação..." /><button className="rounded-lg bg-[#8C183F] px-5 text-sm font-semibold text-white">Pesquisar</button></div></div></ModuleShell>;
}
