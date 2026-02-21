import Link from 'next/link'
import { Section } from '@/components/ui/Section'

const pains = [
  { emoji: '😰', text: 'Тревога и страхи мешают жить', href: '/psihoterapiya/' },
  { emoji: '😔', text: 'Усталость, апатия, нет сил', href: '/psihoterapiya/' },
  { emoji: '💼', text: 'Не знаю куда двигаться в карьере', href: '/karyernoe-konsultirovanie/' },
  { emoji: '👶', text: 'Ребёнок ведёт себя непонятно', href: '/psihoterapiya/' },
  { emoji: '⚡', text: 'Конфликты в отношениях или на работе', href: '/psihoterapiya/' },
  { emoji: '🚀', text: 'Хочу расти, но что-то мешает', href: '/biznes-kouching/' },
]

export function PainsSection() {
  return (
    <Section bg="bg-white">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-3">
          Вы здесь, потому что...
        </h2>
        <p className="text-brand-muted text-lg">Нажмите на то, что откликается — и узнайте, как я могу помочь</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pains.map((pain, i) => (
          <Link
            key={i}
            href={pain.href}
            className="group flex items-center gap-4 p-5 rounded-xl bg-brand-bg border-2 border-transparent hover:border-brand-primary hover:bg-white transition-all duration-200 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] hover:-translate-y-0.5"
          >
            <span className="text-3xl flex-shrink-0">{pain.emoji}</span>
            <span className="text-brand-dark font-medium group-hover:text-brand-primary transition-colors">
              {pain.text}
            </span>
          </Link>
        ))}
      </div>
    </Section>
  )
}
