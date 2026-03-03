import { Metadata } from 'next'
import Image from 'next/image'
import { CtaBlock } from '@/components/shared/CtaBlock'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { getAboutPage } from '@/lib/content'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata: Metadata = generatePageMetadata({
  title: 'О психологе Светлане Поповой',
  description: '18+ лет практики, образование ВШЭ и ВЕИП, публикации в СМИ. Узнайте о подходе к работе.',
  path: '/ob-mne/',
})

export default async function ObMnePage() {
  const about = await getAboutPage()
  const stats = about?.stats || []
  const storyParagraphs = about?.story_paragraphs || []
  const education = about?.education || []
  const approach = about?.approach || []
  const diplomas = about?.diplomas || []
  const media = about?.media || []

  return (
    <>
      <section className="bg-brand-dark py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-shrink-0">
              <div className="relative w-56 h-72 md:w-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl">
                <Image src="/images/svetlana/portrait.jpg" alt="Светлана Попова — психолог" fill className="object-cover object-top" priority sizes="(max-width: 768px) 224px, 256px" />
              </div>
            </div>
            <div>
              <span className="text-brand-gold text-sm font-semibold uppercase tracking-widest mb-4 block">
                {about?.badge || 'О психологе'}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                {about?.title || 'Светлана Попова'}
              </h1>
              <p className="text-white/70 text-xl mb-6">{about?.subtitle}</p>
              <div className="flex flex-wrap gap-4 text-sm text-white/60">
                {stats.map((s, i) => (
                  <span key={i}>{s.emoji} {s.text}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section bg="bg-brand-bg">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-6">{about?.story_title || 'Моя история'}</h2>
              {storyParagraphs.map((p, i) => (
                <p key={i} className={`text-brand-dark/70 leading-relaxed ${i < storyParagraphs.length - 1 ? 'mb-4' : ''}`}>{p}</p>
              ))}
            </div>
            <div className="flex-shrink-0 flex flex-col gap-4">
              <div className="relative w-48 h-60 md:w-56 md:h-72 rounded-2xl overflow-hidden shadow-xl">
                <Image src="/images/svetlana/thoughtful.jpg" alt="Светлана Попова" fill className="object-cover object-top" sizes="192px" />
              </div>
              <div className="relative w-48 md:w-56 h-28 rounded-xl overflow-hidden shadow-lg">
                <Image src="/images/generated/connection.png" alt="Доверие и поддержка" fill className="object-cover" sizes="192px" />
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section bg="bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-8">Образование</h2>
          <div className="space-y-4">
            {education.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-brand-bg rounded-xl shadow-[var(--shadow-card)]">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xs text-center flex-shrink-0 p-1">{item.org}</div>
                <div>
                  <div className="font-semibold text-brand-dark">{item.org}</div>
                  <div className="text-brand-dark/70 text-sm mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section bg="bg-brand-bg">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-8">Подход к работе</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {approach.map((card, i) => (
              <Card key={i}>
                <h3 className="font-bold text-brand-dark mb-3">{card.icon} {card.title}</h3>
                <p className="text-brand-dark/70 text-sm leading-relaxed">{card.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {diplomas.length > 0 && (
        <Section bg="bg-brand-bg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-8 text-center">Дипломы и сертификаты</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {diplomas.map((doc, i) => (
                <a key={i} href={doc.src} target="_blank" rel="noopener noreferrer" className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] hover:-translate-y-1 transition-all block">
                  <Image src={doc.src} alt={doc.alt} fill className="object-cover" sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, 22vw" />
                </a>
              ))}
            </div>
          </div>
        </Section>
      )}

      {media.length > 0 && (
        <Section bg="bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">Публикации в СМИ</h2>
            <p className="text-brand-muted mb-8">Комментирую темы психологии, карьеры и личного развития</p>
            <div className="flex flex-wrap justify-center gap-6">
              {media.map((outlet, i) => (
                outlet.url ? (
                  <a key={i} href={outlet.url} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-brand-bg rounded-xl shadow-[var(--shadow-card)] text-brand-dark font-bold text-lg hover:shadow-[var(--shadow-hover)] hover:-translate-y-0.5 transition-all">{outlet.name}</a>
                ) : (
                  <span key={i} className="px-8 py-4 bg-brand-bg rounded-xl shadow-[var(--shadow-card)] text-brand-dark/60 font-bold text-lg">{outlet.name}</span>
                )
              ))}
            </div>
          </div>
        </Section>
      )}

      <Section bg="bg-brand-dark">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-brand-gold text-6xl mb-6" style={{ fontFamily: 'Georgia, serif' }}>&ldquo;</div>
          <p className="text-white text-xl md:text-2xl leading-relaxed mb-6" style={{ fontFamily: 'Georgia, serif' }}>{about?.quote}</p>
          <p className="text-white/50">{about?.quote_author}</p>
        </div>
      </Section>

      <CtaBlock title={about?.cta_title} subtitle={about?.cta_subtitle} />
    </>
  )
}
