'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const questions = [
  {
    key: 'biblical_familiarity',
    title: 'Como você descreveria sua jornada bíblica?',
    options: [
      'Estou começando e sei pouco',
      'Conheço algumas coisas e quero aprender mais',
      'Já estudo a Bíblia com frequência',
      'Quero aprofundar meu conhecimento teológico',
    ],
  },
  {
    key: 'objective',
    title: 'O que você deseja alcançar com o Coram Deo?',
    options: [
      'Conhecer melhor a Bíblia',
      'Fortalecer minha vida cristã',
      'Aprofundar-me em teologia',
      'Preparar-me melhor para servir',
    ],
  },
  {
    key: 'study_time',
    title: 'Quanto tempo você pretende estudar hoje?',
    options: ['5 minutos', '10 minutos', '30 minutos', '1 hora ou mais'],
  },
] as const

export default function OnboardingPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const question = questions[step]
  const selected = answers[question.key]
  const isLast = step === questions.length - 1

  function choose(value: string) {
    setAnswers((current) => ({ ...current, [question.key]: value }))
    setError('')
  }

  async function finish() {
    if (!selected) return
    setSaving(true)
    setError('')

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('Sua sessão não foi encontrada. Entre novamente para continuar.')
      setSaving(false)
      return
    }

    const { error: saveError } = await supabase
      .from('profiles')
      .update({
        biblical_familiarity: answers.biblical_familiarity,
        objective: answers.objective,
        study_time: answers.study_time,
        onboarding_completed: true,
      })
      .eq('id', user.id)

    if (saveError) {
      setError('Não conseguimos salvar sua jornada agora. Tente novamente.')
      setSaving(false)
      return
    }

    setDone(true)
    setSaving(false)
  }

  if (done) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F9FA] px-5">
        <section className="w-full max-w-xl rounded-xl bg-white p-8 text-center shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0F2131] text-2xl text-[#C4A47C]">✦</div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#C4A47C]">Coram Deo</p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-[#0F2131]">Sua jornada foi configurada.</h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#5E6E82]">Perfeito, vamos caminhar junto para adaptarmos sua jornada aos seus objetivos.</p>
          <button onClick={() => window.location.href = '/'} className="mt-7 rounded-lg bg-[#8C183F] px-6 py-3 text-sm font-semibold text-white">Começar minha jornada</button>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] px-5 py-10">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C4A47C]">Coram Deo</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-[#0F2131]">Vamos conhecer sua jornada.</h1>
        <p className="mt-3 text-sm leading-6 text-[#5E6E82]">Perfeito, vamos caminhar junto para adaptarmos sua jornada aos seus objetivos.</p>

        <div className="mt-8 h-1.5 overflow-hidden rounded-full bg-[#E1E7EA]">
          <div className="h-full bg-[#8C183F] transition-all" style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
        </div>

        <section className="mt-5 rounded-xl bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] sm:p-8">
          <p className="text-xs font-semibold text-[#8C183F]">{step + 1} de {questions.length}</p>
          <h2 className="mt-2 font-serif text-xl font-bold text-[#0F2131]">{question.title}</h2>
          <div className="mt-6 grid gap-3">
            {question.options.map((option) => {
              const active = selected === option
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => choose(option)}
                  className={`rounded-lg border p-4 text-left text-sm transition ${active ? 'border-[#8C183F] bg-[#8C183F] text-white' : 'border-[#E1E7EA] text-[#0F2131] hover:border-[#C4A47C]'}`}
                >
                  {option}
                </button>
              )
            })}
          </div>

          {error && <p className="mt-4 text-sm text-[#8C183F]">{error}</p>}

          <div className="mt-7 flex items-center justify-between gap-3">
            <button type="button" disabled={step === 0} onClick={() => setStep((value) => value - 1)} className="rounded-lg px-4 py-3 text-sm font-semibold text-[#5E6E82] disabled:invisible">Voltar</button>
            {!isLast ? (
              <button type="button" disabled={!selected} onClick={() => setStep((value) => value + 1)} className="rounded-lg bg-[#8C183F] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">Continuar</button>
            ) : (
              <button type="button" disabled={!selected || saving} onClick={finish} className="rounded-lg bg-[#8C183F] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">{saving ? 'Configurando...' : 'Configurar minha jornada'}</button>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
