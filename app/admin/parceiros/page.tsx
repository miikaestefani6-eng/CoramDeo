"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? "";
const PARTNER_DISCOUNT = 10;
const emptyForm = { id:"", display_name:"", email:"", code:"", status:"active", commission_percent:20, contract_reference:"", contract_started_at:"", contract_ends_at:"", notes:"" };

type Redemption = {
  id:string; code:string; revenue_amount:number; payout_basis_amount:number; gross_commission_amount:number;
  discount_cost_amount:number; commission_amount:number; net_commission_percent:number; status:string;
  commission_status:string; commission_paid_at?:string|null; created_at:string;
};
type Coupon = { id:string; code:string; discount_percent:number; is_active:boolean; redemption_count:number; provider?:string|null; provider_sync_status?:string|null; provider_sync_error?:string|null; };
type Partner = {
  id:string; user_id?:string|null; email?:string|null; display_name:string; code:string; status:string;
  follower_discount_percent:number; commission_percent:number; discount_funded_by:"partner"|"coram_deo";
  net_commission_percent?:number; kiwify_coupon_status?:string|null; kiwify_coupon_id?:string|null;
  kiwify_coupon_synced_at?:string|null; kiwify_coupon_error?:string|null; contract_reference?:string|null;
  contract_started_at?:string|null; contract_ends_at?:string|null; notes?:string|null;
  coupons:Coupon[]; redemptions:Redemption[];
  stats:{ indications:number; active_sales:number; revenue:number; commission_total:number; commission_pending:number; commission_paid:number; };
};

async function headers(){
  const supabase=createClient();
  const {data:{session}}=await supabase.auth.getSession();
  if(!session?.access_token) throw new Error("Entre com uma conta administrativa.");
  return {Authorization:`Bearer ${session.access_token}`,"Content-Type":"application/json"};
}
async function api(init?:RequestInit){
  if(!SUPABASE_URL) throw new Error("Backend indisponível.");
  const response=await fetch(`${SUPABASE_URL}/functions/v1/coram-v1-admin-partners`,{...init,headers:{...(await headers()),...(init?.headers||{})},cache:"no-store"});
  const data=await response.json().catch(()=>({}));
  if(!response.ok) throw new Error(data?.error||"Não foi possível concluir a operação.");
  return data;
}
const money=(value:number)=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(Number(value||0));
const syncLabel=(status?:string|null)=>status==="synced"?"Sincronizado":status==="error"?"Erro":status==="disabled"?"Desativado":"Aguardando Kiwify";

