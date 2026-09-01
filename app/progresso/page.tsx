import { ModuleShell } from "../components/ModuleShell";

const metrics = [
  ["Estudos concluídos", "28"],
  ["Dias de constância", "12"],
  ["Tempo de estudo", "8h 40min"],
];

export default function ProgressoPage() {
  return <ModuleShell title="Meu progresso" description="Acompanhe sua constância, seus estudos e os caminhos que você está construindo na Palavra.">
    <div className="grid gap-4 md:grid-cols-3">{metrics.map(([label,value]) => <div key={label} className="rounded-2xl border border-[#E1E7EA] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)]"><p className="text-sm text-[#5E6E82]">{label}</p><p className="mt-3 font-serif text-3xl font-bold text-[#0F2131]">{value}</p></div>)}</div>
    <section className="mt-6 rounded-2xl bg-[#0F2131] p-7 text-white"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C4A47C]">Caminho atual</p><h2 className="mt-2 font-serif text-2xl font-bold">Evangelhos em 30 dias</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">Constância antes de velocidade. Continue de onde parou e deixe o estudo formar uma caminhada.</p><div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[40%] rounded-full bg-[#C4A47C]" /></div><p className="mt-2 text-xs text-white/50">12 de 30 dias</p></section>
  </ModuleShell>;
}
