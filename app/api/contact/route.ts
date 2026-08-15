import { NextResponse } from 'next/server'
import { sendEmail, sendTelegram } from '@/lib/notify'

interface ContactForm {
  name: string
  phone: string
  email: string
  service: string
  times: string[]
}

function formatMessage(form: ContactForm): string {
  const lines = [
    `Новая заявка с сайта toselfness.com`,
    ``,
    `Имя: ${form.name}`,
    `Телефон: ${form.phone}`,
  ]
  if (form.email) lines.push(`Email: ${form.email}`)
  if (form.service) lines.push(`Запрос: ${form.service}`)
  if (form.times?.length) lines.push(`Удобное время: ${form.times.join(', ')}`)
  return lines.join('\n')
}

export async function POST(request: Request) {
  try {
    const form: ContactForm = await request.json()

    if (!form.name || !form.phone) {
      return NextResponse.json({ error: 'Имя и телефон обязательны' }, { status: 400 })
    }

    const text = formatMessage(form)
    const [emailSent, telegramSent] = await Promise.all([
      sendEmail(`Заявка от ${form.name}`, text),
      sendTelegram(text),
    ])

    // Заявку нельзя терять молча: если не ушла ни почта, ни телеграм — говорим об этом.
    if (!emailSent && !telegramSent) {
      console.error('[contact] Заявка никуда не ушла:', text)
      return NextResponse.json(
        {
          error:
            'Заявка не отправилась: сайт не смог связаться с почтой. Напишите Светлане напрямую в WhatsApp +7 903 569-89-84, она ответит лично.',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact] Ошибка отправки заявки:', err)
    return NextResponse.json(
      {
        error:
          'Не удалось отправить заявку. Попробуйте ещё раз или напишите в WhatsApp +7 903 569-89-84.',
      },
      { status: 500 }
    )
  }
}
