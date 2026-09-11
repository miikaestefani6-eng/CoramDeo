import Link from "next/link";

const layers = [
  ["01", "Visão geral", "Entenda a ideia central antes de entrar nos detalhes."],
  ["02", "Contexto do livro", "Autor, destinatários, propósito e cenário do livro."],
  ["03", "Contexto do capítulo", "Veja como o trecho funciona dentro do argumento maior."],
  ["04", "Histórico-cultural", "Costumes, ambiente social e referências do mundo bíblico."],
  ["05", "Linha do tempo", "Posicione acontecimentos e personagens no fluxo da história."],
  ["06", "Línguas bíblicas", "Termos em hebraico e grego com transliteração e sentido contextual."],
  ["07", "Teologia", "Temas doutrinários apresentados com contexto e responsabilidade."],
  ["08", "Conexões bíblicas", "Relações com outras passagens e temas das Escrituras."],
  ["09", "Tradição judaica", "Contexto de tradição judaica claramente distinguido do texto bíblico."],
  ["10", "Histórico-profético", "Leituras proféticas com distinção entre evidência e interpretação."],
  ["11", "Literário", "Gênero, estrutura, recursos literários e movimento do texto."],
  ["12", "Escatológico", "Perspectivas escatológicas apresentadas sem transformar debate em certeza."],
  ["13", "Arqueologia", "Achados e contexto histórico usados para iluminar, não para fabricar provas."],
  ["14", "Camadas do texto", "Observe padrões, progressões e nuances que se perdem numa leitura rápida."],
  ["15", "Aplicação", "Traga o estudo para a vida real sem desconectar aplicação de contexto."],
  ["16", "Fontes e evidências", "Saiba o que sustenta cada conclusão e onde existe incerteza."],
];

const resources = [
  ["Estudo bíblico", "Pesquise passagens, temas e personagens com o Zion em uma estrutura profunda e organizada."],
  ["Devocional", "Leituras para sustentar constância, meditação e aplicação da Palavra no cotidiano."],
  ["Biblioteca", "Conteúdos e materiais reunidos em um só lugar para consulta e continuidade."],
  ["Anotações e favoritos", "Registre descobertas, salve estudos e volte exatamente ao ponto em que parou."],
  ["Planos de leitura", "Organize sua rotina e acompanhe o progresso sem transformar estudo em competição."],
  ["Pesquisa com contexto", "Tecnologia a serviço da compreensão bíblica, não no lugar da Bíblia, da igreja ou do discipulado."],
];

const faqs = [
  ["O que é o Zion?", "Zion é a inteligência de pesquisa bíblica do Coram Deo. Ele organiza uma pergunta em 16 camadas de estudo para ajudar você a compreender contexto, evidências, interpretações, tradições e aplicações."],
  ["O Zion é um chat?", "Não. A experiência foi desenhada como pesquisa e estudo estruturado. A proposta é conduzir você pelas camadas da investigação bíblica, não criar mais um chat genérico."],
  ["A tecnologia substitui meu pastor ou minha igreja?", "Não. O Coram Deo foi criado para servir ao estudo pessoal e ao preparo. A Palavra, a igreja local, o discipulado e a vida comunitária continuam centrais."],
  ["O que está incluído na assinatura?", "A V1 reúne pesquisa bíblica com Zion, devocionais, biblioteca, anotações, favoritos, planos de leitura e os recursos apresentados nesta página."],
  ["Como funcionam os 7 dias grátis?", "Você cria sua conta e usa o Coram Deo por 7 dias sem cartão. Ao final do período, o acesso gratuito termina e você decide se quer continuar pela assinatura de R$ 24,99 por mês, processada pela Kiwify."],
  ["Como funciona a assinatura?", "Depois dos 7 dias gratuitos, você pode continuar por R$ 24,99 por mês. O pagamento é processado pela Kiwify e não existe cobrança automática durante o período gratuito."],
  ["Já existem depoimentos?", "Ainda não publicamos avaliações na landing. Essa área só será usada quando tivermos feedbacks reais e autorizados de usuários."],
];

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <svg aria-hidden="true" viewBox="0 0 64 72" className={compact ? "h-9 w-8" : "h-11 w-10"} fill="none">
        <path d="M10 61V24C10 12.4 19.4 3 31 3h2c11.6 0 21 9.4 21 21v37" stroke="currentColor" strokeWidth="2.4"/>
        <path d="M16 60V25c0-8.8 7.2-16 16-16s16 7.2 16 16v35" stroke="currentColor" strokeWidth="1.5" opacity=".65"/>
        <path d="M15 59c8-4.4 13.7-4.5 17-.2 3.3-4.3 9-4.2 17 .2v6c-8-4.3-13.7-4.4-17-.1-3.3-4.3-9-4.2-17 .1v-6Z" fill="currentColor" opacity=".95"/>
        <path d="M32 20l2.7 8.3L43 31l-8.3 2.7L32 42l-2.7-8.3L21 31l8.3-2.7L32 20Z" fill="currentColor"/>
      </svg>
      <span>
        <span className="block font-serif text-[21px] font-semibold tracking-[0.16em] text-[#F8F2E8]">CORAM DEO</span>
        {!compact && <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.28em] text-[#C9AA72]">Estudo · vida · eternidade</span>}
      </span>
    </div>
  );
}

