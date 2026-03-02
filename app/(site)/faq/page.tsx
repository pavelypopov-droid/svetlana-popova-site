'use client'

import { useState } from 'react'
import { faqItems } from '@/content/faq'
import { CtaBlock } from '@/components/shared/CtaBlock'

function FaqAccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-brand-light/50 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left bg-white hover:bg-brand-bg/50 transition-colors"
      >
        <span className="font-semibold text-brand-dark text-base md:text-lg leading-snug">{question}</span>
        <span className={`text-brand-primary text-2xl flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 md:px-6 md:pb-6 bg-white">
          <p className="text-brand-dark/70 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}

export default function FaqPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-dark py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-brand-gold text-sm font-semibold uppercase tracking-widest mb-4 block">
            FAQ
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Частые вопросы
          </h1>
          <p className="text-white/70 text-xl">Ответы на самые распространённые вопросы о моей работе</p>
        </div>
      </section>

      {/* Accordion */}
      <section className="bg-brand-bg py-12 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            {faqItems.map((item, i) => (
              <FaqAccordionItem key={i} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </section>

      <CtaBlock
        title="Остались вопросы?"
        subtitle="Напишите — отвечу лично. Первые 15 минут консультации бесплатно."
      />
    </>
  )
}
