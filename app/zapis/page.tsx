'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendlyWidget } from '@/components/shared/CalendlyWidget'
import { Section } from '@/components/ui/Section'
import { FaWhatsapp, FaTelegram } from 'react-icons/fa6'

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || ''

const serviceOptions = [
  'Психотерапия',
  'Карьерное консультирование',
  'Бизнес-коучинг',
  'Пока не знаю',
]

const timeOptions = [
  'Утро (9:00–12:00)',
  'День (12:00–17:00)',
  'Вечер (17:00–21:00)',
  'Выходные',
]

export default function ZapisPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    times: [] as string[],
  })
  const [sending, setSending] = useState(false)

  function handleTimeToggle(time: string) {
    setForm(prev => ({
      ...prev,
      times: prev.times.includes(time)
        ? prev.times.filter(t => t !== time)
        : [...prev.times, time],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    console.log('Form submission:', form)
    // Simulate delay
    await new Promise(r => setTimeout(r, 500))
    router.push('/spasibo/')
  }

  return (
    <>
      <section className="bg-brand-dark py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-brand-gold text-sm font-semibold uppercase tracking-widest mb-4 block">
            Запись
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Записаться на консультацию
          </h1>
          <p className="text-white/70 text-xl">
            Первая 15-минутная сессия знакомства — бесплатно
          </p>
        </div>
      </section>

      <Section bg="bg-brand-bg">
        <div className="max-w-3xl mx-auto">
          {CALENDLY_URL ? (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-brand-dark mb-6 text-center">Выберите удобное время</h2>
              <CalendlyWidget url={CALENDLY_URL} />
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-brand-dark mb-2">Оставьте заявку</h2>
                <p className="text-brand-muted">Светлана свяжется с вами в течение нескольких часов</p>
              </div>

              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-[var(--shadow-card)] p-8 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">
                    Имя *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full border-2 border-brand-light rounded-lg px-4 py-3 focus:border-brand-primary focus:outline-none transition-colors text-brand-dark"
                    placeholder="Ваше имя"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">
                    Телефон / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full border-2 border-brand-light rounded-lg px-4 py-3 focus:border-brand-primary focus:outline-none transition-colors text-brand-dark"
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full border-2 border-brand-light rounded-lg px-4 py-3 focus:border-brand-primary focus:outline-none transition-colors text-brand-dark"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">
                    Ваш запрос
                  </label>
                  <select
                    value={form.service}
                    onChange={e => setForm(p => ({ ...p, service: e.target.value }))}
                    className="w-full border-2 border-brand-light rounded-lg px-4 py-3 focus:border-brand-primary focus:outline-none transition-colors text-brand-dark bg-white"
                  >
                    <option value="">Выберите...</option>
                    {serviceOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-3">
                    Удобное время (можно несколько)
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {timeOptions.map(time => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => handleTimeToggle(time)}
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all cursor-pointer ${
                          form.times.includes(time)
                            ? 'border-brand-primary bg-brand-primary text-white'
                            : 'border-brand-light text-brand-dark hover:border-brand-primary'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-brand-accent text-white font-semibold py-4 rounded-lg hover:bg-brand-accent/90 transition-all duration-200 text-lg disabled:opacity-70 cursor-pointer"
                >
                  {sending ? 'Отправляем...' : 'Отправить заявку'}
                </button>

                <p className="text-brand-muted text-xs text-center">
                  Нажимая кнопку, вы соглашаетесь с{' '}
                  <a href="/privacy/" className="underline hover:text-brand-primary">политикой конфиденциальности</a>
                </p>
              </form>
            </>
          )}

          {/* Contacts */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="https://wa.me/79035698984"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-5 bg-white rounded-xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all hover:-translate-y-0.5"
            >
              <FaWhatsapp className="text-3xl text-green-500" />
              <div>
                <div className="font-semibold text-brand-dark">WhatsApp</div>
                <div className="text-brand-muted text-sm">Написать в WhatsApp</div>
              </div>
            </a>
            <a
              href="https://t.me/svet_psv_uz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-5 bg-white rounded-xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all hover:-translate-y-0.5"
            >
              <FaTelegram className="text-3xl text-blue-500" />
              <div>
                <div className="font-semibold text-brand-dark">Telegram</div>
                <div className="text-brand-muted text-sm">Написать в Telegram</div>
              </div>
            </a>
          </div>
        </div>
      </Section>
    </>
  )
}
