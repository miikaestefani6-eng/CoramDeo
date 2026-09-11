'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const questions = [
  { key: 'biblical_familiarity', title: 'Como você descreveria sua jornada bíblica?', options: ['Estou começando e sei pouco','Conheço algumas coisas e quero aprender mais','Já estudo a Bíblia com frequência','Quero aprofundar meu conhecimento teológico'] },
  { key: 'objective', title: 'O que você deseja alcançar com o Coram Deo?', options: ['Conhecer melhor a Bíblia','Fortalecer minha vida cristã','Aprofundar-me em teologia','Preparar-me melhor para servir'] },
  { key: 'study_time', title: 'Quanto tempo você pretende estudar hoje?', options: ['5 minutos','10 minutos','30 minutos','1 hora ou mais'] },
] as const

function Brand() {
  return <div className="flex items-center gap-3 text-[#D5B579]"><svg aria-hidden="true" viewBox="0 0 64 72" className="h-11 w-10" fill="none"><path d="M10 61V24C10 12.4 19.4 3 31 3h2c11.6 0 21 9.4 21 21v37" stroke="currentColor" strokeWidth="2.4"/><path d="M16 60V25c0-8.8 7.2-16 16-16s16 7.2 16 16v35" stroke="currentColor" strokeWidth="1.5" opacity=".65"/><path d="M15 59c8-4.4 13.7-4.5 17-.2 3.3-4.3 9-4.2 17 .2v6c-8-4.3-13.7-4.4-17-.1-3.3-4.3-9-4.2-17 .1v-6Z" fill="currentColor"/><path d="M32 20l2.7 8.3L43 31l-8.3 2.7L32 42l-2.7-8.3L21 31l8.3-2.7L32 20Z" fill="currentColor"/></svg><span><span className="block font-serif text-xl font-semibold tracking-[.16em] text-[#F8F2E8]">CORAM DEO</span><span className="mt-1 block text-[9px] font-semibold uppercase tracking-[.28em] text-[#C9AA72]">Estudo · vida · eternidade</span></span></div>
}

export default function OnboardingPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const question = questions[step]
  const selected = answers[question.key]
  const isLast = step === questions.length - 1

  function choose(value: string) { setAnswers((current) => ({ ...current, [question.key]: value })); setError('') }

  async function finish() {
    if (!selected) return
    setSaving(true); setError('')
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Sua sessão não foi encontrada. Entre novamente para continuar.'); setSaving(false); return }
    const { error: saveError } = await supabase.from('profiles').update({ biblical_familiarity: answers.biblical_familiarity, objective: answers.objective, study_time: answers.study_time, onboarding_completed: true }).eq('id', user.id)
    if (saveError) { setError('Não conseguimos salvar sua jornada agora. Tente novamente.'); setSaving(false); return }
    setDone(true); setSaving(false)
  }

  if (done) return <main className="flex min-h-screen items-center justify-center bg-[#080D13] px-5 text-[#F8F2E8]"><section className="w-full max-w-2xl rounded-[32px] border border-[#C9AA72]/18 bg-[#0D141C] p-8 text-center shadow-[0_30px_90px_rgba(0,0,0,.35)] sm:p-12"><div className="mx-auto w-fit"><Brand /></div><p className="mt-8 text-[11px] font-bold uppercase tracking-[.28em] text-[#D5B579]">Sua jornada está pronta</p><h1 className="mt-4 font-serif text-4xl font-semibold">Agora o Coram Deo começa a conhecer você.</h1><p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/48">Suas respostas foram salvas para adaptar a experiência aos seus objetivos e ao nível de familiaridade com a Bíblia.</p><button onClick={() => window.location.href = '/'} className="mt-8 rounded-full bg-[#D5B579] px-7 py-4 text-sm font-bold text-[#111820]">Entrar no Coram Deo →</button></section></main>

  return <main className="min-h-screen bg-[#080D13] px-5 py-8 text-[#F8F2E8] sm:px-8"><div className="mx-auto max-w-5xl"><header className="flex items-center justify-between border-b border-white/8 pb-5"><Brand /><span className="text-[10px] font-bold uppercase tracking-[.22em] text-white/30">Configuração inicial</span></header><div className="grid gap-10 py-12 lg:grid-cols-[.7fr_1.3fr] lg:items-start"><div><p className="text-[11px] font-bold uppercase tracking-[.28em] text-[#D5B579]">Passo {step + 1} de {questions.length}</p><h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.05]">Vamos conhecer sua jornada.</h1><p className="mt-5 text-sm leading-7 text-white/45">Poucas respostas nos ajudam a ajustar a experiência sem transformar sua caminhada em um perfil rígido.</p><div className="mt-8 h-1 overflow-hidden rounded-full bg-white/8"><div className="h-full bg-[#D5B579] transition-all" style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div></div><section className="rounded-[30px] border border-[#C9AA72]/18 bg-[#0D141C] p-6 shadow-[0_25px_80px_rgba(0,0,0,.24)] sm:p-8"><h2 className="font-serif text-2xl font-semibold">{question.title}</h2><div className="mt-6 grid gap-3">{question.options.map((option) => { const active = selected === option; return <button key={option} type="button" onClick={() => choose(option)} className={`rounded-2xl border p-4 text-left text-sm leading-6 transition ${active ? 'border-[#D5B579] bg-[#D5B579] text-[#111820]' : 'border-white/9 bg-white/[.025] text-white/68 hover:border-[#D5B579]/40'}`}>{option}</button> })}</div>{error && <p className="mt-4 rounded-2xl border border-[#D5B579]/15 bg-[#D5B579]/6 p-3 text-sm text-[#E8D7B8]">{error}</p>}<div className="mt-7 flex items-center justify-between gap-3"><button type="button" disabled={step === 0} onClick={() => setStep((value) => value - 1)} className="rounded-full px-4 py-3 text-sm font-semibold text-white/45 disabled:invisible">Voltar</button>{!isLast ? <button type="button" disabled={!selected} onClick={() => setStep((value) => value + 1)} className="rounded-full bg-[#D5B579] px-6 py-3 text-sm font-bold text-[#111820] disabled:cursor-not-allowed disabled:opacity-35">Continuar →</button> : <button type="button" disabled={!selected || saving} onClick={finish} className="rounded-full bg-[#D5B579] px-6 py-3 text-sm font-bold text-[#111820] disabled:cursor-not-allowed disabled:opacity-35">{saving ? 'Configurando...' : 'Configurar minha jornada →'}</button>}</div></section></div></div></main>
}
