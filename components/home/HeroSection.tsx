import Image from 'next/image'
import { Button } from '@/components/ui/Button'

export function HeroSection() {
  return (
    <section className="bg-brand-bg pt-8 pb-16 md:pt-16 md:pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Photo - top on mobile */}
          <div className="flex-shrink-0 order-1 md:order-2">
            <div className="relative w-64 h-80 md:w-80 md:h-[420px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/hero/svetlana-hero.jpg"
                alt="Светлана Попова — психолог-консультант"
                fill
                className="object-cover object-top"
                priority
                sizes="(max-width: 768px) 256px, 320px"
              />
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 order-2 md:order-1 text-center md:text-left">
            <span className="text-brand-gold text-sm font-semibold uppercase tracking-widest mb-4 block">
              Психолог-консультант
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-6 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Понять себя.<br />Построить свой маршрут.
            </h1>
            <p className="text-lg text-brand-dark/70 mb-8 leading-relaxed max-w-xl">
              Психотерапия, профнавигация и бизнес-коучинг — офлайн и онлайн
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center md:justify-start">
              <Button href="/zapis/" variant="primary" className="text-base px-7 py-3.5">
                Записаться на бесплатную консультацию
              </Button>
              <Button href="#quiz" variant="secondary" className="text-base">
                Пройти тест
              </Button>
            </div>
            <p className="text-sm text-brand-muted">
              15+ лет практики · 500+ клиентов · ВШЭ, РГСУ, ВЕИП
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