export default function ParceirosAdminPage(){
  const [partners,setPartners]=useState<Partner[]>([]);
  const [form,setForm]=useState(emptyForm);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState("");
  const [message,setMessage]=useState("");

  async function load(){setLoading(true);setError("");try{const data=await api();setPartners(data.partners||[]);}catch(e){setError(e instanceof Error?e.message:"Não foi possível carregar os parceiros.");}finally{setLoading(false);}}
  useEffect(()=>{void load();},[]);

  const totals=useMemo(()=>partners.reduce((a,p)=>({partners:a.partners+1,sales:a.sales+p.stats.active_sales,revenue:a.revenue+Number(p.stats.revenue||0),pending:a.pending+Number(p.stats.commission_pending||0)}),{partners:0,sales:0,revenue:0,pending:0}),[partners]);
  const netPreview=Math.max(0,Number(form.commission_percent||0)-PARTNER_DISCOUNT);

  function edit(p:Partner){setForm({id:p.id,display_name:p.display_name,email:p.email||"",code:p.code,status:p.status,commission_percent:Number(p.commission_percent||20),contract_reference:p.contract_reference||"",contract_started_at:p.contract_started_at?.slice(0,10)||"",contract_ends_at:p.contract_ends_at?.slice(0,10)||"",notes:p.notes||""});window.scrollTo({top:0,behavior:"smooth"});}
  async function save(e:FormEvent){e.preventDefault();setSaving(true);setError("");setMessage("");try{await api({method:"POST",body:JSON.stringify({action:"save_partner",...form,code:form.code.toUpperCase(),contract_started_at:form.contract_started_at?`${form.contract_started_at}T00:00:00Z`:null,contract_ends_at:form.contract_ends_at?`${form.contract_ends_at}T23:59:59Z`:null})});setMessage(form.id?"Parceria atualizada.":"Parceiro cadastrado com cupom de 10%, acesso cortesia e regra de comissão.");setForm(emptyForm);await load();}catch(e){setError(e instanceof Error?e.message:"Não foi possível salvar o parceiro.");}finally{setSaving(false);}}
  async function setCommission(id:string,status:string){setSaving(true);setError("");try{await api({method:"POST",body:JSON.stringify({action:"commission_status",redemption_id:id,status})});await load();}catch(e){setError(e instanceof Error?e.message:"Não foi possível atualizar a comissão.");}finally{setSaving(false);}}
  async function remove(p:Partner){if(!window.confirm(`Excluir a parceria de ${p.display_name}?`))return;setSaving(true);setError("");try{await api({method:"POST",body:JSON.stringify({action:"delete_partner",id:p.id})});setMessage("Parceiro excluído.");await load();}catch(e){setError(e instanceof Error?e.message:"Não foi possível excluir o parceiro.");}finally{setSaving(false);}}
  async function copyLink(code:string){const origin=window.location.origin;await navigator.clipboard?.writeText(`${origin}/p/${encodeURIComponent(code)}`);setMessage("Link do parceiro copiado.");}

  return <main className="min-h-screen bg-[#F3EEE5] px-5 py-8 text-[#111820] lg:px-10"><div className="mx-auto max-w-7xl space-y-7">
    <header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#8B6A34]">Coram Deo B2B</p><h1 className="mt-2 font-serif text-4xl font-semibold">Parceiros, cupons e comissões</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-[#6B6259]">Cada parceiro tem código próprio, 10% de desconto para o indicado, acesso cortesia e comissão rastreada por venda.</p></div><a href="/admin" className="rounded-full border border-[#CFC1AD] bg-[#F7F1E7] px-4 py-2 text-xs font-bold">← Painel</a></header>

    {error&&<div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    {message&&<div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{message}</div>}

    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[["Parceiros",totals.partners],["Vendas atribuídas",totals.sales],["Receita atribuída",money(totals.revenue)],["Comissão a pagar",money(totals.pending)]].map(([l,v])=><article key={String(l)} className="rounded-[22px] border border-[#D5C8B5] bg-[#F7F1E7] p-5"><p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#8B6A34]">{l}</p><p className="mt-2 font-serif text-3xl font-semibold">{v}</p></article>)}</section>

    <section className="rounded-[24px] border border-[#CDBA9D] bg-[#111820] p-6 text-[#F8F2E8]"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#D5B579]">Regra comercial atual</p><div className="mt-4 grid gap-4 md:grid-cols-3"><div><p className="text-xs text-white/45">Desconto do cliente</p><p className="mt-1 font-serif text-2xl text-[#E7C98F]">10%</p><p className="mt-1 text-xs text-white/45">Fixo para todo parceiro.</p></div><div><p className="text-xs text-white/45">Quem custeia o desconto</p><p className="mt-1 font-serif text-2xl text-[#E7C98F]">Parceiro</p><p className="mt-1 text-xs text-white/45">O valor do desconto reduz o pagamento da comissão.</p></div><div><p className="text-xs text-white/45">Kiwify</p><p className="mt-1 font-serif text-2xl text-[#E7C98F]">Sincronização preparada</p><p className="mt-1 text-xs text-white/45">O CMS já controla o status; falta conectar a criação automática via API da Kiwify.</p></div></div></section>

    <form onSubmit={save} className="grid gap-4 rounded-[26px] border border-[#D5C8B5] bg-[#F7F1E7] p-6 md:grid-cols-2">
      <div className="md:col-span-2"><h2 className="font-serif text-2xl font-semibold">{form.id?"Editar parceiro":"Novo parceiro"}</h2><p className="mt-1 text-xs text-[#746A60]">Ao ativar uma conta vinculada, o acesso cortesia é concedido sem criar assinatura falsa.</p></div>
      <input required value={form.display_name} onChange={e=>setForm({...form,display_name:e.target.value})} className="rounded-xl border border-[#D5C8B5] bg-white px-4 py-3" placeholder="Nome do parceiro / organização"/>
      <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="rounded-xl border border-[#D5C8B5] bg-white px-4 py-3" placeholder="E-mail da conta Coram Deo (opcional)"/>
      <input required value={form.code} onChange={e=>setForm({...form,code:e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g,"")})} className="rounded-xl border border-[#D5C8B5] bg-white px-4 py-3 uppercase" placeholder="Código, ex.: IGREJA10"/>
      <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className="rounded-xl border border-[#D5C8B5] bg-white px-4 py-3"><option value="pending">Pendente</option><option value="active">Ativo</option><option value="paused">Pausado</option><option value="ended">Encerrado</option></select>
      <div className="rounded-xl border border-[#D5C8B5] bg-[#EFE5D7] px-4 py-3"><p className="text-[10px] font-bold uppercase tracking-wider text-[#8B6A34]">Desconto do indicado</p><p className="mt-1 font-serif text-2xl">10%</p><p className="text-xs text-[#746A60]">Fixo e custeado pelo parceiro.</p></div>
      <label className="text-xs font-semibold text-[#665E54]">Comissão contratada do parceiro (%)<input type="number" min="10" max="100" step="0.01" value={form.commission_percent} onChange={e=>setForm({...form,commission_percent:Number(e.target.value)})} className="mt-1 w-full rounded-xl border border-[#D5C8B5] bg-white px-4 py-3 text-sm"/><span className="mt-2 block font-normal text-[#746A60]">Com desconto custeado pelo parceiro, a referência líquida fica em <strong>{netPreview}%</strong> antes dos ajustes da transação real.</span></label>
      <input value={form.contract_reference} onChange={e=>setForm({...form,contract_reference:e.target.value})} className="rounded-xl border border-[#D5C8B5] bg-white px-4 py-3" placeholder="Referência do contrato (opcional)"/>
      <div className="grid grid-cols-2 gap-2"><label className="text-[10px] font-bold uppercase tracking-wider text-[#7B6F63]">Início<input type="date" value={form.contract_started_at} onChange={e=>setForm({...form,contract_started_at:e.target.value})} className="mt-1 w-full rounded-xl border border-[#D5C8B5] bg-white px-3 py-3 text-sm"/></label><label className="text-[10px] font-bold uppercase tracking-wider text-[#7B6F63]">Fim<input type="date" value={form.contract_ends_at} onChange={e=>setForm({...form,contract_ends_at:e.target.value})} className="mt-1 w-full rounded-xl border border-[#D5C8B5] bg-white px-3 py-3 text-sm"/></label></div>
      <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} className="rounded-xl border border-[#D5C8B5] bg-white px-4 py-3 md:col-span-2" rows={3} placeholder="Observações da parceria"/>
      <div className="flex flex-wrap gap-2 md:col-span-2"><button disabled={saving} className="rounded-full bg-[#111820] px-6 py-3 text-sm font-bold text-[#F8F2E8] disabled:opacity-50">{saving?"Salvando...":form.id?"Salvar alterações":"Cadastrar parceiro"}</button>{form.id&&<button type="button" onClick={()=>setForm(emptyForm)} className="rounded-full border border-[#CFC1AD] px-6 py-3 text-sm font-bold">Cancelar</button>}</div>
    </form>

    <section className="space-y-4"><div><h2 className="font-serif text-2xl font-semibold">Parceiros cadastrados</h2><p className="mt-1 text-xs text-[#746A60]">O histórico financeiro permanece preservado se a parceria for encerrada.</p></div>
      {loading?<div className="rounded-2xl border border-[#D5C8B5] bg-[#F7F1E7] p-8 text-sm">Carregando...</div>:partners.map(p=>{
        const coupon=p.coupons?.[0]; const sync=coupon?.provider_sync_status||p.kiwify_coupon_status;
        return <article key={p.id} className="overflow-hidden rounded-[26px] border border-[#D5C8B5] bg-[#F7F1E7]"><div className="grid gap-5 p-6 lg:grid-cols-[1.4fr_.8fr]"><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-serif text-2xl font-semibold">{p.display_name}</h3><span className="rounded-full border border-[#CDBA9D] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider">{p.status}</span><span className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${sync==='synced'?'bg-emerald-100 text-emerald-800':sync==='error'?'bg-red-100 text-red-700':'bg-amber-100 text-amber-800'}`}>{syncLabel(sync)}</span></div><p className="mt-2 text-xs text-[#746A60]">{p.email||"Sem conta vinculada"} · cupom <strong>{p.code}</strong></p><div className="mt-5 grid gap-3 sm:grid-cols-4"><div><p className="text-[9px] uppercase tracking-wider text-[#8B6A34]">Cliente</p><p className="mt-1 font-semibold">10% desconto</p></div><div><p className="text-[9px] uppercase tracking-wider text-[#8B6A34]">Comissão bruta</p><p className="mt-1 font-semibold">{Number(p.commission_percent)}%</p></div><div><p className="text-[9px] uppercase tracking-wider text-[#8B6A34]">Referência líquida</p><p className="mt-1 font-semibold">{Number(p.net_commission_percent??Math.max(0,Number(p.commission_percent)-10))}%</p></div><div><p className="text-[9px] uppercase tracking-wider text-[#8B6A34]">Acesso</p><p className="mt-1 font-semibold">{p.status==='active'&&p.user_id?'Cortesia ativa':p.user_id?'Vinculado':'Aguardando conta'}</p></div></div>{sync==='error'&&(coupon?.provider_sync_error||p.kiwify_coupon_error)&&<p className="mt-3 text-xs text-red-700">Kiwify: {coupon?.provider_sync_error||p.kiwify_coupon_error}</p>}</div><div className="grid grid-cols-2 gap-3 rounded-[20px] bg-[#111820] p-4 text-white"><div><p className="text-[9px] uppercase tracking-wider text-white/40">Conversões</p><p className="mt-1 font-serif text-2xl text-[#E7C98F]">{p.stats.active_sales}</p></div><div><p className="text-[9px] uppercase tracking-wider text-white/40">Receita</p><p className="mt-1 font-serif text-xl text-[#E7C98F]">{money(p.stats.revenue)}</p></div><div><p className="text-[9px] uppercase tracking-wider text-white/40">A pagar</p><p className="mt-1 font-semibold">{money(p.stats.commission_pending)}</p></div><div><p className="text-[9px] uppercase tracking-wider text-white/40">Pago</p><p className="mt-1 font-semibold">{money(p.stats.commission_paid)}</p></div></div></div>
        <div className="flex flex-wrap gap-2 border-t border-[#D5C8B5] px-6 py-4"><button onClick={()=>edit(p)} className="rounded-full border border-[#CDBA9D] px-4 py-2 text-xs font-bold">Editar parceria</button><button onClick={()=>copyLink(p.code)} className="rounded-full border border-[#CDBA9D] px-4 py-2 text-xs font-bold">Copiar link</button><button onClick={()=>navigator.clipboard?.writeText(p.code)} className="rounded-full border border-[#CDBA9D] px-4 py-2 text-xs font-bold">Copiar cupom</button>{!p.redemptions.length&&<button onClick={()=>remove(p)} className="rounded-full border border-red-200 px-4 py-2 text-xs font-bold text-red-700">Excluir</button>}</div>
        {p.redemptions.length>0&&<div className="border-t border-[#D5C8B5] p-6"><h4 className="font-serif text-lg font-semibold">Indicações e comissões</h4><div className="mt-3 overflow-x-auto"><table className="w-full min-w-[900px] text-left text-xs"><thead><tr className="border-b border-[#D5C8B5] uppercase tracking-wider text-[#7A7066]"><th className="py-2">Data</th><th>Venda</th><th>Comissão bruta</th><th>Custo cupom</th><th>Líquido</th><th>Situação</th><th>Ação</th></tr></thead><tbody>{p.redemptions.map(r=><tr key={r.id} className="border-b border-[#E5D9C8]"><td className="py-3">{new Date(r.created_at).toLocaleDateString("pt-BR")}</td><td>{money(r.revenue_amount)}</td><td>{money(r.gross_commission_amount)}</td><td>- {money(r.discount_cost_amount)}</td><td className="font-semibold">{money(r.commission_amount)}</td><td>{r.commission_status}</td><td><div className="flex gap-1">{r.commission_status==='pending'&&<button disabled={saving} onClick={()=>setCommission(r.id,'approved')} className="rounded-lg border px-2 py-1">Aprovar</button>}{r.commission_status==='approved'&&<button disabled={saving} onClick={()=>setCommission(r.id,'paid')} className="rounded-lg bg-[#111820] px-2 py-1 text-white">Marcar pago</button>}{r.commission_status!=='paid'&&r.commission_status!=='void'&&<button disabled={saving} onClick={()=>setCommission(r.id,'void')} className="rounded-lg border border-red-200 px-2 py-1 text-red-700">Anular</button>}</div></td></tr>)}</tbody></table></div></div>}
        </article>})}
      {!loading&&!partners.length&&<div className="rounded-[26px] border border-dashed border-[#CDBA9D] bg-[#F7F1E7] p-10 text-center"><p className="font-serif text-xl">Nenhum parceiro cadastrado ainda.</p><p className="mt-2 text-sm text-[#746A60]">O primeiro aparecerá aqui com cupom próprio, acesso cortesia, link e regra financeira.</p></div>}
    </section>
  </div></main>;
}
