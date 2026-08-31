import { ModuleShell } from "../components/ModuleShell";

const sections = [
  ["Palavra", "A Palavra nos revela quem Deus é e nos chama a conhecê-lo com reverência e verdade."],
  ["Medite e Entenda", "Pare por alguns minutos. O que este texto revela sobre Deus? O que ele confronta ou ilumina em você hoje?"],
  ["Ore", "Converse com Deus sobre aquilo que você compreendeu e apresente a Ele o que está vivendo."],
  ["Pratique", "Escolha uma atitude concreta para viver esta verdade hoje. O conhecimento da Palavra deve produzir transformação."],
] as const;

export default function DevocionalPage() {
  return (
    <ModuleShell title="Devocional" description="Prepare uma reflexão a partir de um tema ou texto bíblico e caminhe diante da Palavra.">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-2xl bg-[#0F2131] p-6 text-white md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C4A47C]">Seu momento com a Palavra</p>
          <h2 className="mt-2 font-serif text-2xl font-bold md:text-3xl">O que você deseja refletir hoje?</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">Digite uma referência bíblica ou um tema. O Sião organizará uma reflexão didática, profunda e teologicamente responsável.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input aria-label="Tema ou referência bíblica" className="min-h-12 flex-1 rounded-xl bg-white px-4 text-sm text-[#0F2131] outline-none placeholder:text-[#5E6E82]" placeholder="Ex.: João 1:1 ou ansiedade" />
            <button className="rounded-xl bg-[#8C183F] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">Preparar devocional →</button>
          </div>
        </section>

        <section className="rounded-2xl border border-[#E1E7EA] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8C183F]">Reflexão preparada</p>
              <p className="mt-1 text-xs text-[#5E6E82]">Exemplo · João 1:1</p>
            </div>
            <button className="rounded-lg border border-[#E1E7EA] px-3 py-2 text-xs font-semibold text-[#0F2131]">☆ Favoritar</button>
          </div>

          <h2 className="mt-6 font-serif text-2xl font-bold">Quando a Palavra encontra o coração</h2>
          <blockquote className="mt-5 border-l-2 border-[#C4A47C] pl-5 font-serif text-base italic leading-7 text-[#5E6E82]">“No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.”</blockquote>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {sections.map(([title, text]) => (
              <article key={title} className="rounded-xl bg-[#F8F9FA] p-5">
                <h3 className="font-serif text-lg font-bold text-[#0F2131]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#5E6E82]">{text}</p>
              </article>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-3 border-t border-[#E1E7EA] pt-6">
            <button className="rounded-lg bg-[#8C183F] px-5 py-3 text-xs font-semibold text-white">Marcar como lido</button>
            <button className="rounded-lg border border-[#E1E7EA] px-5 py-3 text-xs font-semibold text-[#0F2131]">✦ Tirar dúvida com Sião</button>
          </div>
        </section>
      </div>
    </ModuleShell>
  );
}
