import { NextResponse } from 'next/server'
import { verifyAdmin } from '../auth/route'
import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../../../../keystatic.config'

const reader = createReader(process.cwd(), keystaticConfig)

export async function GET() {
  if (!verifyAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const slugs = await reader.collections.testimonials.list()
  const items = await Promise.all(
    slugs.map(async (slug) => {
      const item = await reader.collections.testimonials.read(slug)
      return item ? { slug, ...item } : null
    })
  )

  const testimonials = items
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => {
      // pending first, then approved, then rejected
      const order: Record<string, number> = { pending: 0, approved: 1, rejected: 2 }
      return (order[a.status ?? 'approved'] ?? 1) - (order[b.status ?? 'approved'] ?? 1)
    })

  return NextResponse.json(testimonials)
}
