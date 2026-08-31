import { ModuleShell } from "../components/ModuleShell";

const notes = [
  { reference: "João 1:1", text: "Percebi como o texto apresenta a eternidade do Verbo e sua relação com Deus." },
  { reference: "Romanos 8", text: "Quero guardar esta percepção enquanto continuo meu estudo." },
];

export default function AnotacoesPage() {
  return (
    <ModuleShell title="Minhas anotações" description="Guarde aquilo que Deus fez você perceber enquanto estudava.">
      <section className="rounded-2xl border border-[#E1E7EA] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C4A47C]">Durante um estudo</p>
        <h2 className="mt-2 font-serif text-2xl font-bold text-[#0F2131]">O que você quer guardar?</h2>
        <p className="mt-2 text-sm leading-6 text-[#5E6E82]">Registre uma percepção relacionada ao estudo que está fazendo. Depois de salvar, a anotação não poderá ser editada.</p>
        <label className="mt-6 block text-xs font-semibold text-[#0F2131]">Referência</label>
        <input className="mt-2 w-full rounded-xl border border-[#E1E7EA] px-4 py-3 text-sm outline-none focus:border-[#8C183F]" placeholder="Ex.: João 1:1" />
        <label className="mt-4 block text-xs font-semibold text-[#0F2131]">Sua anotação</label>
        <textarea className="mt-2 h-32 w-full resize-none rounded-xl border border-[#E1E7EA] p-4 text-sm outline-none focus:border-[#8C183F]" placeholder="O que você percebeu neste estudo?" />
        <button className="mt-5 rounded-xl bg-[#8C183F] px-6 py-3 text-sm font-semibold text-white">Salvar anotação</button>
      </section>
      <section className="mt-6">
        <h2 className="font-serif text-xl font-bold text-[#0F2131]">Anotações salvas</h2>
        <div className="mt-4 space-y-3">
          {notes.map((note) => <article key={note.reference} className="rounded-2xl border border-[#E1E7EA] bg-white p-5"><div className="flex items-start justify-between gap-4"><div><span className="text-xs font-semibold text-[#8C183F]">{note.reference}</span><p className="mt-2 text-sm leading-6 text-[#5E6E82]">{note.text}</p></div><button className="shrink-0 text-xs font-semibold text-[#8C183F]">Excluir</button></div></article>)}
        </div>
      </section>
    </ModuleShell>
  );
}