function ResearchPreview() {
  return (
    <div className="relative overflow-hidden rounded-[30px] border border-[#C9AA72]/25 bg-[#0B1119] shadow-[0_32px_100px_rgba(0,0,0,.42)]">
      <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
        <BrandMark compact />
        <div className="flex gap-1.5"><span className="h-2 w-2 rounded-full bg-[#C9AA72]/60"/><span className="h-2 w-2 rounded-full bg-white/15"/><span className="h-2 w-2 rounded-full bg-white/15"/></div>
      </div>
      <div className="grid min-h-[430px] md:grid-cols-[150px_1fr]">
        <aside className="hidden border-r border-white/8 p-4 md:block">
          {['Início','Estudar','Devocional','Biblioteca','Favoritos','Planos'].map((item, index) => <div key={item} className={`mb-2 rounded-xl px-3 py-2.5 text-[11px] ${index===1?'bg-[#C9AA72]/10 text-[#E4C58C]':'text-white/45'}`}>{item}</div>)}
        </aside>
        <div className="p-5 sm:p-7">
          <div className="text-[10px] font-bold uppercase tracking-[.24em] text-[#C9AA72]">Pesquisa com Zion</div>
          <h3 className="mt-3 font-serif text-2xl text-[#F8F2E8] sm:text-3xl">Romanos 8:28</h3>
          <p className="mt-2 max-w-xl text-xs leading-6 text-white/48">“Todas as coisas cooperam para o bem” — o que Paulo está dizendo dentro do argumento de Romanos 8?</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[['01','Visão geral'],['04','Histórico-cultural'],['06','Línguas bíblicas'],['07','Teologia'],['08','Conexões bíblicas'],['16','Fontes e evidências']].map(([n,t]) => <div key={n} className="rounded-2xl border border-white/8 bg-white/[.025] p-4"><span className="text-[10px] font-bold tracking-[.2em] text-[#C9AA72]">{n}</span><p className="mt-2 text-xs font-semibold text-[#F8F2E8]">{t}</p><div className="mt-3 h-1.5 w-full rounded-full bg-white/6"><div className="h-full w-3/4 rounded-full bg-[#C9AA72]/55"/></div></div>)}
          </div>
          <div className="mt-5 rounded-2xl border border-[#C9AA72]/15 bg-[#C9AA72]/[.055] p-4 text-xs leading-6 text-white/55"><strong className="text-[#E7C98F]">Evidência ≠ interpretação.</strong> O Zion separa contexto, tradição, hipótese e aplicação para que profundidade não vire exagero.</div>
        </div>
      </div>
    </div>
  );
}

