const MAIL_TO = 'psv@iofm.ru'
const MAIL_FROM = 'Светлана Попова <noreply@toselfness.com>'

/** Письмо Светлане. Возвращает false, если письмо не ушло — причина уходит в лог Vercel. */
export async function sendEmail(subject: string, text: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[notify] RESEND_API_KEY не задан, письмо не отправлено:', subject)
    return false
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ from: MAIL_FROM, to: [MAIL_TO], subject, text }),
    })

    if (!res.ok) {
      const body = await res.text().catch(() => '')
      console.error(`[notify] Resend ответил ${res.status}: ${body}`)
      return false
    }
    return true
  } catch (err) {
    console.error('[notify] Не удалось обратиться к Resend:', err)
    return false
  }
}

/** Сообщение в телеграм. Если бот не настроен — тихо пропускаем, это не ошибка. */
export async function sendTelegram(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatIds = (process.env.TELEGRAM_CHAT_ID || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)

  if (!token || !chatIds.length) return false

  const results = await Promise.all(
    chatIds.map(async (chatId) => {
      try {
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
        })

        if (!res.ok) {
          const body = await res.text().catch(() => '')
          console.error(`[notify] Телеграм ответил ${res.status} для ${chatId}: ${body}`)
          return false
        }
        return true
      } catch (err) {
        console.error(`[notify] Не удалось обратиться к телеграму для ${chatId}:`, err)
        return false
      }
    })
  )

  return results.some(Boolean)
}
