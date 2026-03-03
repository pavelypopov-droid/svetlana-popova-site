import { Metadata } from 'next'
import Image from 'next/image'
import { ServiceHero } from '@/components/shared/ServiceHero'
import { CtaBlock } from '@/components/shared/CtaBlock'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { getCareerPage, getAllTestimonials } from '@/lib/content'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata: Metadata = generatePageMetadata({
  title: 'Профнавигация',
  description: 'Профессиональная навигация для взрослых и профориентация для подростков. Найдём ваш путь вместе.',
  path: '/karyernoe-konsultirovanie/',
})

export default async function KarierePage() {
  const [s, testimonials] = await Promise.all([
    getCareerPage(),
    getAllTestimonials(),
  ])
  const relatedTestimonials = testimonials.filter(t => t.service === 'career').slice(0, 2)
  const pains = s?.pains || []
  const steps = s?.steps || []
  const results = s?.results || []
  const adultsItems = s?.adults_items || []
  const teensItems = s?.teens_items || []

  return (
    <>
      <ServiceHero
        badge={s?.badge || 'Профнавигация'}
        title={s?.title || ''}
        subtitle={s?.subtitle || ''}
      />

      <section className="relative w-full h-56 md:h-72 overflow-hidden">
        <Image src="/images/generated/career-path.png" alt="Карьерный путь" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-6 left-8 text-white">
          <p className="text-lg font-medium" style={{ fontFamily: 'Georgia, serif' }}>
            Ваш путь — не случайность. Его можно выстроить осознанно.
          </p>
        </div>
      </section>

      <Section bg="bg-brand-bg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card accent className="p-8">
            <div className="text-4xl mb-4">{s?.adults_icon || '👔'}</div>
            <h2 className="text-xl font-bold text-brand-dark mb-4">{s?.adults_title || 'Для взрослых'}</h2>
            <ul className="space-y-3 text-brand-dark/70">
              {adultsItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2"><span className="text-brand-primary">→</span> {item}</li>
              ))}
            </ul>
          </Card>
          <Card accent className="p-8">
            <div className="text-4xl mb-4">{s?.teens_icon || '🎓'}</div>
            <h2 className="text-xl font-bold text-brand-dark mb-4">{s?.teens_title || 'Для подростков'}</h2>
            <ul className="space-y-3 text-brand-dark/70">
              {teensItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2"><span className="text-brand-primary">→</span> {item}</li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      <Section bg="bg-white">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-dark">Это для вас, если...</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pains.map((pain, i) => (
            <div key={i} className="flex items-start gap-3 p-5 bg-brand-bg rounded-xl shadow-[var(--shadow-card)]">
              <span className="text-brand-gold text-xl mt-0.5 flex-shrink-0">✓</span>
              <span className="text-brand-dark/80">{pain}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section bg="bg-brand-bg">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-dark">Как проходит работа</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <Card key={i} className="text-center">
              <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xl mx-auto mb-4">{i + 1}</div>
              <h3 className="text-lg font-bold text-brand-dark mb-2">{step.title}</h3>
              <p className="text-brand-dark/70 text-sm leading-relaxed">{step.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section bg="bg-white">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-dark">Что вы получите</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {results.map((result, i) => (
            <div key={i} className="flex items-start gap-3 p-4 bg-brand-bg rounded-xl shadow-[var(--shadow-card)]">
              <span className="text-brand-accent text-lg flex-shrink-0">→</span>
              <span className="text-brand-dark">{result}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section bg="bg-brand-bg">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-brand-dark mb-6">Формат и стоимость</h2>
          <div className="p-6 bg-white rounded-xl shadow-[var(--shadow-card)] text-left">
            <p className="text-brand-dark/70 mb-2"><span className="font-semibold text-brand-dark">Формат:</span> {s?.format}</p>
            <p className="text-brand-dark/70"><span className="font-semibold text-brand-dark">Стоимость:</span> {s?.price}</p>
          </div>
        </div>
      </Section>

      {relatedTestimonials.length > 0 && (
        <Section bg="bg-white">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-brand-dark">Говорят клиенты</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {relatedTestimonials.map(t => (
              <Card key={t.slug}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">{t.name.charAt(0)}</div>
                  <div>
                    <div className="font-semibold text-brand-dark text-sm">{t.name}</div>
                    <div className="text-brand-muted text-xs">{t.role}</div>
                  </div>
                </div>
                <p className="text-brand-primary text-sm font-semibold mb-1">{t.result}</p>
                <p className="text-brand-dark/70 text-sm leading-relaxed">«{t.text}»</p>
              </Card>
            ))}
          </div>
        </Section>
      )}

      <CtaBlock title={s?.cta_title} subtitle={s?.cta_subtitle} buttonText={s?.cta_button} />
    </>
  )
}
