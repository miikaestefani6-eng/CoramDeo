import Link from "next/link";

export default function AssinaturaPage() {
  const checkoutUrl = process.env.NEXT_PUBLIC_KIWIFY_CHECKOUT_URL;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0F2131] px-5 py-10">
      <section className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-2xl sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C4A47C]">Coram Deo</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-[#0F2131]">Sua jornada começa aqui.</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#5E6E82]">
          Sua conta já está criada. Para acessar os estudos, devocionais, biblioteca e demais recursos do Coram Deo, ative sua assinatura.
        </p>

        {checkoutUrl ? (
          <a
            href={checkoutUrl}
            className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-[#8C183F] px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Assinar o Coram Deo
          </a>
        ) : (
          <div className="mt-7 rounded-xl bg-[#F8F9FA] p-4 text-sm text-[#5E6E82]">
            O checkout ainda não foi configurado neste ambiente.
          </div>
        )}

        <Link href="/login" className="mt-5 inline-block text-sm font-semibold text-[#8C183F]">
          Voltar para o acesso
        </Link>
      </section>
    </main>
  );
}
