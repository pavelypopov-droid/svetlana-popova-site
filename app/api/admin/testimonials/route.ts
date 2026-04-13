import { NextResponse } from 'next/server'
import { verifyAdmin } from '../auth/route'

const REPO = 'pavelypopov-droid/svetlana-popova-site'

interface GitHubFile {
  name: string
  path: string
  download_url: string
}

function extractDateFromSlug(slug: string): string | null {
  // Slugs from form submissions have base36 timestamp: "name-mn7csrhj"
  const lastHyphen = slug.lastIndexOf('-')
  if (lastHyphen === -1) return null
  const suffix = slug.slice(lastHyphen + 1)
  // base36 timestamp should be 7-9 chars, all alphanumeric
  if (!/^[a-z0-9]{7,9}$/.test(suffix)) return null
  const ts = parseInt(suffix, 36)
  // Sanity check: should be a valid date after 2024
  if (ts < 1700000000000 || ts > 2000000000000) return null
  return new Date(ts).toISOString()
}

function parseYaml(content: string): Record<string, string> {
  const result: Record<string, string> = {}
  let currentKey = ''
  let currentValue = ''

  for (const line of content.split('\n')) {
    const match = line.match(/^(\w+):\s*(.*)$/)
    if (match) {
      if (currentKey) result[currentKey] = currentValue
      currentKey = match[1]
      let val = match[2].trim()
      // Remove surrounding quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1).replace(/\\n/g, '\n').replace(/\\"/g, '"')
      }
      currentValue = val
    }
  }
  if (currentKey) result[currentKey] = currentValue
  return result
}

export async function GET() {
  if (!verifyAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'GITHUB_TOKEN not configured' }, { status: 500 })
  }

  // List files in testimonials directory
  const listRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/content/testimonials`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      next: { revalidate: 0 },
    }
  )

  if (!listRes.ok) {
    return NextResponse.json({ error: 'Failed to list testimonials' }, { status: 500 })
  }

  const files: GitHubFile[] = await listRes.json()
  const yamlFiles = files.filter((f) => f.name.endsWith('.yaml'))

  // Fetch all files in parallel
  const testimonials = await Promise.all(
    yamlFiles.map(async (file) => {
      const res = await fetch(file.download_url, { next: { revalidate: 0 } })
      if (!res.ok) return null
      const content = await res.text()
      const data = parseYaml(content)
      const slug = file.name.replace('.yaml', '')
      const createdAt = extractDateFromSlug(slug)
      return { slug, createdAt: createdAt || '', ...data } as Record<string, string> & { slug: string }
    })
  )

  const result = testimonials
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => {
      const order: Record<string, number> = { pending: 0, approved: 1, rejected: 2 }
      const aStatus = (a as Record<string, string>).status ?? 'approved'
      const bStatus = (b as Record<string, string>).status ?? 'approved'
      const statusDiff = (order[aStatus] ?? 1) - (order[bStatus] ?? 1)
      if (statusDiff !== 0) return statusDiff
      // Within same status group, newest first
      const aDate = (a as Record<string, string>).createdAt || ''
      const bDate = (b as Record<string, string>).createdAt || ''
      return bDate.localeCompare(aDate)
    })

  return NextResponse.json(result)
}
