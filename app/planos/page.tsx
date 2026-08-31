import { ModuleShell } from "../components/ModuleShell";

const plans = [
  { name: "Evangelhos em 30 dias", description: "Uma jornada concentrada pelos quatro Evangelhos." },
  { name: "Bíblia em 1 ano", description: "Leia a Bíblia ao longo de um ano, com constância e propósito." },
  { name: "Plano personalizado", description: "Monte seu próprio plano de leitura conforme sua jornada." },
];

export default function PlanosPage() {
  return (
    <ModuleShell title="Planos de leitura" description="Organize sua leitura da Palavra, acompanhe o progresso e avance no seu próprio ritmo.">
      <section className="mb-6 rounded-2xl bg-[#0F2131] p-6 text-white md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C4A47C]">Coram Deo</p>
        <h2 className="mt-2 font-serif text-2xl font-bold">Escolha como continuar sua jornada</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">Tenha acesso completo aos recursos da plataforma com o plano que melhor combina com você.</p>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5"><p className="text-xs text-white/50">Plano mensal</p><p className="mt-1 text-2xl font-bold">R$ 24,99</p><p className="mt-1 text-xs text-white/50">Acesso completo</p></div>
          <div className="rounded-xl border border-[#C4A47C] bg-[#C4A47C]/10 p-5"><div className="flex items-center justify-between"><p className="text-xs text-[#C4A47C]">Plano semestral</p><span className="rounded-full bg-[#C4A47C] px-2 py-1 text-[10px] font-bold text-[#0F2131]">ECONOMIZE R$ 20</span></div><p className="mt-1 text-2xl font-bold">R$ 129,99</p><p className="mt-1 text-xs text-white/50">Acesso completo por 6 meses</p></div>
        </div>
        <p className="mt-4 text-xs text-white/40">Não existe plano gratuito público. Cortesias são concedidas exclusivamente pela administração.</p>
      </section>
      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <article key={plan.name} className="rounded-2xl border border-[#E1E7EA] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between"><span className="rounded-lg bg-[#F8F9FA] px-3 py-1 text-xs font-semibold text-[#5E6E82]">Plano {index + 1}</span><span className="text-xs font-semibold text-[#C4A47C]">0%</span></div>
            <h2 className="mt-5 font-serif text-xl font-bold text-[#0F2131]">{plan.name}</h2><p className="mt-2 text-sm leading-6 text-[#5E6E82]">{plan.description}</p>
            <div className="mt-6 flex items-center justify-between text-xs text-[#5E6E82]"><span>0 de 21 concluídos</span><span>Começar</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E1E7EA]"><div className="h-full w-0 rounded-full bg-[#C4A47C]" /></div>
            <button className="mt-5 w-full rounded-xl border border-[#E1E7EA] px-4 py-3 text-sm font-semibold text-[#0F2131] hover:bg-[#F8F9FA]">Abrir plano</button>
          </article>
        ))}
      </div>
    </ModuleShell>
  );
}
