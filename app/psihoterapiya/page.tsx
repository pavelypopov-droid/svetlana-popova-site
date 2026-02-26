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
  title: 'Психотерапия для взрослых и детей',
  description: 'Помогу справиться с тревогой, депрессией, выгоранием и трудностями в отношениях.',
  path: '/psihoterapiya/',
})

const s = services.therapy

export default function PsihoterapiyaPage() {
  const relatedTestimonials = testimonials.filter(t => t.service === 'therapy').slice(0, 2)

  return (
    <>
      <ServiceHero
        badge="Психотерапия"
        title="Тихое пространство внимательного диалога"
        subtitle="Индивидуальная работа со взрослыми, подростками и детьми. Помогаю разобраться в себе, справиться с тревогой, депрессией и трудными отношениями."
      />

      {/* Это для вас, если... */}
      <Section bg="bg-brand-bg">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-dark">Это для вас, если...</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {s.pains.map((pain, i) => (
            <div key={i} className="flex items-start gap-3 p-5 bg-white rounded-xl shadow-[var(--shadow-card)]">
              <span className="text-brand-gold text-xl mt-0.5 flex-shrink-0">✓</span>
              <span className="text-brand-dark/80">{pain}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Как проходит работа */}
      <Section bg="bg-white">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-dark">Как проходит работа</h2>
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

      {/* Методы */}
      <Section bg="bg-brand-bg">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-dark">Методы работы</h2>
            <p className="text-brand-muted mt-2">Выбираю подход под конкретного человека и запрос</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {s.methods.map((method, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-[var(--shadow-card)]">
                <span className="w-2 h-2 rounded-full bg-brand-primary flex-shrink-0" />
                <span className="text-brand-dark font-medium">{method}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Детская терапия */}
      <Section bg="bg-white">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <span className="text-brand-gold text-sm font-semibold uppercase tracking-widest mb-3 block">
              Работа с детьми
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-4">
              Детская и семейная психотерапия
            </h2>
            <p className="text-brand-dark/70 leading-relaxed mb-4">
              Дети не всегда могут сказать словами, что им плохо. Их сигналы — капризы, агрессия, замкнутость, плохая учёба. Я работаю с детьми от 4 лет, подростками и их родителями.
            </p>
            <p className="text-brand-dark/70 leading-relaxed mb-4">
              Часто родители тоже приходят на сессии — вместе мы меняем атмосферу в семье. Ребёнок меняется, когда меняется система вокруг него.
            </p>
            <p className="text-brand-dark/70 leading-relaxed">
              Использую игровую терапию, арт-терапию и работу через метафорические карты — это мягко и эффективно.
            </p>
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

      {/* Что изменится */}
      <Section bg="bg-brand-bg">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-dark">Что изменится</h2>
          <p className="text-brand-muted mt-2">Конкретные, измеримые результаты</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {s.results.map((result, i) => (
            <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-[var(--shadow-card)]">
              <span className="text-brand-accent text-lg flex-shrink-0">→</span>
              <span className="text-brand-dark">{result}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Формат */}
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
            <span className="font-semibold text-brand-dark">Длительность сессии:</span> {s.format}
            <br />
            <span className="font-semibold text-brand-dark">Стоимость:</span> {s.price}
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      {relatedTestimonials.length > 0 && (
        <Section bg="bg-brand-bg">
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
        title="Сделайте первый шаг"
        subtitle="Первые 15 минут — бесплатно. Я отвечу на ваши вопросы и мы поймём, подходит ли мой формат работы."
        buttonText="Записаться на бесплатную консультацию"
      />
    </>
  )
}
