import { CtaBlock } from '@/components/shared/CtaBlock'
import { getAllFaq } from '@/lib/content'
import { FaqAccordion } from './FaqAccordion'

export default async function FaqPage() {
  const items = await getAllFaq()

  return (
    <>
      <section className="bg-brand-dark py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-brand-gold text-sm font-semibold uppercase tracking-widest mb-4 block">FAQ</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>Частые вопросы</h1>
          <p className="text-white/70 text-xl">Ответы на самые распространённые вопросы о моей работе</p>
        </div>
      </section>

      <section className="bg-brand-bg py-12 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FaqAccordion items={items.map(i => ({ question: i.question, answer: i.answer }))} />
        </div>
      </section>

      <CtaBlock
        title="Остались вопросы?"
        subtitle="Напишите — отвечу лично. Первые 15 минут консультации бесплатно."
      />
    </>
  )
}
