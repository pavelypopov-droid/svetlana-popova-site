import { Button } from '@/components/ui/Button'

interface CtaBlockProps {
  title?: string
  subtitle?: string
  buttonText?: string
  buttonHref?: string
}

export function CtaBlock({
  title = 'Первые 15 минут — бесплатно. Просто напишите.',
  subtitle = 'Расскажите о своём запросе — и мы найдём подходящий формат работы.',
  buttonText = 'Записаться',
  buttonHref = '/zapis/',
}: CtaBlockProps) {
  return (
    <section className="bg-brand-dark py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          {title}
        </h2>
        <p className="text-white/70 text-lg mb-8">{subtitle}</p>
        <Button href={buttonHref} variant="primary" className="text-lg px-8 py-4">
          {buttonText}
        </Button>
      </div>
    </section>
  )
}
