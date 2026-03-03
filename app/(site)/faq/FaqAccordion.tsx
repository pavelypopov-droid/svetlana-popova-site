'use client'
import { useState } from 'react'

function FaqAccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-brand-light/50 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left bg-white hover:bg-brand-bg/50 transition-colors"
      >
        <span className="font-semibold text-brand-dark text-base md:text-lg leading-snug">{question}</span>
        <span className={`text-brand-primary text-2xl flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && (
        <div className="px-5 pb-5 md:px-6 md:pb-6 bg-white">
          <p className="text-brand-dark/70 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}

export function FaqAccordion({ items }: { items: readonly { question: string; answer: string }[] }) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item, i) => (
        <FaqAccordionItem key={i} question={item.question} answer={item.answer} />
      ))}
    </div>
  )
}
