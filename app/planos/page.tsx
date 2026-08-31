import { ModuleShell } from "../components/ModuleShell";

const plans = [
  { name: "Evangelhos em 30 dias", description: "Uma jornada concentrada pelos quatro Evangelhos." },
  { name: "Bíblia em 1 ano", description: "Leia a Bíblia ao longo de um ano, com constância e propósito." },
  { name: "Plano personalizado", description: "Monte seu próprio plano de leitura conforme sua jornada." },
];

export default function PlanosPage() {
  return (
    <ModuleShell title="Planos de leitura" description="Organize sua leitura da Palavra, acompanhe o progresso e avance no seu próprio ritmo.">
      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <article key={plan.name} className="rounded-2xl border border-[#E1E7EA] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between">
              <span className="rounded-lg bg-[#F8F9FA] px-3 py-1 text-xs font-semibold text-[#5E6E82]">Plano {index + 1}</span>
              <span className="text-xs font-semibold text-[#C4A47C]">0%</span>
            </div>
            <h2 className="mt-5 font-serif text-xl font-bold text-[#0F2131]">{plan.name}</h2>
            <p className="mt-2 text-sm leading-6 text-[#5E6E82]">{plan.description}</p>
            <div className="mt-6 flex items-center justify-between text-xs text-[#5E6E82]"><span>0 de 21 concluídos</span><span>Começar</span></div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E1E7EA]"><div className="h-full w-0 rounded-full bg-[#C4A47C]" /></div>
            <button className="mt-5 w-full rounded-xl border border-[#E1E7EA] px-4 py-3 text-sm font-semibold text-[#0F2131] hover:bg-[#F8F9FA]">Abrir plano</button>
          </article>
        ))}
      </div>
    </ModuleShell>
  );
}
