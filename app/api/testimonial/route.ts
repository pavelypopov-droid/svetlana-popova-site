import { NextResponse } from 'next/server'

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
  if (!token) throw new Error('GITHUB_TOKEN not configured')

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
    throw new Error(err.message || `GitHub API error: ${res.status}`)
  }
}

const SERVICE_LABELS: Record<string, string> = {
  therapy: 'Психотерапия',
  career: 'Профнавигация',
  coaching: 'Сопровождение',
}

async function notifyTelegram(data: TestimonialInput): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return

  const text = [
    `📝 Новый отзыв на сайте`,
    ``,
    `👤 ${data.name}${data.age ? `, ${data.age} лет` : ''}${data.role ? ` (${data.role})` : ''}`,
    `🎯 Услуга: ${SERVICE_LABELS[data.service] || data.service}`,
    `📋 Запрос: ${data.request}`,
    `✅ Результат: ${data.result}`,
    ``,
    `💬 «${data.text.slice(0, 200)}${data.text.length > 200 ? '...' : ''}»`,
    ``,
    `➡️ Проверьте в CMS: https://toselfness.com/keystatic`,
  ].join('\n')

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  })
}

async function notifyEmail(data: TestimonialInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return

  const text = [
    `Новый отзыв на сайте toselfness.com`,
    ``,
    `Имя: ${data.name}`,
    `Услуга: ${SERVICE_LABELS[data.service] || data.service}`,
    `Запрос: ${data.request}`,
    `Результат: ${data.result}`,
    ``,
    `Текст отзыва:`,
    data.text,
    ``,
    `Проверьте в CMS: https://toselfness.com/keystatic`,
  ].join('\n')

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: 'Светлана Попова <noreply@toselfness.com>',
      to: ['psv@iofm.ru'],
      subject: `Новый отзыв от ${data.name}`,
      text,
    }),
  })
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

    // Create YAML file in GitHub
    const yaml = toYaml(data)
    await createFileViaGitHub(slug, yaml)

    // Notify (non-blocking)
    await Promise.allSettled([notifyTelegram(data), notifyEmail(data)])

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Testimonial submission error:', err)
    return NextResponse.json(
      { error: 'Не удалось сохранить отзыв. Попробуйте позже.' },
      { status: 500 }
    )
  }
}
