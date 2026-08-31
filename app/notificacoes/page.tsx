import { ModuleShell } from "../components/ModuleShell";

const notifications = [
  { title: "Novo e-book disponível", text: "Um novo material foi adicionado à Biblioteca do Coram Deo.", time: "Hoje", unread: true },
  { title: "Novo vídeo na Biblioteca", text: "Uma nova aula complementar já está disponível para você.", time: "Ontem", unread: true },
  { title: "Novidade na plataforma", text: "Confira as novidades e melhorias preparadas pelo Coram Deo.", time: "Há 3 dias", unread: false },
];

export default function NotificacoesPage() {
  return (
    <ModuleShell title="Notificações" description="Acompanhe novidades e conteúdos novos do Coram Deo.">
      <div className="space-y-3">
        {notifications.map((notification) => (
          <article key={notification.title} className={`rounded-2xl border bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.04)] ${notification.unread ? "border-[#C4A47C]" : "border-[#E1E7EA]"}`}>
            <div className="flex items-start gap-4"><span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${notification.unread ? "bg-[#1A707E]" : "bg-[#E1E7EA]"}`} /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-serif text-lg font-bold text-[#0F2131]">{notification.title}</h2><span className="text-xs text-[#5E6E82]">{notification.time}</span></div><p className="mt-1 text-sm leading-6 text-[#5E6E82]">{notification.text}</p></div></div>
          </article>
        ))}
      </div>
    </ModuleShell>
  );
}
