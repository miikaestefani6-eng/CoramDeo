import Link from "next/link";
import { ModuleShell } from "../components/ModuleShell";

export default function ContaPage() {
  return <ModuleShell title="Minha conta" description="Gerencie seus dados, plano, segurança e sessões.">
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
        <span className="rounded-full bg-[#BF9B3E]/15 px-3 py-1 text-xs font-semibold text-[#8a6d20]">Plano</span>
        <h2 className="mt-5 font-serif text-xl font-bold">Coram Deo Essencial</h2>
        <p className="mt-2 text-sm text-[#5E6E82]">Primeiro mês por R$ 19,90. Depois, R$ 24,99/mês.</p>
        <Link href="/assinatura" className="mt-5 inline-flex rounded-xl bg-[#8C183F] px-4 py-3 text-xs font-bold text-white">Ver assinatura</Link>
      </div>
      <div className="rounded-xl bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
        <h2 className="font-serif text-xl font-bold">Seu perfil</h2>
        <p className="mt-2 text-sm text-[#5E6E82]">Nome, e-mail, avatar e preferências da jornada.</p>
        <Link href="/perfil" className="mt-5 inline-flex text-xs font-bold text-[#8C183F]">Abrir meu perfil →</Link>
      </div>
      <div className="rounded-xl bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
        <h2 className="font-serif text-xl font-bold">Segurança</h2>
        <p className="mt-2 text-sm text-[#5E6E82]">Alteração de senha, sessões e saída da conta.</p>
      </div>
    </div>
  </ModuleShell>;
}
