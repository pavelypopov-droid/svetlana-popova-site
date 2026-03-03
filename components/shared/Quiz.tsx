'use client'
import { useState } from 'react'
import Link from 'next/link'

interface QuizOption {
  id: string
  text: string
  result: string
}

interface QuizQuestion {
  question: string
  options: readonly QuizOption[]
}

interface QuizResult {
  title: string
  description: string
  cta: string
  href: string
}

interface QuizData {
  start_title: string
  start_description: string
  start_button: string
  questions: readonly QuizQuestion[]
  results: {
    therapy: QuizResult
    career: QuizResult
    coaching: QuizResult
  }
}

export function Quiz({ quizData }: { quizData: QuizData | null }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [result, setResult] = useState<string | null>(null)

  const questions = quizData?.questions || []
  const results = quizData?.results
  const totalSteps = questions.length

  function handleStart() {
    setStep(1)
  }

  function handleAnswer(questionIndex: number, optionResult: string) {
    const newAnswers = { ...answers, [questionIndex]: optionResult || '' }
    setAnswers(newAnswers)

    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      const counts: Record<string, number> = { therapy: 0, career: 0, coaching: 0 }
      Object.values(newAnswers).forEach(r => {
        if (r && r in counts) counts[r]++
      })
      const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
      setResult(winner)
    }
  }

  function handleReset() {
    setStep(0)
    setAnswers({})
    setResult(null)
  }

  if (!quizData || totalSteps === 0) return null

  // Start screen
  if (step === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] p-8 md:p-12">
          <div className="text-5xl mb-6">🧭</div>
          <h3 className="text-2xl font-bold text-brand-dark mb-4">{quizData.start_title}</h3>
          <p className="text-brand-dark/70 mb-8">{quizData.start_description}</p>
          <button
            onClick={handleStart}
            className="inline-flex items-center justify-center rounded-lg px-8 py-4 font-semibold text-lg bg-brand-accent text-white hover:bg-brand-accent/90 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
          >
            {quizData.start_button}
          </button>
        </div>
      </div>
    )
  }

  // Result screen
  if (result && results && result in results) {
    const res = results[result as keyof typeof results]
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] p-8 md:p-12">
          <div className="text-5xl mb-4">✨</div>
          <h3 className="text-2xl font-bold text-brand-dark mb-4">{res.title}</h3>
          <p className="text-brand-dark/70 mb-8 leading-relaxed">{res.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={res.href}
              className="inline-flex items-center justify-center rounded-lg px-8 py-4 font-semibold text-lg bg-brand-accent text-white hover:bg-brand-accent/90 transition-all duration-200"
            >
              {res.cta}
            </Link>
            <button
              onClick={handleReset}
              className="inline-flex items-center justify-center rounded-lg px-6 py-4 font-semibold border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-200 cursor-pointer"
            >
              Пройти ещё раз
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Question screen
  const question = questions[step - 1]
  if (!question) return null

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] p-8 md:p-10">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-brand-muted mb-2">
            <span>Вопрос {step} из {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-brand-light rounded-full h-2">
            <div
              className="bg-brand-primary rounded-full h-2 transition-all duration-500"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <h3 className="text-xl font-bold text-brand-dark mb-6">{question.question}</h3>

        <div className="space-y-3">
          {question.options.map(option => (
            <button
              key={option.id}
              onClick={() => handleAnswer(step - 1, option.result)}
              className="w-full text-left p-4 rounded-xl border-2 border-brand-light hover:border-brand-primary hover:bg-brand-light/50 transition-all duration-200 text-brand-dark font-medium cursor-pointer"
            >
              <span className="text-brand-primary font-bold mr-3">{option.id}.</span>
              {option.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
