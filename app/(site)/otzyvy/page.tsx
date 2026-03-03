import { CtaBlock } from '@/components/shared/CtaBlock'
import { getAllTestimonials } from '@/lib/content'
import { TestimonialsClient } from './TestimonialsClient'

export default async function OtzyvyPage() {
  const testimonials = await getAllTestimonials()

  return (
    <>
      <section className="bg-brand-dark py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-brand-gold text-sm font-semibold uppercase tracking-widest mb-4 block">Отзывы</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>Истории клиентов</h1>
          <p className="text-white/70 text-xl">Реальные изменения — реальных людей</p>
        </div>
      </section>

      <TestimonialsClient testimonials={testimonials} />

      <CtaBlock
        title="Станьте следующей историей успеха"
        subtitle="Первые 15 минут — бесплатно. Расскажите о своём запросе."
      />
    </>
  )
}
