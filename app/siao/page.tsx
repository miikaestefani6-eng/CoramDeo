import { ModuleShell } from "../components/ModuleShell";

export default function SiaoPage() {
  return <ModuleShell title="Sião" description="Seu companheiro de jornada para compreender, revisar e continuar aprendendo com a Palavra.">
    <section className="rounded-3xl bg-[#0F2131] p-8 text-white"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C4A47C]">Seu assistente</p><h2 className="mt-3 font-serif text-4xl font-bold">Olá. Vamos estudar juntos?</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">Pergunte sobre uma passagem, peça ajuda para compreender um contexto ou continue uma reflexão. Sião orienta sem substituir a Escritura.</p><div className="mt-7 flex flex-wrap gap-2"><span className="rounded-full bg-white/10 px-4 py-2 text-sm">Explicar uma passagem</span><span className="rounded-full bg-white/10 px-4 py-2 text-sm">Ajudar a revisar</span><span className="rounded-full bg-white/10 px-4 py-2 text-sm">Conectar temas bíblicos</span></div></section>
    <section className="mt-6 rounded-2xl border border-[#E1E7EA] bg-white p-7"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C4A47C]">Em breve na experiência conectada</p><h2 className="mt-2 font-serif text-2xl font-bold text-[#0F2131]">Conversa contextual</h2><p className="mt-3 text-sm leading-6 text-[#5E6E82]">A interface está pronta. A próxima etapa conecta o diálogo à camada de IA e às permissões do usuário sem alterar a fundação do beta.</p></section>
  </ModuleShell>;
}
