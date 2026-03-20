import { NextResponse } from 'next/server'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface TranscriptPayload {
  messages: ChatMessage[]
  contactName?: string
  contactPhone?: string
  contactEmail?: string
  consentGiven: boolean
}

function formatTranscript(payload: TranscriptPayload): string {
  const { messages, contactName, contactPhone, contactEmail } = payload
  const now = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })

  const lines: string[] = [
    `📬 Переписка с ИИ-помощником`,
    `📅 ${now}`,
    ``,
  ]

  if (contactName || contactPhone || contactEmail) {
    lines.push(`👤 Контакт:`)
    if (contactName) lines.push(`   Имя: ${contactName}`)
    if (contactPhone) lines.push(`   Телефон: ${contactPhone}`)
    if (contactEmail) lines.push(`   Email: ${contactEmail}`)
    lines.push(``)
  }

  lines.push(`💬 Диалог (${messages.length} сообщений):`)
  lines.push(`${'─'.repeat(40)}`)

  for (const msg of messages) {
    const sender = msg.role === 'user' ? '👤 Посетитель' : '🤖 Помощник'
    lines.push(`${sender}:`)
    lines.push(msg.content)
    lines.push(``)
  }

  lines.push(`${'─'.repeat(40)}`)
  lines.push(`✅ Согласие на сохранение переписки: получено`)

  return lines.join('\n')
}

function formatTelegramMessage(payload: TranscriptPayload): string {
  const { contactName, contactPhone, contactEmail, messages } = payload
  const userMessages = messages.filter((m) => m.role === 'user').length

  const lines: string[] = [
    `💬 Новый диалог с ИИ-помощником`,
    ``,
  ]

  if (contactName) lines.push(`👤 ${contactName}`)
  if (contactPhone) lines.push(`📞 ${contactPhone}`)
  if (contactEmail) lines.push(`✉️ ${contactEmail}`)
  lines.push(`📊 ${userMessages} сообщений от посетителя`)
  lines.push(``)
  lines.push(`Полная переписка отправлена на почту.`)

  return lines.join('\n')
}

async function sendEmail(payload: TranscriptPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.log('RESEND_API_KEY not set, transcript:', formatTranscript(payload))
    return
  }

  const subject = payload.contactName
    ? `Переписка с ИИ: ${payload.contactName}`
    : `Переписка с ИИ-помощником (анонимный посетитель)`

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: 'Светлана Попова <noreply@toselfness.com>',
      to: ['psv@iofm.ru'],
      subject,
      text: formatTranscript(payload),
    }),
  })
}

async function sendTelegram(payload: TranscriptPayload): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: formatTelegramMessage(payload),
      parse_mode: 'HTML',
    }),
  })
}

export async function POST(request: Request) {
  try {
    const payload: TranscriptPayload = await request.json()

    if (!payload.consentGiven) {
      return NextResponse.json({ error: 'Согласие не получено' }, { status: 400 })
    }

    if (!payload.messages?.length) {
      return NextResponse.json({ error: 'Нет сообщений' }, { status: 400 })
    }

    await Promise.allSettled([sendEmail(payload), sendTelegram(payload)])

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Ошибка отправки' }, { status: 500 })
  }
}
