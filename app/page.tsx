import { HeroSection } from '@/components/home/HeroSection'
import { PainsSection } from '@/components/home/PainsSection'
import { ServicesSection } from '@/components/home/ServicesSection'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { CtaBlock } from '@/components/shared/CtaBlock'
import { Section } from '@/components/ui/Section'
import { Quiz } from '@/components/shared/Quiz'

function TrustBar() {
  const items = [
    '15+ лет практики',
    '500+ клиентов',
    'ВШЭ · РГСУ · ВЕИП',
    'Russia Today · RuNews24 · Mir24',
  ]
  return (
    <div className="bg-brand-light py-5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          {items.map((item, i) => (
            <span key={i} className="text-brand-dark/70 text-sm font-medium">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function QuizSection() {
  return (
    <Section id="quiz" bg="bg-brand-bg">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-3">
          Не знаете с чего начать?
        </h2>
        <p className="text-brand-muted text-lg">
          Пройдите тест — 5 вопросов, и вы получите персональную рекомендацию
        </p>
      </div>
      <Quiz />
    </Section>
  )
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <PainsSection />
      <ServicesSection />
      <TestimonialsSection />
      <QuizSection />
      <CtaBlock />
    </>
  )
}
