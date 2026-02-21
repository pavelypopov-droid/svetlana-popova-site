import Link from 'next/link'

export const metadata = {
  title: 'Спасибо за заявку | Светлана Попова',
  description: 'Ваша заявка принята. Светлана свяжется с вами в ближайшее время.',
}

export default function SpasiboPage() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center bg-brand-bg">
      <div className="max-w-lg mx-auto px-4 text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          Спасибо!
        </h1>
        <p className="text-brand-dark/70 text-lg mb-8 leading-relaxed">
          Светлана свяжется с вами в течение нескольких часов. Обычно мы отвечаем быстрее.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg px-8 py-4 font-semibold bg-brand-accent text-white hover:bg-brand-accent/90 transition-all duration-200 text-lg"
        >
          На главную
        </Link>
      </div>
    </section>
  )
}