export default function PublicSite() {
  return (
    <main className="min-h-screen bg-[#F2EBDD] text-[#11151A]">
      <header className="sticky top-0 z-50 border-b border-white/8 bg-[#080D13]/90 text-white backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <a href="#top" className="text-[#D5B579]" aria-label="Coram Deo — início"><BrandMark /></a>
          <nav className="hidden items-center gap-7 text-[13px] text-white/65 lg:flex">
            <a href="#zion" className="transition hover:text-[#E4C58C]">Zion</a><a href="#camadas" className="transition hover:text-[#E4C58C]">16 camadas</a><a href="#recursos" className="transition hover:text-[#E4C58C]">Recursos</a><a href="#planos" className="transition hover:text-[#E4C58C]">Planos</a><a href="#faq" className="transition hover:text-[#E4C58C]">FAQ</a>
          </nav>
          <div className="flex items-center gap-2"><Link href="/login" className="hidden rounded-full border border-white/15 px-5 py-2.5 text-xs font-semibold text-white sm:inline-flex">Entrar</Link><Link href="/login?trial=1" className="rounded-full bg-[#D5B579] px-5 py-2.5 text-xs font-bold text-[#11151A] transition hover:bg-[#E4C58C]">7 dias grátis</Link></div>
        </div>
      </header>

      <section id="top" className="relative overflow-hidden bg-[#080D13] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(213,181,121,.13),transparent_28%),radial-gradient(circle_at_90%_35%,rgba(213,181,121,.07),transparent_24%)]" />
        <div className="absolute inset-0 opacity-[.055] [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:48px_48px]"/>
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-[.9fr_1.1fr] lg:py-32">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.28em] text-[#D5B579]">7 dias grátis · sem cartão</p>
            <h1 className="mt-6 max-w-3xl font-serif text-5xl font-semibold leading-[.98] tracking-[-.035em] text-[#F8F2E8] sm:text-6xl lg:text-[76px]">Mais que respostas. <span className="text-[#D5B579]">Uma jornada mais profunda na Palavra.</span></h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">Experimente o Coram Deo por 7 dias, sem cartão. Estude com o Zion, use os devocionais, a biblioteca e as ferramentas de continuidade antes de decidir se quer continuar.</p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/45">No centro dessa experiência está o <strong className="text-white/75">Zion</strong>: uma inteligência de pesquisa bíblica que organiza cada investigação em 16 camadas de estudo.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link href="/login?trial=1" className="rounded-full bg-[#D5B579] px-7 py-4 text-center text-sm font-bold text-[#11151A] transition hover:bg-[#E7C98F]">Começar 7 dias grátis →</Link><a href="#zion" className="rounded-full border border-white/15 px-7 py-4 text-center text-sm font-semibold text-white/85 transition hover:border-[#D5B579]/60">Conhecer o Zion</a></div>
            <div className="mt-5 text-xs text-white/40">Sem cartão · sem cobrança automática · depois você decide se quer assinar.</div>
            <div className="mt-6 flex flex-wrap gap-3 text-[11px] text-white/50"><span>◈ 16 camadas</span><span>◈ Contexto e evidências</span><span>◈ Hebraico e grego</span><span>◈ Aplicação para a vida real</span></div>
          </div>
          <div className="relative"><div className="absolute -inset-8 rounded-full bg-[#D5B579]/8 blur-3xl"/><ResearchPreview/></div>
        </div>
      </section>

      <section id="zion" className="border-b border-[#D8CDBB] bg-[#F2EBDD] px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.82fr_1.18fr] lg:items-center">
          <div><p className="text-[11px] font-bold uppercase tracking-[.28em] text-[#8B6A34]">Conheça o Zion</p><h2 className="mt-4 max-w-lg font-serif text-4xl font-semibold leading-[1.02] tracking-[-.025em] sm:text-5xl">Seu companheiro de pesquisa bíblica.</h2><p className="mt-6 max-w-xl text-[15px] leading-8 text-[#58534B]">Você faz uma pergunta. O Zion organiza a investigação em contexto, línguas bíblicas, teologia, conexões, tradições, arqueologia, aplicação e fontes — mantendo distinções claras entre o que o texto afirma e o que é interpretação.</p><div className="mt-8 grid grid-cols-2 gap-3 text-xs text-[#514B43]"><span className="rounded-2xl border border-[#D8CDBB] bg-white/35 p-4">16 camadas conectadas</span><span className="rounded-2xl border border-[#D8CDBB] bg-white/35 p-4">4 modos de estudo</span><span className="rounded-2xl border border-[#D8CDBB] bg-white/35 p-4">Fontes e evidências</span><span className="rounded-2xl border border-[#D8CDBB] bg-white/35 p-4">Sem “códigos secretos”</span></div></div>
          <blockquote className="rounded-[34px] bg-[#0B1119] p-8 text-white shadow-[0_30px_90px_rgba(14,18,22,.18)] md:p-11"><p className="text-[11px] font-bold uppercase tracking-[.25em] text-[#D5B579]">O princípio</p><p className="mt-7 font-serif text-3xl leading-tight text-[#F8F2E8] sm:text-4xl">“Examinai tudo. Retende o que é bom.”</p><p className="mt-4 text-sm text-white/45">1 Tessalonicenses 5:21</p><div className="mt-9 border-t border-white/10 pt-7 text-sm leading-7 text-white/55">O Zion não tenta impressionar inventando certezas. Quando existe debate, hipótese ou limitação de evidência, a pesquisa deve deixar isso explícito.</div></blockquote>
        </div>
      </section>

      <section id="camadas" className="bg-[#0B1119] px-5 py-20 text-white md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl"><div className="max-w-3xl"><p className="text-[11px] font-bold uppercase tracking-[.28em] text-[#D5B579]">Por que 16 camadas?</p><h2 className="mt-4 font-serif text-4xl font-semibold tracking-[-.025em] text-[#F8F2E8] sm:text-5xl">Porque profundidade não cabe em uma resposta rasa.</h2><p className="mt-5 text-[15px] leading-8 text-white/52">Uma passagem pode exigir história, gênero literário, idioma original, teologia, conexões e fontes. O Zion organiza essas perspectivas sem misturá-las.</p></div><div className="mt-12 grid gap-px overflow-hidden rounded-[28px] border border-white/8 bg-white/8 sm:grid-cols-2 lg:grid-cols-4">{layers.map(([n,title,desc]) => <article key={n} className="bg-[#0B1119] p-6 transition hover:bg-[#111922]"><span className="text-[10px] font-bold tracking-[.24em] text-[#D5B579]">{n}</span><h3 className="mt-4 font-serif text-xl font-semibold text-[#F8F2E8]">{title}</h3><p className="mt-3 text-xs leading-6 text-white/42">{desc}</p></article>)}</div></div>
      </section>

      <section id="exemplo" className="bg-[#EAE0CF] px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl"><div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-start"><div className="lg:sticky lg:top-28"><p className="text-[11px] font-bold uppercase tracking-[.28em] text-[#8B6A34]">Veja antes de começar</p><h2 className="mt-4 font-serif text-4xl font-semibold leading-[1.02] tracking-[-.025em] sm:text-5xl">Uma pesquisa completa muda a percepção do texto.</h2><p className="mt-5 text-sm leading-7 text-[#5C554B]">Veja como uma pergunta simples se transforma em uma investigação estruturada. Depois, use seus 7 dias gratuitos para experimentar a experiência completa por conta própria.</p><Link href="/login?trial=1" className="mt-8 inline-flex rounded-full bg-[#111820] px-7 py-4 text-sm font-bold text-[#F8F2E8]">Começar 7 dias grátis →</Link></div><div className="rounded-[34px] border border-[#CFC1AB] bg-[#F7F1E7] p-5 shadow-[0_26px_90px_rgba(83,65,38,.12)] sm:p-8"><div className="rounded-2xl bg-[#111820] p-6 text-white"><p className="text-[10px] font-bold uppercase tracking-[.25em] text-[#D5B579]">Exemplo de estudo</p><h3 className="mt-3 font-serif text-3xl text-[#F8F2E8]">Romanos 8:28</h3><p className="mt-3 text-sm leading-7 text-white/50">Como compreender “todas as coisas cooperam para o bem” sem transformar o verso em uma promessa desconectada de Romanos 8:29?</p></div><div className="mt-5 space-y-3">{[["01 · Visão geral","Paulo não está prometendo que todo acontecimento será confortável; o argumento aponta para o propósito de Deus na conformação a Cristo."],["03 · Contexto do capítulo","A afirmação aparece em uma seção sobre sofrimento, esperança, intercessão e propósito divino."],["06 · Línguas bíblicas","A análise do texto grego deve considerar sintaxe, variantes e o sentido contextual — sem construir conclusões apenas sobre uma palavra isolada."],["16 · Fontes e evidências","O estudo distingue o que decorre diretamente do texto, o que é interpretação cristã e onde existem debates exegéticos."]].map(([t,d]) => <div key={t} className="rounded-2xl border border-[#D9CCB8] bg-white/45 p-5"><h4 className="font-serif text-lg font-semibold">{t}</h4><p className="mt-2 text-xs leading-6 text-[#61594F]">{d}</p></div>)}</div><a href="#camadas" className="mt-5 inline-flex text-xs font-bold text-[#7B5A29]">Ver as 16 camadas completas ↑</a></div></div></div>
      </section>

      <section id="recursos" className="bg-[#F2EBDD] px-5 py-20 md:px-8 md:py-28"><div className="mx-auto max-w-7xl"><div className="mx-auto max-w-3xl text-center"><p className="text-[11px] font-bold uppercase tracking-[.28em] text-[#8B6A34]">Mais que um estudo</p><h2 className="mt-4 font-serif text-4xl font-semibold tracking-[-.025em] sm:text-5xl">Um ecossistema para sua jornada diante da Palavra.</h2></div><div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{resources.map(([title,desc],index) => <article key={title} className="group rounded-[26px] border border-[#D8CDBB] bg-[#F8F3EA] p-7 transition hover:-translate-y-1 hover:border-[#B89A65]"><span className="text-[10px] font-bold tracking-[.24em] text-[#9A7941]">0{index+1}</span><h3 className="mt-5 font-serif text-2xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-[#625B52]">{desc}</p></article>)}</div></div></section>

      <section className="relative overflow-hidden bg-[#111820] px-5 py-20 text-white md:px-8 md:py-24"><div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(213,181,121,.1),transparent_40%)]"/><div className="relative mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center"><p className="font-serif text-3xl italic leading-tight text-[#F1E6D3] sm:text-4xl">“Buscai primeiro o Reino de Deus e a sua justiça.” <span className="mt-3 block font-sans text-xs not-italic tracking-[.16em] text-[#D5B579]">Mateus 6:33</span></p><p className="text-sm leading-7 text-white/52">O Coram Deo existe para ajudar você a conhecer mais a Deus através da Sua Palavra. A tecnologia está a serviço do estudo — não substitui a Bíblia, a igreja local, o pastor ou o discipulado.</p></div></section>

      <section id="planos" className="bg-[#EAE0CF] px-5 py-20 md:px-8 md:py-28"><div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><p className="text-[11px] font-bold uppercase tracking-[.28em] text-[#8B6A34]">Experimente antes de decidir</p><h2 className="mt-4 font-serif text-4xl font-semibold leading-[1.02] sm:text-5xl">7 dias para viver o Coram Deo por dentro.</h2><p className="mt-5 max-w-xl text-sm leading-7 text-[#5C554B]">Crie sua conta sem cartão, use o Coram Deo por 7 dias e conheça a experiência completa. Depois do período gratuito, você decide se quer continuar.</p></div><div className="rounded-[34px] bg-[#111820] p-8 text-white shadow-[0_28px_90px_rgba(37,30,21,.18)] md:p-10"><p className="text-[11px] font-bold uppercase tracking-[.24em] text-[#D5B579]">7 dias grátis · sem cartão</p><p className="mt-5 font-serif text-5xl font-semibold text-[#F8F2E8]">R$ 0<span className="ml-2 font-sans text-sm font-normal text-white/45">por 7 dias</span></p><p className="mt-3 text-sm text-white/45">Depois, R$ 24,99/mês se você decidir continuar.</p><div className="mt-7 grid gap-3 text-sm text-white/65 sm:grid-cols-2">{['Pesquisa com Zion','16 camadas de estudo','Devocionais','Biblioteca','Anotações e favoritos','Planos de leitura'].map(item => <div key={item} className="flex gap-2"><span className="text-[#D5B579]">✓</span>{item}</div>)}</div><Link href="/login?trial=1" className="mt-8 inline-flex w-full justify-center rounded-full bg-[#D5B579] px-7 py-4 text-sm font-bold text-[#11151A] transition hover:bg-[#E7C98F]">Começar meus 7 dias grátis →</Link><p className="mt-4 text-center text-[11px] leading-5 text-white/35">Sem cartão e sem cobrança automática. Ao final do teste, você pode assinar por R$ 24,99/mês via Kiwify.</p></div></div></section>

      <section id="faq" className="bg-[#F2EBDD] px-5 py-20 md:px-8 md:py-28"><div className="mx-auto max-w-5xl"><div className="text-center"><p className="text-[11px] font-bold uppercase tracking-[.28em] text-[#8B6A34]">Perguntas frequentes</p><h2 className="mt-4 font-serif text-4xl font-semibold sm:text-5xl">O que você precisa saber.</h2></div><div className="mt-10 divide-y divide-[#D6C9B6] border-y border-[#D6C9B6]">{faqs.map(([q,a]) => <details key={q} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-xl font-semibold marker:hidden"><span>{q}</span><span className="text-[#8B6A34] transition group-open:rotate-45">+</span></summary><p className="max-w-3xl pb-2 pt-3 text-sm leading-7 text-[#625B52]">{a}</p></details>)}</div></div></section>

      <footer className="bg-[#080D13] px-5 py-10 text-white md:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-8 border-b border-white/8 pb-8 md:flex-row md:items-center md:justify-between"><div className="text-[#D5B579]"><BrandMark /></div><p className="font-serif text-xl italic text-white/55">Tudo para a glória de Deus.</p></div><div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 pt-7 text-xs text-white/38 sm:flex-row"><p>© 2026 Coram Deo.</p><div className="flex flex-wrap gap-5"><Link href="/termos">Termos de Uso</Link><Link href="/privacidade">Privacidade</Link><Link href="/login">Entrar</Link></div></div></footer>
    </main>
  );
}
