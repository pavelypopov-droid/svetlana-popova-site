import { HeroSection } from '@/components/home/HeroSection'
import { PainsSection } from '@/components/home/PainsSection'
import { ServicesSection } from '@/components/home/ServicesSection'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { CtaBlock } from '@/components/shared/CtaBlock'
import { Section } from '@/components/ui/Section'
import { Quiz } from '@/components/shared/Quiz'

const media = [
  { name: 'Коммерсантъ', url: 'https://www.kommersant.ru/doc/8440058' },
  { name: 'Russia Today', url: 'https://russian.rt.com/russia/news/1237153' },
  { name: 'RuNews24', url: 'https://runews24.ru/society/04/12/2023/mamenkinyi' },
  { name: 'Мир 24', url: 'https://mir24.tv/articles/16502677' },
]

function TrustBar() {
  return (
    <div className="bg-brand-light py-5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          <span className="text-brand-dark/70 text-sm font-medium">15+ лет практики</span>
          <span className="text-brand-dark/70 text-sm font-medium">500+ клиентов</span>
          <span className="text-brand-dark/70 text-sm font-medium">ВШЭ · РГСУ · ВЕИП</span>
          <span className="text-brand-dark/50 text-sm">|</span>
          {media.map((outlet) => (
            <a
              key={outlet.url}
              href={outlet.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-dark/60 text-sm font-medium hover:text-brand-primary transition-colors underline-offset-2 hover:underline"
            >
              {outlet.name}
            </a>
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
