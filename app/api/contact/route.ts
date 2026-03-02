import { NextResponse } from 'next/server'

interface ContactForm {
  name: string
  phone: string
  email: string
  service: string
  times: string[]
}

function formatMessage(form: ContactForm): string {
  const lines = [
    `📋 Новая заявка с сайта`,
    ``,
    `👤 Имя: ${form.name}`,
    `📞 Телефон: ${form.phone}`,
  ]
  if (form.email) lines.push(`✉️ Email: ${form.email}`)
  if (form.service) lines.push(`🎯 Запрос: ${form.service}`)
  if (form.times?.length) lines.push(`🕐 Удобное время: ${form.times.join(', ')}`)
  return lines.join('\n')
}

async function sendTelegram(form: ContactForm): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: formatMessage(form),
      parse_mode: 'HTML',
    }),
  })
}

async function sendEmail(form: ContactForm): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: 'Сайт Светланы Поповой <onboarding@resend.dev>',
      to: ['psv@iofm.ru'],
      subject: `Заявка от ${form.name}`,
      text: formatMessage(form),
    }),
  })
}

export async function POST(request: Request) {
  try {
    const form: ContactForm = await request.json()

    if (!form.name || !form.phone) {
      return NextResponse.json({ error: 'Имя и телефон обязательны' }, { status: 400 })
    }

    await Promise.allSettled([sendTelegram(form), sendEmail(form)])

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Ошибка отправки' }, { status: 500 })
  }
}
