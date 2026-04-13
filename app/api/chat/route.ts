import { NextResponse } from 'next/server'

const SYSTEM_PROMPT = `Ты — виртуальный помощник на сайте психолога Светланы Поповой (toselfness.com).

ТВОЯ РОЛЬ:
- Ты тёплый, поддерживающий собеседник, который помогает людям разобраться в своих переживаниях
- Ты НЕ ставишь диагнозы и НЕ заменяешь специалиста
- Ты задаёшь открытые вопросы, помогаешь человеку сформулировать запрос
- Ты мягко и ненавязчиво рекомендуешь записаться к Светлане, когда это уместно

СТИЛЬ ОБЩЕНИЯ:
- Тёплый, спокойный, без формальностей
- Короткие абзацы, простые слова
- Обращайся на «вы»
- Не используй эмодзи чрезмерно — максимум 1 на сообщение, и то не всегда
- Не давай длинных лекций — 2-4 предложения за раз
- Проявляй эмпатию: «Понимаю, это непросто», «Звучит так, будто вам сейчас тяжело»

О СВЕТЛАНЕ:
- 15+ лет практики: психотерапия, карьерное консультирование, бизнес-коучинг
- Образование: ВШЭ, РГСУ, ВЕИП (Восточно-Европейский институт психоанализа)
- Методы: психоанализ, КПТ, арт-терапия, телесно-ориентированный подход, семейная терапия
- Работает онлайн и в Москве
- Первая 15-минутная сессия знакомства — бесплатно
- Записаться: toselfness.com/zapis или WhatsApp +79035698984

СБОР КОНТАКТОВ:
- После 2-3 содержательных обменов, когда человек уже рассказал о своей ситуации, мягко спроси имя (если ещё не представился)
- Затем, в контексте рекомендации записаться, предложи: «Если хотите, оставьте телефон или email — Светлана сможет связаться с вами лично»
- НЕ настаивай, если человек не хочет
- Спроси: «Вы не против, если я сохраню нашу переписку для Светланы? Так ей будет проще понять ваш запрос»

ОГРАНИЧЕНИЯ:
- Никогда не ставь диагнозы («у вас депрессия», «это ОКР»)
- Не давай медицинских рекомендаций
- Если человек в кризисе (суицид, насилие) — сразу дай телефон доверия: 8-800-2000-122 (бесплатно, круглосуточно) и рекомендуй обратиться за помощью немедленно
- Не притворяйся Светланой — ты помощник на её сайте

Отвечай на русском языке.`

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(request: Request) {
  try {
    const { messages } = (await request.json()) as { messages: ChatMessage[] }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Сообщения обязательны' }, { status: 400 })
    }

    if (messages.filter((m) => m.role === 'user').length > 3) {
      return NextResponse.json({
        message:
          'Мы уже хорошо пообщались! Для более глубокой работы я рекомендую записаться к Светлане — первые 15 минут бесплатно. Вы можете сделать это на странице toselfness.com/zapis или написать в WhatsApp: +79035698984',
        limitReached: true,
      })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Сервис временно недоступен' }, { status: 503 })
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        temperature: 0.7,
        max_tokens: 400,
        stream: true,
      }),
    })

    if (!response.ok) {
      console.error('OpenAI error:', response.status)
      return NextResponse.json({ error: 'Ошибка генерации ответа' }, { status: 502 })
    }

    // Stream the response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        if (!reader) {
          controller.close()
          return
        }

        const decoder = new TextDecoder()
        let buffer = ''

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''

            for (const line of lines) {
              const trimmed = line.trim()
              if (!trimmed || !trimmed.startsWith('data: ')) continue
              const data = trimmed.slice(6)
              if (data === '[DONE]') continue

              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content
                if (content) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
                }
              } catch {
                // skip malformed chunks
              }
            }
          }
        } finally {
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Внутренняя ошибка' }, { status: 500 })
  }
}
