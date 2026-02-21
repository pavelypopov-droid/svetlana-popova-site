import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { testimonials } from '@/content/testimonials'

export function TestimonialsSection() {
  const featured = testimonials.slice(0, 3)

  return (
    <Section bg="bg-white">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-3">
          Истории клиентов
        </h2>
        <p className="text-brand-muted text-lg">Реальные результаты реальных людей</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {featured.map(t => (
          <Card key={t.id} className="flex flex-col">
            {/* Avatar */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-lg flex-shrink-0">
                {t.name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-brand-dark">{t.name}</div>
                <div className="text-brand-muted text-sm">{t.age} лет, {t.role}</div>
              </div>
            </div>
            {/* Request + result */}
            <div className="mb-3">
              <span className="text-xs text-brand-muted uppercase tracking-wide">Запрос:</span>
              <p className="text-sm text-brand-dark/80 mt-0.5">{t.request}</p>
            </div>
            <div className="mb-4">
              <span className="text-xs text-brand-primary uppercase tracking-wide font-semibold">Результат:</span>
              <p className="text-sm font-semibold text-brand-dark mt-0.5">{t.result}</p>
            </div>
            <p className="text-brand-dark/70 text-sm leading-relaxed flex-1">«{t.text}»</p>
          </Card>
        ))}
      </div>
      <div className="text-center">
        <Button href="/otzyvy/" variant="secondary">
          Все отзывы
        </Button>
      </div>
    </Section>
  )
}
