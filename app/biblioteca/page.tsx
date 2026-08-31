import { ModuleShell } from "../components/ModuleShell";

const resources = [
  ["E-book", "Panorama Bíblico", "PDF · Coram Deo"],
  ["Estudo", "Antigo Testamento", "Material de estudo"],
  ["Comentário", "João — Contexto e interpretação", "Comentário bíblico"],
  ["Vídeo", "O Verbo que se fez carne", "Aula complementar"],
  ["Sermão", "João 1:1 — O Verbo", "Sermão"],
  ["Livro", "Introdução ao estudo bíblico", "Livro autorizado"],
];

const categories = ["Todos", "E-books", "Estudos", "Comentários", "Vídeos", "Sermões", "Livros"];

export default function BibliotecaPage() {
  return (
    <ModuleShell title="Biblioteca" description="Um acervo para aprofundar seu conhecimento da Palavra e sua formação cristã.">
      <div className="flex flex-wrap gap-2">{categories.map((category, i) => <button key={category} className={`rounded-lg px-4 py-2 text-xs font-semibold ${i === 0 ? "bg-[#8C183F] text-white" : "border border-[#E1E7EA] bg-white text-[#5E6E82]"}`}>{category}</button>)}</div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map(([type, title, meta]) => (
          <article key={title} className="overflow-hidden rounded-2xl border border-[#E1E7EA] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <div className="flex h-36 items-center justify-center bg-[#0F2131] px-6"><span className="text-center font-serif text-xl font-bold text-[#C4A47C]">{type}</span></div>
            <div className="p-5"><span className="text-[11px] font-semibold uppercase tracking-wider text-[#5E6E82]">{meta}</span><h2 className="mt-2 font-serif text-lg font-bold text-[#0F2131]">{title}</h2><button className="mt-5 w-full rounded-xl border border-[#E1E7EA] px-4 py-3 text-xs font-semibold text-[#0F2131]">Abrir no leitor →</button></div>
          </article>
        ))}
      </div>
    </ModuleShell>
  );
}
