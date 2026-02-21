import { Button } from '@/components/ui/Button'

interface ServiceHeroProps {
  title: string
  subtitle: string
  badge?: string
}

export function ServiceHero({ title, subtitle, badge }: ServiceHeroProps) {
  return (
    <section className="bg-brand-dark py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {badge && (
          <span className="inline-block text-brand-gold text-sm font-semibold uppercase tracking-widest mb-4">
            {badge}
          </span>
        )}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 max-w-3xl leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
          {title}
        </h1>
        <p className="text-white/80 text-xl mb-8 max-w-2xl">{subtitle}</p>
        <Button href="/zapis/" variant="primary" className="text-lg px-8 py-4">
          Записаться на консультацию
        </Button>
      </div>
    </section>
  )
}
