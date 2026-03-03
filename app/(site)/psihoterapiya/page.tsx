import { Metadata } from 'next'
import Image from 'next/image'
import { ServiceHero } from '@/components/shared/ServiceHero'
import { CtaBlock } from '@/components/shared/CtaBlock'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { getTherapyPage, getAllTestimonials } from '@/lib/content'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata: Metadata = generatePageMetadata({
  title: 'Психотерапия для взрослых и детей',
  description: 'Помогу справиться с тревогой, депрессией, выгоранием и трудностями в отношениях.',
  path: '/psihoterapiya/',
})

export default async function PsihoterapiyaPage() {
  const [s, testimonials] = await Promise.all([
    getTherapyPage(),
    getAllTestimonials(),
  ])
  const relatedTestimonials = testimonials.filter(t => t.service === 'therapy').slice(0, 2)
  const pains = s?.pains || []
  const steps = s?.steps || []
  const methods = s?.methods || []
  const results = s?.results || []
  const childParagraphs = s?.child_therapy_paragraphs || []

  return (
    <>
      <ServiceHero
        badge={s?.badge || 'Психотерапия'}
        title={s?.title || ''}
        subtitle={s?.subtitle || ''}
      />

      <Section bg="bg-brand-bg">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-dark">Это для вас, если...</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pains.map((pain, i) => (
            <div key={i} className="flex items-start gap-3 p-5 bg-white rounded-xl shadow-[var(--shadow-card)]">
              <span className="text-brand-gold text-xl mt-0.5 flex-shrink-0">✓</span>
              <span className="text-brand-dark/80">{pain}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section bg="bg-white">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-dark">Как проходит работа</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <Card key={i} className="text-center">
              <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xl mx-auto mb-4">
                {i + 1}
              </div>
              <h3 className="text-lg font-bold text-brand-dark mb-2">{step.title}</h3>
              <p className="text-brand-dark/70 text-sm leading-relaxed">{step.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {methods.length > 0 && (
        <Section bg="bg-brand-bg">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-brand-dark">Методы работы</h2>
              <p className="text-brand-muted mt-2">Выбираю подход под конкретного человека и запрос</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {methods.map((method, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-[var(--shadow-card)]">
                  <span className="w-2 h-2 rounded-full bg-brand-primary flex-shrink-0" />
                  <span className="text-brand-dark font-medium">{method}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      <section className="relative w-full h-64 md:h-80 overflow-hidden">
        <Image
          src="/images/generated/therapy-room.png"
          alt="Кабинет психолога"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-6 left-8 text-white">
          <p className="text-lg font-medium" style={{ fontFamily: 'Georgia, serif' }}>
            Пространство, где можно говорить о любом
          </p>
        </div>
      </section>

      {childParagraphs.length > 0 && (
        <Section bg="bg-white">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <span className="text-brand-gold text-sm font-semibold uppercase tracking-widest mb-3 block">
                {s?.child_therapy_badge || 'Работа с детьми'}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-4">
                {s?.child_therapy_title || 'Детская и семейная психотерапия'}
              </h2>
              {childParagraphs.map((p, i) => (
                <p key={i} className={`text-brand-dark/70 leading-relaxed ${i < childParagraphs.length - 1 ? 'mb-4' : ''}`}>
                  {p}
                </p>
              ))}
            </div>
            <div className="flex-shrink-0">
              <div className="relative w-64 h-72 md:w-72 md:h-80 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/svetlana/family.jpg"
                  alt="Работа с детьми"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 256px, 288px"
                />
              </div>
            </div>
          </div>
        </Section>
      )}

      <Section bg="bg-brand-bg">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-dark">Что изменится</h2>
          <p className="text-brand-muted mt-2">Конкретные, измеримые результаты</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {results.map((result, i) => (
            <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-[var(--shadow-card)]">
              <span className="text-brand-accent text-lg flex-shrink-0">→</span>
              <span className="text-brand-dark">{result}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section bg="bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-8">Формат и стоимость</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="text-center">
              <div className="text-3xl mb-3">💻</div>
              <h3 className="font-bold text-brand-dark mb-2">Онлайн</h3>
              <p className="text-brand-dark/70 text-sm">Zoom, Google Meet или любой удобный мессенджер. Из любой точки мира.</p>
            </Card>
            <Card className="text-center">
              <div className="text-3xl mb-3">🏙️</div>
              <h3 className="font-bold text-brand-dark mb-2">Очно</h3>
              <p className="text-brand-dark/70 text-sm">Адрес и время уточняем при записи.</p>
            </Card>
          </div>
          <div className="mt-6 p-5 bg-brand-light rounded-xl text-brand-dark/70">
            <span className="font-semibold text-brand-dark">Длительность сессии:</span> {s?.format}
            <br />
            <span className="font-semibold text-brand-dark">Стоимость:</span> {s?.price}
          </div>
        </div>
      </Section>

      {relatedTestimonials.length > 0 && (
        <Section bg="bg-brand-bg">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-brand-dark">Говорят клиенты</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {relatedTestimonials.map(t => (
              <Card key={t.slug}>
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
        title={s?.cta_title}
        subtitle={s?.cta_subtitle}
        buttonText={s?.cta_button}
      />
    </>
  )
}
