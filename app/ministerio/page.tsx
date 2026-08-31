import { ModuleShell } from "../components/ModuleShell";

const formats = ["Célula / PG", "Pregação", "Mensagem de impacto", "Palestra"];

export default function MinisterioPage() {
  return (
    <ModuleShell title="Ministério" description="Prepare uma conversa que conduza à Palavra, com estrutura clara e propósito definido.">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <section className="rounded-2xl bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C4A47C]">Preparar com Sião</p>
          <h2 className="mt-2 font-serif text-2xl font-bold">O que você vai conduzir?</h2>
          <p className="mt-2 text-sm leading-6 text-[#5E6E82]">Informe o tema ou texto bíblico e escolha o formato. Sião organiza uma estrutura adequada ao seu objetivo.</p>
          <label className="mt-6 block text-xs font-semibold text-[#0F2131]">Tema ou texto bíblico</label>
          <textarea className="mt-2 h-32 w-full resize-none rounded-xl border border-[#E1E7EA] p-4 text-sm outline-none focus:border-[#8C183F]" placeholder="Ex.: João 1:1 — O Verbo que se fez carne" />
          <label className="mt-5 block text-xs font-semibold text-[#0F2131]">Formato</label>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {formats.map((format, index) => <button key={format} className={`rounded-xl border px-4 py-3 text-left text-sm font-medium ${index === 0 ? "border-[#8C183F] bg-[#8C183F]/5 text-[#8C183F]" : "border-[#E1E7EA] text-[#5E6E82]"}`}>{format}</button>)}
          </div>
          <button className="mt-6 rounded-xl bg-[#8C183F] px-6 py-3 text-sm font-semibold text-white">Preparar estrutura →</button>
        </section>
        <section className="rounded-2xl border border-[#E1E7EA] bg-white p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C4A47C]">Prévia</p>
          <h2 className="mt-2 font-serif text-2xl font-bold">Sua conversa com propósito</h2>
          <p className="mt-3 text-sm leading-6 text-[#5E6E82]">A estrutura preparada pelo Sião aparecerá aqui depois que você informar o tema ou texto.</p>
          <div className="mt-6 space-y-3">
            {["Texto e contexto", "Ponto central", "Perguntas para conduzir a conversa", "Aplicação prática"].map((item, i) => <div key={item} className="rounded-xl bg-[#F8F9FA] p-4"><span className="text-xs font-semibold text-[#8C183F]">0{i + 1}</span><p className="mt-1 font-serif font-bold">{item}</p></div>)}
          </div>
        </section>
      </div>
    </ModuleShell>
  );
}
