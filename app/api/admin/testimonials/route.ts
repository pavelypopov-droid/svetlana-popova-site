import { NextResponse } from 'next/server'
import { verifyAdmin } from '../auth/route'

const REPO = 'pavelypopov-droid/svetlana-popova-site'

interface GitHubFile {
  name: string
  path: string
  download_url: string
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
      return { slug, ...data } as Record<string, string> & { slug: string }
    })
  )

  const result = testimonials
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => {
      const order: Record<string, number> = { pending: 0, approved: 1, rejected: 2 }
      const aStatus = (a as Record<string, string>).status ?? 'approved'
      const bStatus = (b as Record<string, string>).status ?? 'approved'
      return (order[aStatus] ?? 1) - (order[bStatus] ?? 1)
    })

  return NextResponse.json(result)
}
