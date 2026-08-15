import { NextResponse } from 'next/server'
import { sendEmail, sendTelegram } from '@/lib/notify'

interface TestimonialInput {
  name: string
  age: number | null
  role: string
  service: string
  request: string
  result: string
  text: string
}

const VALID_SERVICES = ['therapy', 'career', 'coaching']

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[ёе]/g, 'e')
    .replace(/[а]/g, 'a')
    .replace(/[б]/g, 'b')
    .replace(/[в]/g, 'v')
    .replace(/[г]/g, 'g')
    .replace(/[д]/g, 'd')
    .replace(/[ж]/g, 'zh')
    .replace(/[з]/g, 'z')
    .replace(/[и]/g, 'i')
    .replace(/[й]/g, 'y')
    .replace(/[к]/g, 'k')
    .replace(/[л]/g, 'l')
    .replace(/[м]/g, 'm')
    .replace(/[н]/g, 'n')
    .replace(/[о]/g, 'o')
    .replace(/[п]/g, 'p')
    .replace(/[р]/g, 'r')
    .replace(/[с]/g, 's')
    .replace(/[т]/g, 't')
    .replace(/[у]/g, 'u')
    .replace(/[ф]/g, 'f')
    .replace(/[х]/g, 'h')
    .replace(/[ц]/g, 'ts')
    .replace(/[ч]/g, 'ch')
    .replace(/[ш]/g, 'sh')
    .replace(/[щ]/g, 'shch')
    .replace(/[ъь]/g, '')
    .replace(/[ы]/g, 'y')
    .replace(/[э]/g, 'e')
    .replace(/[ю]/g, 'yu')
    .replace(/[я]/g, 'ya')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function escapeYaml(str: string): string {
  if (/[:#{}[\],&*?|><!%@`"']/.test(str) || str.includes('\n') || str.startsWith(' ') || str.endsWith(' ')) {
    return `"${str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`
  }
  return str
}

function toYaml(data: TestimonialInput): string {
  const lines = [
    `name: ${escapeYaml(data.name)}`,
    `status: pending`,
  ]
  if (data.age) lines.push(`age: ${data.age}`)
  if (data.role) lines.push(`role: ${escapeYaml(data.role)}`)
  lines.push(`service: ${data.service}`)
  lines.push(`request: ${escapeYaml(data.request)}`)
  lines.push(`result: ${escapeYaml(data.result)}`)
  lines.push(`text: ${escapeYaml(data.text)}`)
  return lines.join('\n') + '\n'
}

async function createFileViaGitHub(slug: string, content: string): Promise<void> {
  const token = process.env.GITHUB_TOKEN
  if (!token) throw new Error('GITHUB_TOKEN не задан в переменных окружения')

  const repo = 'pavelypopov-droid/svetlana-popova-site'
  const path = `content/testimonials/${slug}.yaml`
  const url = `https://api.github.com/repos/${repo}/contents/${path}`

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.v3+json',
    },
    body: JSON.stringify({
      message: `Новый отзыв: ${slug}`,
      content: Buffer.from(content).toString('base64'),
      branch: 'main',
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const hint =
      res.status === 401
        ? ' (похоже, истёк срок жизни GITHUB_TOKEN — нужно выпустить новый и обновить его в Vercel)'
        : ''
    throw new Error(`GitHub ответил ${res.status}: ${err.message || 'без пояснения'}${hint}`)
  }
}

const SERVICE_LABELS: Record<string, string> = {
  therapy: 'Психотерапия',
  career: 'Профнавигация',
  coaching: 'Сопровождение',
}

function formatTestimonial(data: TestimonialInput, savedToCms: boolean): string {
  const lines = [
    `Новый отзыв на сайте toselfness.com`,
    ``,
    `Имя: ${data.name}${data.age ? `, ${data.age} лет` : ''}${data.role ? ` (${data.role})` : ''}`,
    `Услуга: ${SERVICE_LABELS[data.service] || data.service}`,
    `Запрос: ${data.request}`,
    `Результат: ${data.result}`,
    ``,
    `Текст отзыва:`,
    data.text,
    ``,
  ]

  if (savedToCms) {
    lines.push(`Отзыв ждёт проверки: https://toselfness.com/admin`)
  } else {
    lines.push(
      `ВНИМАНИЕ: сохранить отзыв в CMS не удалось, он есть только в этом письме.`,
      `Скопируйте текст и добавьте отзыв вручную: https://toselfness.com/keystatic`
    )
  }

  return lines.join('\n')
}

export async function POST(request: Request) {
  try {
    const data: TestimonialInput = await request.json()

    // Validation
    if (!data.name?.trim()) {
      return NextResponse.json({ error: 'Укажите имя' }, { status: 400 })
    }
    if (!data.request?.trim() || !data.result?.trim() || !data.text?.trim()) {
      return NextResponse.json({ error: 'Заполните все обязательные поля' }, { status: 400 })
    }
    if (!VALID_SERVICES.includes(data.service)) {
      return NextResponse.json({ error: 'Некорректная услуга' }, { status: 400 })
    }
    if (data.text.length > 3000) {
      return NextResponse.json({ error: 'Отзыв слишком длинный (макс. 3000 символов)' }, { status: 400 })
    }

    // Generate unique slug
    const timestamp = Date.now().toString(36)
    const slug = `${slugify(data.name)}-${timestamp}`

    // Пробуем сохранить в CMS. Если не вышло — отзыв не теряем, он уйдёт письмом.
    let savedToCms = true
    try {
      await createFileViaGitHub(slug, toYaml(data))
    } catch (err) {
      savedToCms = false
      console.error('Отзыв не сохранён в CMS:', err)
    }

    const subject = savedToCms
      ? `Новый отзыв от ${data.name}`
      : `Новый отзыв от ${data.name} — НЕ сохранён в CMS`
    const body = formatTestimonial(data, savedToCms)

    const [emailSent, telegramSent] = await Promise.all([
      sendEmail(subject, body),
      sendTelegram(body),
    ])

    // Всё легло — только тогда честно говорим человеку, что не получилось.
    if (!savedToCms && !emailSent && !telegramSent) {
      return NextResponse.json(
        {
          error:
            'Отзыв не удалось отправить: сайт сейчас не может связаться с почтой. Напишите Светлане в WhatsApp +7 903 569-89-84, она добавит отзыв вручную.',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Testimonial submission error:', err)
    return NextResponse.json(
      {
        error:
          'Не удалось сохранить отзыв. Попробуйте ещё раз через пару минут или напишите Светлане в WhatsApp +7 903 569-89-84.',
      },
      { status: 500 }
    )
  }
}
