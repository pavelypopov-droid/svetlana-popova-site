import { NextResponse } from 'next/server'
import { sendEmail, sendTelegram } from '@/lib/notify'

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
  lines.push(`Полная переписка отправлена на почту psv@iofm.ru.`)

  return lines.join('\n')
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

    const subject = payload.contactName
      ? `Переписка с ИИ: ${payload.contactName}`
      : `Переписка с ИИ-помощником (анонимный посетитель)`

    const [emailSent, telegramSent] = await Promise.all([
      sendEmail(subject, formatTranscript(payload)),
      sendTelegram(formatTelegramMessage(payload)),
    ])

    if (!emailSent && !telegramSent) {
      console.error('[transcript] Переписка никуда не ушла:', formatTranscript(payload))
      return NextResponse.json({ error: 'Не удалось отправить переписку' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Ошибка отправки' }, { status: 500 })
  }
}
