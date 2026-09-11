import { ModuleShell } from "../components/ModuleShell";

export default function ContaPage() {
  return (
    <ModuleShell title="Minha conta" description="Seu acesso, preferências e segurança em um só lugar.">
      <section className="rounded-[28px] bg-[#0B1119] p-7 text-white md:p-8">
        <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#D5B579]">Seu espaço</p>
        <h2 className="mt-3 font-serif text-3xl font-semibold">Uma jornada organizada também começa por aqui.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/48">Gerencie os dados ligados à sua conta e acompanhe as áreas que sustentam seu acesso ao Coram Deo.</p>
      </section>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <article className="rounded-[26px] border border-[#D5C8B5] bg-[#F7F1E7] p-6 md:p-7">
          <div className="flex items-center justify-between gap-3"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#8B6A34]">Perfil</p><span className="rounded-full border border-[#D5C8B5] px-3 py-1 text-[10px] font-semibold text-[#6D6257]">Conta Coram Deo</span></div>
          <h2 className="mt-5 font-serif text-2xl font-semibold text-[#111820]">Seus dados</h2>
          <p className="mt-3 text-sm leading-7 text-[#665E54]">Nome, e-mail e preferências pessoais fazem parte da sua experiência de uso e onboarding.</p>
          <div className="mt-6 border-t border-[#DDD0BE] pt-4 text-xs leading-6 text-[#7A7066]">A edição completa de dados permanece vinculada aos fluxos já existentes da conta.</div>
        </article>

        <article className="rounded-[26px] border border-[#D5C8B5] bg-[#F7F1E7] p-6 md:p-7">
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#8B6A34]">Segurança</p>
          <h2 className="mt-5 font-serif text-2xl font-semibold text-[#111820]">Acesso protegido</h2>
          <p className="mt-3 text-sm leading-7 text-[#665E54]">Sua sessão é protegida pelo fluxo de autenticação do Coram Deo e pelas regras de acesso da plataforma.</p>
          <div className="mt-6 border-t border-[#DDD0BE] pt-4 text-xs leading-6 text-[#7A7066]">Alterações sensíveis continuam sendo tratadas pelos fluxos seguros já conectados à autenticação.</div>
        </article>
      </div>

      <section className="mt-5 rounded-[26px] border border-[#D5C8B5] bg-[#EEE5D7] p-6 md:p-7">
        <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#8B6A34]">Assinatura e acesso</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4"><div><h2 className="font-serif text-2xl font-semibold text-[#111820]">Seu acesso ao Coram Deo</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#665E54]">Assinaturas e acessos administrativos são validados pela infraestrutura atual da plataforma.</p></div><span className="rounded-full bg-[#D5B579] px-4 py-2 text-xs font-bold text-[#111820]">Acesso protegido</span></div>
      </section>
    </ModuleShell>
  );
}
