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

const MAX_USER_MESSAGES = 3

// Последний ответ не должен обрываться вопросом, на который человеку уже не ответить.
const FINAL_TURN_HINT = `

ВАЖНО: это твой последний ответ в этом диалоге, поле ввода после него закроется.
Ответь двумя предложениями: коротко отрази то, что человек рассказал, и скажи, что с этим
можно поработать. Никаких вопросов, ни одного знака «?». Про запись писать не нужно,
это будет добавлено после тебя.`

// Последнее слово в диалоге всегда за нами, а не за моделью.
const FINAL_TURN_CLOSING = `Дальше лучше поговорить со Светланой лично. Первая встреча длится 15 минут и она бесплатная: нажмите кнопку «Записаться» ниже или напишите в WhatsApp +7 903 569-89-84.`

/** Отрезает вопросы в конце ответа: отвечать на них человеку будет уже негде. */
function dropTrailingQuestions(text: string): string {
  const sentences = text.match(/[^.!?…]+[.!?…]*/g) || []
  while (sentences.length && /\?\s*$/.test(sentences[sentences.length - 1])) sentences.pop()
  return sentences.join('').trim()
}

/** Отдаёт готовый текст тем же потоком, что и обычные ответы, чтобы не менять виджет. */
function textAsStream(text: string): Response {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`))
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}

// Стриминг длинного ответа не должен упираться в лимит функции.
export const maxDuration = 30

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

    const userMessages = messages.filter((m) => m.role === 'user').length

    if (userMessages > MAX_USER_MESSAGES) {
      return NextResponse.json({
        message:
          'Мы уже хорошо пообщались! Для более глубокой работы я рекомендую записаться к Светлане — первые 15 минут бесплатно. Вы можете сделать это на странице toselfness.com/zapis или написать в WhatsApp: +79035698984',
        limitReached: true,
      })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error('[chat] OPENAI_API_KEY не задан')
      return NextResponse.json(
        { error: 'Помощник сейчас недоступен. Напишите Светлане в WhatsApp: +79035698984' },
        { status: 503 }
      )
    }

    const isFinalTurn = userMessages >= MAX_USER_MESSAGES

    // Третье сообщение закрывает разговор: собираем ответ целиком, чтобы снять
    // повисший вопрос и своими словами отправить человека к Светлане.
    if (isFinalTurn) {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'system', content: SYSTEM_PROMPT + FINAL_TURN_HINT }, ...messages],
          temperature: 0.6,
          max_tokens: 200,
        }),
      })

      let reflection = ''
      if (res.ok) {
        const data = await res.json().catch(() => null)
        reflection = dropTrailingQuestions(
          (data?.choices?.[0]?.message?.content || '').trim()
        )
      } else {
        const body = await res.text().catch(() => '')
        console.error(`[chat] OpenAI ответил ${res.status} на последнем сообщении: ${body.slice(0, 500)}`)
      }

      // Даже если модель промолчала, прощание человек всё равно увидит.
      return textAsStream(
        reflection ? `${reflection}\n\n${FINAL_TURN_CLOSING}` : FINAL_TURN_CLOSING
      )
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
      const body = await response.text().catch(() => '')
      console.error(`[chat] OpenAI ответил ${response.status}: ${body.slice(0, 500)}`)
      return NextResponse.json(
        {
          error:
            'Помощник сейчас не отвечает. Попробуйте через минуту или напишите Светлане в WhatsApp: +79035698984',
        },
        { status: 502 }
      )
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
        } catch (err) {
          console.error('[chat] Поток от OpenAI оборвался:', err)
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
  } catch (err) {
    console.error('[chat] Необработанная ошибка:', err)
    return NextResponse.json(
      {
        error:
          'Что-то пошло не так на нашей стороне. Попробуйте ещё раз или напишите Светлане в WhatsApp: +79035698984',
      },
      { status: 500 }
    )
  }
}
