"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Asset = {
  id: string;
  kind: string;
  title: string;
  description?: string | null;
  external_url?: string | null;
  storage_path?: string | null;
  author_name?: string | null;
  category?: string | null;
  status: string;
  access_tier: string;
  is_featured: boolean;
  sort_order: number;
};

const emptyForm = {
  id: "",
  kind: "pdf",
  title: "",
  description: "",
  external_url: "",
  storage_path: "",
  author_name: "",
  category: "",
  status: "draft",
  access_tier: "basic",
  is_featured: false,
  sort_order: 100,
};

export default function AdminConteudosPage() {
  const supabase = createClient();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true); setError("");
    const { data, error } = await supabase.from("coram_content_assets").select("id,kind,title,description,external_url,storage_path,author_name,category,status,access_tier,is_featured,sort_order").order("sort_order").order("created_at", { ascending: false });
    if (error) setError("Não foi possível carregar o acervo administrativo.");
    setAssets((data as Asset[]) || []); setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function edit(asset: Asset) {
    setFile(null);
    setForm({ id: asset.id, kind: asset.kind, title: asset.title, description: asset.description || "", external_url: asset.external_url || "", storage_path: asset.storage_path || "", author_name: asset.author_name || "", category: asset.category || "", status: asset.status, access_tier: asset.access_tier, is_featured: asset.is_featured, sort_order: asset.sort_order });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(event: FormEvent) {
    event.preventDefault(); setSaving(true); setError(""); setMessage("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Sessão administrativa inválida."); setSaving(false); return; }
    let storagePath = form.storage_path || null;
    if (file) {
      if (file.type !== "application/pdf") { setError("Para PDF/E-book, envie um arquivo PDF."); setSaving(false); return; }
      if (file.size > 50 * 1024 * 1024) { setError("O arquivo deve ter no máximo 50 MB."); setSaving(false); return; }
      const safeName = file.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]/g, "-");
      storagePath = `${user.id}/${crypto.randomUUID()}-${safeName}`;
      const { error: uploadError } = await supabase.storage.from("coram-content").upload(storagePath, file, { contentType: "application/pdf", upsert: false });
      if (uploadError) { setError(uploadError.message || "Não foi possível enviar o arquivo."); setSaving(false); return; }
    }
    const externalUrl = file ? null : (form.external_url.trim() || null);
    const payload = { kind: form.kind, title: form.title.trim(), description: form.description.trim() || null, external_url: externalUrl, storage_path: storagePath, source_type: storagePath ? "upload" : externalUrl ? "external" : "upload", author_name: form.author_name.trim() || null, category: form.category.trim() || null, status: form.status, access_tier: form.access_tier, is_featured: form.is_featured, sort_order: Number(form.sort_order) || 100, updated_at: new Date().toISOString(), ...(form.id ? {} : { created_by: user.id }), ...(form.status === "published" ? { published_at: new Date().toISOString() } : {}) };
    const result = form.id ? await supabase.from("coram_content_assets").update(payload).eq("id", form.id) : await supabase.from("coram_content_assets").insert(payload);
    if (result.error) { if (file && storagePath) await supabase.storage.from("coram-content").remove([storagePath]); setError(result.error.message || "Não foi possível salvar o conteúdo."); }
    else { setMessage(form.id ? "Conteúdo atualizado." : "Conteúdo criado e disponível no acervo conforme o status escolhido."); setForm(emptyForm); setFile(null); await load(); }
    setSaving(false);
  }

  async function remove(id: string) {
    if (!window.confirm("Excluir este conteúdo do acervo?")) return;
    const asset = assets.find(item => item.id === id);
    const { error } = await supabase.from("coram_content_assets").delete().eq("id", id);
    if (error) setError("Não foi possível excluir o conteúdo."); else { if (asset?.storage_path) await supabase.storage.from("coram-content").remove([asset.storage_path]); await load(); }
  }

  return <main className="min-h-screen bg-[#F6F5F2] px-5 py-8 text-[#0F2131] lg:px-10"><div className="mx-auto max-w-6xl space-y-7">
    <header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C4A47C]">CMS V1</p><h1 className="mt-2 font-serif text-3xl font-bold">Biblioteca e conteúdos</h1><p className="mt-2 text-sm text-[#5E6E82]">Envie e-books/PDFs, cadastre links, edite, publique e organize o acervo.</p></div><a href="/admin" className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold">Voltar ao painel</a></header>
    {error && <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}{message && <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">{message}</div>}
    <form onSubmit={save} className="grid gap-4 rounded-2xl border bg-white p-6 shadow-sm md:grid-cols-2"><input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="rounded-xl border px-4 py-3" placeholder="Título"/><select value={form.kind} onChange={e=>setForm({...form,kind:e.target.value})} className="rounded-xl border px-4 py-3"><option value="pdf">PDF</option><option value="ebook">E-book</option><option value="video">Vídeo</option></select><input value={form.author_name} onChange={e=>setForm({...form,author_name:e.target.value})} className="rounded-xl border px-4 py-3" placeholder="Autor / canal"/><input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="rounded-xl border px-4 py-3" placeholder="Categoria"/><div className="md:col-span-2 rounded-xl border border-dashed p-4"><label className="text-sm font-semibold">Arquivo PDF / E-book</label><input type="file" accept="application/pdf,.pdf" onChange={e=>setFile(e.target.files?.[0] || null)} className="mt-2 block w-full text-sm"/><p className="mt-2 text-xs text-[#6A7885]">Até 50 MB. O arquivo fica privado e é entregue ao aluno por link temporário seguro.{form.storage_path && !file ? " Este conteúdo já possui um arquivo enviado." : ""}</p></div><input value={form.external_url} onChange={e=>setForm({...form,external_url:e.target.value})} disabled={!!file} className="rounded-xl border px-4 py-3 md:col-span-2 disabled:bg-slate-50 disabled:text-slate-400" placeholder="Ou use uma URL externa (opcional)"/><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="rounded-xl border px-4 py-3 md:col-span-2" rows={4} placeholder="Descrição"/><select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className="rounded-xl border px-4 py-3"><option value="draft">Rascunho</option><option value="published">Publicado</option><option value="archived">Arquivado</option></select><select value={form.access_tier} onChange={e=>setForm({...form,access_tier:e.target.value})} className="rounded-xl border px-4 py-3"><option value="basic">Básico</option><option value="premium">Premium</option><option value="exclusive">Exclusivo</option></select><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_featured} onChange={e=>setForm({...form,is_featured:e.target.checked})}/> Destaque</label><input type="number" value={form.sort_order} onChange={e=>setForm({...form,sort_order:Number(e.target.value)})} className="rounded-xl border px-4 py-3" placeholder="Ordem"/><div className="flex gap-2 md:col-span-2"><button disabled={saving} className="rounded-xl bg-[#8C183F] px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{saving ? "Salvando..." : form.id ? "Salvar alterações" : "Criar conteúdo"}</button>{form.id && <button type="button" onClick={()=>{setForm(emptyForm);setFile(null);}} className="rounded-xl border px-5 py-3 text-sm font-semibold">Cancelar edição</button>}</div></form>
    <section className="rounded-2xl border bg-white p-6 shadow-sm"><h2 className="font-serif text-2xl font-bold">Acervo</h2>{loading ? <p className="mt-5 text-sm">Carregando...</p> : <div className="mt-5 space-y-3">{assets.map(a=><article key={a.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4"><div><p className="font-semibold">{a.title}</p><p className="mt-1 text-xs text-[#6A7885]">{a.kind} · {a.status} · {a.access_tier}{a.category ? ` · ${a.category}` : ""}{a.storage_path ? " · arquivo enviado" : a.external_url ? " · link externo" : ""}</p></div><div className="flex gap-2"><button onClick={()=>edit(a)} className="rounded-lg border px-3 py-2 text-xs font-semibold">Editar</button><button onClick={()=>remove(a.id)} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700">Excluir</button></div></article>)}{!assets.length && <p className="text-sm text-[#6A7885]">Nenhum conteúdo cadastrado.</p>}</div>}</section>
  </div></main>;
}
