'use client'
import { useState } from 'react'

const serviceOptions = [
  { value: 'therapy', label: 'Психотерапия' },
  { value: 'career', label: 'Профнавигация' },
  { value: 'coaching', label: 'Сопровождение бизнес-лидеров' },
]

type FormState = {
  name: string
  age: string
  role: string
  service: string
  request: string
  result: string
  text: string
  consent: boolean
}

const initialForm: FormState = {
  name: '',
  age: '',
  role: '',
  service: 'therapy',
  request: '',
  result: '',
  text: '',
  consent: false,
}

export function TestimonialForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState<FormState>(initialForm)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/testimonial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          age: form.age ? Number(form.age) : null,
          role: form.role.trim(),
          service: form.service,
          request: form.request.trim(),
          result: form.result.trim(),
          text: form.text.trim(),
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Ошибка отправки')
      }
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось отправить отзыв. Попробуйте позже.')
    } finally {
      setSending(false)
    }
  }

  function handleClose() {
    setForm(initialForm)
    setDone(false)
    setError('')
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-brand-muted hover:text-brand-dark transition-colors text-2xl leading-none cursor-pointer"
          aria-label="Закрыть"
        >
          &times;
        </button>

        {done ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">💚</div>
            <h3 className="text-2xl font-bold text-brand-dark mb-3" style={{ fontFamily: 'Georgia, serif' }}>
              Спасибо за ваш отзыв!
            </h3>
            <p className="text-brand-muted mb-6">
              Он появится на сайте после проверки Светланой.
            </p>
            <button
              onClick={handleClose}
              className="bg-brand-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-brand-primary/90 transition-colors cursor-pointer"
            >
              Закрыть
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-bold text-brand-dark mb-1" style={{ fontFamily: 'Georgia, serif' }}>
              Оставить отзыв
            </h3>
            <p className="text-brand-muted text-sm mb-6">
              Расскажите о вашем опыте работы со Светланой
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Имя */}
              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-1.5">Имя *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  className="w-full border-2 border-brand-light rounded-lg px-4 py-2.5 focus:border-brand-primary focus:outline-none transition-colors text-brand-dark"
                  placeholder="Как вас представить"
                />
              </div>

              {/* Возраст + Род занятий */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-1.5">Возраст</label>
                  <input
                    type="number"
                    min={10}
                    max={100}
                    value={form.age}
                    onChange={e => set('age', e.target.value)}
                    className="w-full border-2 border-brand-light rounded-lg px-4 py-2.5 focus:border-brand-primary focus:outline-none transition-colors text-brand-dark"
                    placeholder="35"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-1.5">Род занятий</label>
                  <input
                    type="text"
                    value={form.role}
                    onChange={e => set('role', e.target.value)}
                    className="w-full border-2 border-brand-light rounded-lg px-4 py-2.5 focus:border-brand-primary focus:outline-none transition-colors text-brand-dark"
                    placeholder="Менеджер"
                  />
                </div>
              </div>

              {/* Услуга */}
              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-1.5">Услуга *</label>
                <select
                  required
                  value={form.service}
                  onChange={e => set('service', e.target.value)}
                  className="w-full border-2 border-brand-light rounded-lg px-4 py-2.5 focus:border-brand-primary focus:outline-none transition-colors text-brand-dark bg-white"
                >
                  {serviceOptions.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Запрос */}
              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-1.5">С каким запросом обратились *</label>
                <input
                  type="text"
                  required
                  value={form.request}
                  onChange={e => set('request', e.target.value)}
                  className="w-full border-2 border-brand-light rounded-lg px-4 py-2.5 focus:border-brand-primary focus:outline-none transition-colors text-brand-dark"
                  placeholder="Тревожность, выгорание, смена карьеры..."
                />
              </div>

              {/* Результат */}
              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-1.5">Какой результат получили *</label>
                <input
                  type="text"
                  required
                  value={form.result}
                  onChange={e => set('result', e.target.value)}
                  className="w-full border-2 border-brand-light rounded-lg px-4 py-2.5 focus:border-brand-primary focus:outline-none transition-colors text-brand-dark"
                  placeholder="Нашла новое направление, стало легче..."
                />
              </div>

              {/* Текст отзыва */}
              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-1.5">Ваш отзыв *</label>
                <textarea
                  required
                  rows={4}
                  value={form.text}
                  onChange={e => set('text', e.target.value)}
                  className="w-full border-2 border-brand-light rounded-lg px-4 py-2.5 focus:border-brand-primary focus:outline-none transition-colors text-brand-dark resize-none"
                  placeholder="Расскажите подробнее о вашем опыте..."
                />
              </div>

              {/* Согласие */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={form.consent}
                  onChange={e => set('consent', e.target.checked)}
                  className="mt-1 w-4 h-4 accent-brand-primary"
                />
                <span className="text-sm text-brand-muted">
                  Я согласен(а) на публикацию отзыва на сайте и ознакомлен(а) с{' '}
                  <a href="/privacy/" target="_blank" className="underline hover:text-brand-primary">
                    политикой конфиденциальности
                  </a>
                </span>
              </label>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-brand-accent text-white font-semibold py-3 rounded-lg hover:bg-brand-accent/90 transition-all duration-200 text-base disabled:opacity-70 cursor-pointer"
              >
                {sending ? 'Отправляем...' : 'Отправить отзыв'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
