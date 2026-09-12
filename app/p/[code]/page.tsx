import Link from "next/link";

type PageProps = { params: Promise<{ code: string }> };
type PartnerPayload = { ok?: boolean; partner?: { display_name: string; code: string; discount_percent: number }; error?: string };

function buildCheckout(base: string, code: string) {
  const url = new URL(base);
  url.searchParams.set("coupon", code);
  url.searchParams.set("src", `coram_partner_${code}`);
  url.searchParams.set("utm_source", "coram_partner");
  url.searchParams.set("utm_medium", "referral");
  url.searchParams.set("utm_campaign", "partners");
  url.searchParams.set("utm_content", code);
  return url.toString();
}

export default async function PartnerReferralPage({ params }: PageProps) {
  const { code: rawCode } = await params;
  const code = decodeURIComponent(rawCode || "").toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 25);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") || "";
  const checkoutBase = process.env.NEXT_PUBLIC_KIWIFY_CHECKOUT_URL || "";
  let payload: PartnerPayload = {};

  if (supabaseUrl && code) {
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/coram-v1-partner-referral?code=${encodeURIComponent(code)}`, { cache: "no-store" });
      payload = await response.json().catch(() => ({}));
      if (!response.ok) payload = { error: payload.error || "Este link de parceria não está disponível." };
    } catch {
      payload = { error: "Não foi possível validar este link agora." };
    }
  } else {
    payload = { error: "Link de parceria inválido." };
  }

  const partner = payload.partner;
  const checkoutUrl = partner && checkoutBase ? buildCheckout(checkoutBase, partner.code) : "";

  return (
    <main className="min-h-screen bg-[#080D13] px-5 py-10 text-[#F8F2E8]">
      <div className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">
        <section className="w-full rounded-[34px] border border-[#C9AA72]/25 bg-[#0D141C] p-7 shadow-[0_35px_110px_rgba(0,0,0,.35)] sm:p-10">
          <p className="text-[10px] font-bold uppercase tracking-[.28em] text-[#D5B579]">Coram Deo · indicação de parceiro</p>
          {partner ? <>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight">Você chegou ao Coram Deo por indicação de <span className="text-[#D5B579]">{partner.display_name}</span>.</h1>
            <p className="mt-5 text-sm leading-7 text-white/55">Seu benefício de parceiro está vinculado ao código <strong className="text-white">{partner.code}</strong>{partner.discount_percent > 0 ? <> e dá <strong className="text-[#E7C98F]">{partner.discount_percent}% de desconto</strong> no checkout.</> : "."}</p>
            <div className="mt-7 rounded-[22px] border border-white/10 bg-white/[.04] p-5"><p className="text-xs leading-6 text-white/50">Ao continuar, o checkout recebe automaticamente o cupom e a identificação da parceria. Isso permite aplicar o benefício e atribuir a venda ao parceiro corretamente.</p></div>
            {checkoutUrl ? <a href={checkoutUrl} className="mt-7 inline-flex w-full justify-center rounded-full bg-[#D5B579] px-6 py-4 text-sm font-bold text-[#111820] transition hover:bg-[#E7C98F]">Continuar para o checkout →</a> : <div className="mt-7 rounded-2xl border border-white/10 p-4 text-center text-sm text-white/55">O checkout ainda não está configurado neste ambiente.</div>}
          </> : <>
            <h1 className="mt-4 font-serif text-4xl font-semibold">Este link de parceria não está ativo.</h1>
            <p className="mt-5 text-sm leading-7 text-white/55">{payload.error || "Confira o código recebido ou acesse o Coram Deo normalmente."}</p>
            <Link href="/site" className="mt-7 inline-flex rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white/80">Conhecer o Coram Deo</Link>
          </>}
          <p className="mt-7 text-center text-[10px] uppercase tracking-[.18em] text-white/25">Tudo para a glória de Deus.</p>
        </section>
      </div>
    </main>
  );
}
