import { Metadata } from 'next'
import Image from 'next/image'
import { CtaBlock } from '@/components/shared/CtaBlock'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata: Metadata = generatePageMetadata({
  title: 'О психологе Светлане Поповой',
  description: '15+ лет практики, образование ВШЭ и ВЕИП, публикации в СМИ. Узнайте о подходе к работе.',
  path: '/ob-mne/',
})

const education = [
  { org: 'ВШЭ', desc: 'Высшая школа экономики — психология' },
  { org: 'РГСУ', desc: 'Российский государственный социальный университет — практическая психология' },
  { org: 'ВЕИП', desc: 'Восточно-Европейский институт психоанализа — психоанализ и психоаналитическая терапия' },
  { org: 'Доп. образование', desc: 'Курсы КПТ, арт-терапии, телесно-ориентированного подхода, работы с детьми и подростками' },
]

const media = [
  { name: 'Коммерсантъ', url: 'https://www.kommersant.ru/doc/8440058' },
  { name: 'Russia Today', url: 'https://russian.rt.com/russia/news/1237153' },
  { name: 'RuNews24', url: 'https://runews24.ru/society/04/12/2023/mamenkinyi' },
  { name: 'Мир 24', url: 'https://mir24.tv/articles/16502677' },
]

export default function ObMnePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-dark py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-shrink-0">
              <div className="relative w-56 h-72 md:w-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/svetlana/portrait.jpg"
                  alt="Светлана Попова — психолог"
                  fill
                  className="object-cover object-top"
                  priority
                  sizes="(max-width: 768px) 224px, 256px"
                />
              </div>
            </div>
            <div>
              <span className="text-brand-gold text-sm font-semibold uppercase tracking-widest mb-4 block">
                О психологе
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                Светлана Попова
              </h1>
              <p className="text-white/70 text-xl mb-6">
                Психолог-консультант, психоаналитически ориентированный терапевт
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-white/60">
                <span>🎓 ВШЭ · РГСУ · ВЕИП</span>
                <span>⏱ 15+ лет практики</span>
                <span>👥 500+ клиентов</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* История */}
      <Section bg="bg-brand-bg">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-6">Моя история</h2>
              <p className="text-brand-dark/70 leading-relaxed mb-4">
                Я пришла в психологию не случайно. В молодости я сама переживала периоды, когда непонятно было, куда двигаться — и в жизни, и в профессии. Психотерапия помогла мне разобраться в себе и выстроить жизнь, которую я хочу. Именно тогда я поняла, что хочу помогать другим делать то же самое.
              </p>
              <p className="text-brand-dark/70 leading-relaxed mb-4">
                За 15 лет практики я работала с самыми разными запросами: от острой тревоги и панических атак до карьерных кризисов и управленческих задач. Я вижу, как глубоко изнутри меняются люди, когда чувствуют себя услышанными и понятыми. Это и есть то, ради чего я работаю.
              </p>
              <p className="text-brand-dark/70 leading-relaxed">
                Сейчас я веду частную практику — очно и онлайн. Работаю с взрослыми, подростками и детьми. Регулярно прохожу личную терапию и супервизии — это обязательная часть профессионального стандарта психотерапевта.
              </p>
            </div>
            <div className="flex-shrink-0 flex flex-col gap-4">
              <div className="relative w-48 h-60 md:w-56 md:h-72 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/svetlana/thoughtful.jpg"
                  alt="Светлана Попова"
                  fill
                  className="object-cover object-top"
                  sizes="192px"
                />
              </div>
              <div className="relative w-48 md:w-56 h-28 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/generated/connection.png"
                  alt="Доверие и поддержка"
                  fill
                  className="object-cover"
                  sizes="192px"
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Образование */}
      <Section bg="bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-8">Образование</h2>
          <div className="space-y-4">
            {education.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-brand-bg rounded-xl shadow-[var(--shadow-card)]">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xs text-center flex-shrink-0 p-1">
                  {item.org}
                </div>
                <div>
                  <div className="font-semibold text-brand-dark">{item.org}</div>
                  <div className="text-brand-dark/70 text-sm mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Подход к работе */}
      <Section bg="bg-brand-bg">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-8">Подход к работе</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="font-bold text-brand-dark mb-3">🔄 Личная терапия и супервизии</h3>
              <p className="text-brand-dark/70 text-sm leading-relaxed">
                Я регулярно прохожу личную терапию и супервизии — встречи с более опытным коллегой для разбора сложных случаев. Это обязательный профессиональный стандарт: психотерапевт, который сам не работает над собой, не может качественно помогать другим.
              </p>
            </Card>
            <Card>
              <h3 className="font-bold text-brand-dark mb-3">🧘 Духовные практики</h3>
              <p className="text-brand-dark/70 text-sm leading-relaxed">
                Практикую цигун и изучаю философию Ошо — не как религию, а как систему для понимания природы человека. Эти практики помогают мне сохранять внутреннюю устойчивость и более глубоко видеть то, что происходит с клиентом.
              </p>
            </Card>
            <Card>
              <h3 className="font-bold text-brand-dark mb-3">🤝 Безоценочный подход</h3>
              <p className="text-brand-dark/70 text-sm leading-relaxed">
                На наших сессиях нет правильных и неправильных ответов, нет осуждения. Я создаю пространство, где можно говорить о любом — и это само по себе уже часть исцеления.
              </p>
            </Card>
            <Card>
              <h3 className="font-bold text-brand-dark mb-3">📐 Индивидуальный подход</h3>
              <p className="text-brand-dark/70 text-sm leading-relaxed">
                Я не работаю по шаблону. Для каждого человека — свой темп, свой метод, своя глубина. Иногда нужно несколько сессий, иногда — год. Главное: чтобы изменения были настоящими.
              </p>
            </Card>
          </div>
        </div>
      </Section>

      {/* Дипломы и сертификаты */}
      <Section bg="bg-brand-bg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-8 text-center">Дипломы и сертификаты</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              { src: '/images/diplomas/Diplom_Magistra.jpg', alt: 'Диплом магистра' },
              { src: '/images/diplomas/_1.jpg', alt: 'Диплом' },
              { src: '/images/diplomas/_2.jpg', alt: 'Диплом' },
              { src: '/images/diplomas/_3_1.jpeg', alt: 'Сертификат' },
              { src: '/images/diplomas/_4.jpg', alt: 'Сертификат' },
              { src: '/images/diplomas/photo.jpg', alt: 'Документ' },
              { src: '/images/diplomas/Cert2018.jpg', alt: 'Сертификат 2018' },
              { src: '/images/diplomas/Cert2018Deti.jpg', alt: 'Сертификат работа с детьми' },
              { src: '/images/diplomas/IMG_4572.JPG', alt: 'Сертификат' },
            ].map((doc, i) => (
              <a
                key={i}
                href={doc.src}
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] hover:-translate-y-1 transition-all block"
              >
                <Image
                  src={doc.src}
                  alt={doc.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, 22vw"
                />
              </a>
            ))}
          </div>
        </div>
      </Section>

      {/* СМИ */}
      <Section bg="bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-brand-dark mb-4">Публикации в СМИ</h2>
          <p className="text-brand-muted mb-8">Комментирую темы психологии, карьеры и личного развития</p>
          <div className="flex flex-wrap justify-center gap-6">
            {media.map((outlet, i) => (
              <a
                key={i}
                href={outlet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-brand-bg rounded-xl shadow-[var(--shadow-card)] text-brand-dark font-bold text-lg hover:shadow-[var(--shadow-hover)] hover:-translate-y-0.5 transition-all"
              >
                {outlet.name}
              </a>
            ))}
          </div>
        </div>
      </Section>

      {/* Цитата */}
      <Section bg="bg-brand-dark">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-brand-gold text-6xl mb-6" style={{ fontFamily: 'Georgia, serif' }}>&ldquo;</div>
          <p className="text-white text-xl md:text-2xl leading-relaxed mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Каждый человек, который приходит ко мне, уже сделал самый важный шаг — решился. Моя задача — сделать так, чтобы этот шаг привёл его туда, где ему действительно лучше.
          </p>
          <p className="text-white/50">— Светлана Попова</p>
        </div>
      </Section>

      <CtaBlock
        title="Познакомимся?"
        subtitle="Первые 15 минут — бесплатно. Расскажите о своём запросе — посмотрим, подходим ли друг другу."
      />
    </>
  )
}
