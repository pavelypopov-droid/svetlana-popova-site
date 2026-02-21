import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { services } from '@/content/services'

export function ServicesSection() {
  const items = [services.therapy, services.career, services.coaching]

  return (
    <Section bg="bg-brand-bg">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-3">
          Направления работы
        </h2>
        <p className="text-brand-muted text-lg">Выберите то, что вам сейчас нужно</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map(service => (
          <Card key={service.slug} accent className="flex flex-col">
            <div className="text-4xl mb-4">{service.icon}</div>
            <h3 className="text-xl font-bold text-brand-dark mb-3">{service.title}</h3>
            <p className="text-brand-dark/70 leading-relaxed mb-6 flex-1">{service.shortDesc}</p>
            <Button href={`/${service.slug}/`} variant="ghost" className="self-start">
              Подробнее →
            </Button>
          </Card>
        ))}
      </div>
    </Section>
  )
}
