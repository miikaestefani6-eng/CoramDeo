import { ModuleShell } from "../components/ModuleShell";

const tabs = ["Todos", "Estudos", "Biblioteca", "Vídeos"];
const examples = [
  { type: "Estudo", title: "João 1 — O Verbo", meta: "Estudo preparado por Sião" },
  { type: "Biblioteca", title: "Panorama Bíblico", meta: "Material do Coram Deo" },
  { type: "Vídeo", title: "O Verbo que se fez carne", meta: "Aula complementar" },
];

export default function FavoritosPage() {
  return (
    <ModuleShell title="Favoritos" description="Guarde estudos, conteúdos da biblioteca e vídeos para voltar quando quiser.">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab, index) => (
          <button key={tab} className={`rounded-lg px-4 py-2 text-xs font-semibold ${index === 0 ? "bg-[#8C183F] text-white" : "border border-[#E1E7EA] bg-white text-[#5E6E82]"}`}>{tab}</button>
        ))}
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {examples.map((item) => (
          <article key={item.title} className="rounded-2xl border border-[#E1E7EA] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-wider text-[#C4A47C]">{item.type}</span><button aria-label={`Remover ${item.title} dos favoritos`} className="text-lg text-[#8C183F]">★</button></div>
            <h2 className="mt-4 font-serif text-xl font-bold text-[#0F2131]">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#5E6E82]">{item.meta}</p>
            <button className="mt-5 rounded-lg border border-[#E1E7EA] px-4 py-2 text-xs font-semibold text-[#0F2131]">Abrir conteúdo →</button>
          </article>
        ))}
      </div>
    </ModuleShell>
  );
}
