import { ModuleShell } from "../components/ModuleShell";

const journey = [
  { label: "Conhecimento bíblico", value: "Em desenvolvimento" },
  { label: "Objetivo", value: "Aprofundar na Palavra" },
  { label: "Plano ativo", value: "Evangelhos em 30 dias" },
];

export default function PerfilPage() {
  return (
    <ModuleShell title="Meu perfil" description="Seu espaço para acompanhar sua jornada de aprendizagem e discipulado no Coram Deo.">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-2xl bg-[#0F2131] p-7 text-white shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#C4A47C]/20 font-serif text-2xl text-[#C4A47C]">M</div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#C4A47C]">Minha jornada</p>
          <h2 className="mt-2 font-serif text-2xl font-bold">Como você quer ser chamado?</h2>
          <p className="mt-2 text-sm leading-6 text-white/60">Seu perfil ajuda o Coram Deo a adaptar a experiência de aprendizagem ao seu momento.</p>
          <button className="mt-6 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white">Editar perfil</button>
        </section>
        <section className="rounded-2xl border border-[#E1E7EA] bg-white p-7 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C4A47C]">Sua jornada</p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-[#0F2131]">Conheça seu momento</h2>
          <div className="mt-6 divide-y divide-[#E1E7EA]">
            {journey.map((item) => <div key={item.label} className="flex flex-wrap items-center justify-between gap-3 py-4"><span className="text-sm text-[#5E6E82]">{item.label}</span><span className="text-sm font-semibold text-[#0F2131]">{item.value}</span></div>)}
          </div>
          <div className="mt-6 rounded-xl bg-[#F8F9FA] p-5"><p className="font-serif font-bold text-[#0F2131]">Seus conteúdos salvos</p><div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4"><a href="/favoritos" className="rounded-lg bg-white p-3 text-center text-xs font-semibold">Favoritos</a><a href="/anotacoes" className="rounded-lg bg-white p-3 text-center text-xs font-semibold">Anotações</a><a href="/planos" className="rounded-lg bg-white p-3 text-center text-xs font-semibold">Planos</a><a href="/notificacoes" className="rounded-lg bg-white p-3 text-center text-xs font-semibold">Notificações</a></div></div>
        </section>
      </div>
    </ModuleShell>
  );
}
