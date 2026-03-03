'use client'
import { useState } from 'react'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'

interface Testimonial {
  slug: string
  name: string
  age: number | null
  role: string
  service: string
  request: string
  result: string
  text: string
}

const filters: { value: string; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'therapy', label: 'Психотерапия' },
  { value: 'career', label: 'Карьера' },
  { value: 'coaching', label: 'Лидерство' },
]

export function TestimonialsClient({ testimonials }: { testimonials: readonly Testimonial[] }) {
  const [active, setActive] = useState('all')
  const filtered = active === 'all' ? testimonials : testimonials.filter(t => t.service === active)

  return (
    <Section bg="bg-brand-bg">
      <div className="flex flex-wrap gap-3 justify-center mb-10">
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setActive(f.value)}
            className={`px-5 py-2 rounded-full font-medium text-sm transition-all cursor-pointer ${
              active === f.value
                ? 'bg-brand-primary text-white shadow-md'
                : 'bg-white text-brand-dark/70 hover:bg-brand-light border border-brand-light'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(t => (
          <Card key={t.slug} accent className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-lg flex-shrink-0">{t.name.charAt(0)}</div>
              <div>
                <div className="font-semibold text-brand-dark">{t.name}</div>
                <div className="text-brand-muted text-sm">{t.age} лет, {t.role}</div>
              </div>
              <span className="ml-auto text-xs px-2 py-1 bg-brand-light rounded-full text-brand-primary font-medium capitalize">
                {t.service === 'therapy' ? 'Терапия' : t.service === 'career' ? 'Профнавигация' : 'Лидерство'}
              </span>
            </div>
            <div className="mb-3">
              <span className="text-xs text-brand-muted uppercase tracking-wide">Запрос:</span>
              <p className="text-sm text-brand-dark/80 mt-0.5">{t.request}</p>
            </div>
            <div className="mb-4">
              <span className="text-xs text-brand-primary uppercase tracking-wide font-semibold">Результат:</span>
              <p className="text-sm font-semibold text-brand-dark mt-0.5">{t.result}</p>
            </div>
            <p className="text-brand-dark/70 text-sm leading-relaxed flex-1">«{t.text}»</p>
          </Card>
        ))}
      </div>
    </Section>
  )
}
