import Link from "next/link";

const layers = [
  ["Evidências", "Visão geral do livro", "Propósito, estrutura, autoria e lugar da passagem dentro do livro."],
  ["Evidências", "Contexto do texto", "O que acontece antes e depois e como o trecho participa do argumento do autor."],
  ["Evidências", "Contexto histórico-cultural", "Costumes, instituições, cenário social e elementos culturais relevantes."],
  ["Evidências", "Linha do tempo", "Acontecimentos e personagens situados dentro do período bíblico."],
  ["Evidências", "Línguas bíblicas", "Termos relevantes observados no grego, hebraico ou aramaico."],
  ["Evidências", "Arqueologia", "Lugares, achados e evidências arqueológicas pertinentes quando disponíveis."],
  ["Evidências", "Fontes e evidências", "Fontes históricas externas úteis para compreender o texto com responsabilidade."],
  ["Interpretação", "Aplicação", "Princípios de vida cristã derivados do sentido do texto, sem confundir significado e aplicação."],
  ["Interpretação", "Análise literária", "Gênero, estrutura e recursos literários usados pelo autor."],
  ["Interpretação", "Contexto histórico e profético", "Acontecimentos históricos e dimensões proféticas relacionadas à passagem."],
  ["Interpretação", "Escatologia", "Conexões escatológicas relevantes, distinguindo texto bíblico e interpretações posteriores."],
  ["Interpretação", "Conexões bíblicas", "Relações com outros textos das Escrituras para ampliar a compreensão."],
  ["Interpretação", "Teologia", "Principais afirmações teológicas da passagem e sua relação com a mensagem bíblica."],
  ["Tradição", "Camadas do texto", "Diferentes leituras e tradições interpretativas desenvolvidas ao longo do tempo."],
  ["Tradição", "Tradição judaica", "Elementos da tradição judaica relevantes para o ambiente histórico e interpretativo."],
  ["Tradição", "Interpretação histórica", "Leituras históricas importantes, preservando diferenças entre tradições."],
];

export default function EstudarPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FA] text-[#0F2131]">
      <header className="border-b border-[#E1E7EA] bg-white px-5 py-4 lg:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="font-serif text-xl font-bold">Coram Deo</Link>
          <span className="text-xs font-medium text-[#5E6E82]">Estudo bíblico · Sião</span>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-8 lg:px-10 lg:py-12">
        <section className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C4A47C]">Sião · Estudo</p>
          <h1 className="mt-3 font-serif text-3xl font-bold md:text-4xl">O que você deseja compreender?</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#5E6E82]">Pesquise uma passagem, personagem, acontecimento ou tema. O estudo será organizado em 16 camadas.</p>
          <div className="mt-7 flex items-center gap-3 rounded-xl bg-white p-2 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <span className="pl-3 text-xl text-[#8C183F]">⌕</span>
            <input defaultValue="João 1" className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm outline-none" aria-label="Pesquisar estudo" />
            <button className="rounded-lg bg-[#8C183F] px-5 py-3 text-sm font-semibold text-white">Pesquisar</button>
          </div>
        </section>
        <section className="mx-auto mt-10 max-w-4xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-xs font-semibold uppercase tracking-wider text-[#C4A47C]">Estudo encontrado</p><h2 className="mt-1 font-serif text-3xl font-bold">João 1</h2><p className="mt-1 text-sm text-[#5E6E82]">As 16 camadas aparecem juntas para você estudar no seu ritmo.</p></div>
            <div className="flex gap-2"><button className="rounded-lg border border-[#E1E7EA] bg-white px-4 py-2 text-sm font-semibold">☆ Favoritar</button><button className="rounded-lg border border-[#E1E7EA] bg-white px-4 py-2 text-sm font-semibold">+ Anotar</button></div>
          </div>
          <div className="mt-7 space-y-4">
            {layers.map(([group, title, text], index) => <article key={title} className="rounded-xl border border-[#E1E7EA] bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.04)] md:p-6"><div className="flex gap-4"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F2131] text-xs font-bold text-[#C4A47C]">{index + 1}</div><div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#F8F9FA] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#5E6E82]">{group}</span><h3 className="font-serif text-lg font-bold">{title}</h3></div><p className="mt-2 text-sm leading-6 text-[#5E6E82]">{text}</p></div></div></article>)}
          </div>
        </section>
      </div>
      <button className="fixed bottom-6 right-5 flex items-center gap-2 rounded-full bg-[#8C183F] px-4 py-3 text-sm font-semibold text-white shadow-xl" aria-label="Tirar dúvida com Sião"><span className="text-[#C4A47C]">✦</span> Tirar dúvida com Sião</button>
    </main>
  );
}
