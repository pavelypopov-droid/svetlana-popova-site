import { Metadata } from 'next'
import Image from 'next/image'
import { ServiceHero } from '@/components/shared/ServiceHero'
import { CtaBlock } from '@/components/shared/CtaBlock'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { services } from '@/content/services'
import { testimonials } from '@/content/testimonials'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata: Metadata = generatePageMetadata({
  title: 'Бизнес-коучинг',
  description: 'Коучинг для предпринимателей и руководителей. Достигайте целей без лишних колебаний.',
  path: '/biznes-kouching/',
})

const s = services.coaching

export default function KouchingPage() {
  const relatedTestimonials = testimonials.filter(t => t.service === 'coaching').slice(0, 2)

  return (
    <>
      <ServiceHero
        badge="Бизнес-коучинг"
        title="От цели к результату — без лишних колебаний"
        subtitle="Для предпринимателей, руководителей и амбициозных специалистов, которые знают чего хотят, но что-то мешает."
      />

      {/* Coaching visual */}
      <section className="relative w-full h-56 md:h-72 overflow-hidden">
        <Image
          src="/images/generated/coaching-focus.png"
          alt="Бизнес-коучинг"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-6 left-8 text-white">
          <p className="text-lg font-medium" style={{ fontFamily: 'Georgia, serif' }}>
            Ясность мышления — фундамент правильных решений
          </p>
        </div>
      </section>

      {/* Отличие от терапии */}
      <Section bg="bg-brand-bg">
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 border-l-4 border-brand-gold">
            <h2 className="text-xl font-bold text-brand-dark mb-4">Чем коучинг отличается от терапии?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div>
                <div className="font-semibold text-brand-primary mb-2">Коучинг</div>
                <ul className="space-y-1.5 text-brand-dark/70">
                  <li>→ Фокус на цели и будущем</li>
                  <li>→ Конкретные задачи и сроки</li>
                  <li>→ Работа с ресурсами и стратегией</li>
                  <li>→ Подходит тем, кто психически здоров</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-brand-accent mb-2">Психотерапия</div>
                <ul className="space-y-1.5 text-brand-dark/70">
                  <li>→ Работа с прошлым и эмоциями</li>
                  <li>→ Глубинные паттерны поведения</li>
                  <li>→ Нет конкретных бизнес-задач</li>
                  <li>→ Подходит при психических трудностях</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      {/* Это для вас, если... */}
      <Section bg="bg-white">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-dark">Это для вас, если...</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {s.pains.map((pain, i) => (
            <div key={i} className="flex items-start gap-3 p-5 bg-brand-bg rounded-xl shadow-[var(--shadow-card)]">
              <span className="text-brand-gold text-xl mt-0.5 flex-shrink-0">✓</span>
              <span className="text-brand-dark/80">{pain}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Как проходит работа */}
      <Section bg="bg-brand-bg">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-dark">Как проходит работа</h2>
          <p className="text-brand-muted mt-2">Чёткая структура — чёткий результат</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {s.steps.map(step => (
            <Card key={step.n} className="text-center">
              <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xl mx-auto mb-4">
                {step.n}
              </div>
              <h3 className="text-lg font-bold text-brand-dark mb-2">{step.title}</h3>
              <p className="text-brand-dark/70 text-sm leading-relaxed">{step.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Результаты */}
      <Section bg="bg-white">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-dark">Что изменится</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {s.results.map((result, i) => (
            <div key={i} className="flex items-start gap-3 p-4 bg-brand-bg rounded-xl shadow-[var(--shadow-card)]">
              <span className="text-brand-accent text-lg flex-shrink-0">→</span>
              <span className="text-brand-dark">{result}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Формат */}
      <Section bg="bg-brand-bg">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-brand-dark mb-6">Формат и стоимость</h2>
          <div className="p-6 bg-white rounded-xl shadow-[var(--shadow-card)] text-left">
            <p className="text-brand-dark/70 mb-2"><span className="font-semibold text-brand-dark">Формат:</span> {s.format}</p>
            <p className="text-brand-dark/70"><span className="font-semibold text-brand-dark">Стоимость:</span> {s.price}</p>
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      {relatedTestimonials.length > 0 && (
        <Section bg="bg-white">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-brand-dark">Говорят клиенты</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {relatedTestimonials.map(t => (
              <Card key={t.id}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
                    {t.name.charAt(0)}
                  </div>
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

      <CtaBlock
        title="Готовы двигаться к цели?"
        subtitle="Первые 15 минут — бесплатно. Расскажите о своей задаче, и мы поймём, как я могу помочь."
        buttonText="Записаться на коучинг"
      />
    </>
  )
}
