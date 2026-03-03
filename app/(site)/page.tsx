import { HeroSection } from '@/components/home/HeroSection'
import { PainsSection } from '@/components/home/PainsSection'
import { ServicesSection } from '@/components/home/ServicesSection'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { CtaBlock } from '@/components/shared/CtaBlock'
import { Section } from '@/components/ui/Section'
import { Quiz } from '@/components/shared/Quiz'
import { getHomePage, getAllTestimonials, getQuiz } from '@/lib/content'

export default async function HomePage() {
  const [home, testimonials, quiz] = await Promise.all([
    getHomePage(),
    getAllTestimonials(),
    getQuiz(),
  ])

  const trustMedia = home?.trust_media || []
  const trustItems = home?.trust_items || []

  return (
    <>
      <HeroSection
        badge={home?.hero_badge || 'Психолог-консультант'}
        tagline={home?.hero_tagline || 'Понять себя. Построить свой маршрут.'}
        subtitle={home?.hero_subtitle || ''}
        cta={home?.hero_cta || 'Записаться на бесплатную консультацию'}
        cta2={home?.hero_cta2 || 'Пройти тест'}
        stats={home?.hero_stats || ''}
      />
      <div className="bg-brand-light py-5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {trustItems.map((item, i) => (
              <span key={i} className="text-brand-dark/70 text-sm font-medium">{item}</span>
            ))}
            {trustMedia.length > 0 && (
              <span className="text-brand-dark/50 text-sm">|</span>
            )}
            {trustMedia.map((outlet) => (
              outlet.url ? (
                <a
                  key={outlet.name}
                  href={outlet.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-dark/60 text-sm font-medium hover:text-brand-primary transition-colors underline-offset-2 hover:underline"
                >
                  {outlet.name}
                </a>
              ) : (
                <span key={outlet.name} className="text-brand-dark/60 text-sm font-medium">
                  {outlet.name}
                </span>
              )
            ))}
          </div>
        </div>
      </div>
      <PainsSection
        title={home?.pains_title || 'Вы здесь, потому что...'}
        subtitle={home?.pains_subtitle || ''}
        pains={home?.pains || []}
      />
      <ServicesSection
        title={home?.services_title || 'Направления работы'}
        subtitle={home?.services_subtitle || ''}
        services={home?.services || []}
      />
      <TestimonialsSection
        title={home?.testimonials_title || 'Истории клиентов'}
        subtitle={home?.testimonials_subtitle || ''}
        testimonials={testimonials.slice(0, 3)}
      />
      <Section id="quiz" bg="bg-brand-bg">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-3">
            {home?.quiz_title || 'Не знаете с чего начать?'}
          </h2>
          <p className="text-brand-muted text-lg">
            {home?.quiz_subtitle || 'Пройдите тест — 5 вопросов, и вы получите персональную рекомендацию'}
          </p>
        </div>
        <Quiz quizData={quiz} />
      </Section>
      <CtaBlock
        title={home?.cta_title}
        subtitle={home?.cta_subtitle}
        buttonText={home?.cta_button}
      />
    </>
  )
}
