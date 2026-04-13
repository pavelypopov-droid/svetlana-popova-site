import { NextResponse } from 'next/server'
import { verifyAdmin } from '../../auth/route'

const REPO = 'pavelypopov-droid/svetlana-popova-site'

export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
  if (!verifyAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { status } = await request.json()
  if (!['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'GITHUB_TOKEN not configured' }, { status: 500 })
  }

  const filePath = `content/testimonials/${params.slug}.yaml`
  const url = `https://api.github.com/repos/${REPO}/contents/${filePath}`

  // Get current file content and SHA
  const fileRes = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  })

  if (!fileRes.ok) {
    return NextResponse.json({ error: 'Отзыв не найден' }, { status: 404 })
  }

  const fileData = await fileRes.json()
  const currentContent = Buffer.from(fileData.content, 'base64').toString('utf-8')

  // Replace status in YAML
  const updatedContent = currentContent.replace(
    /^status:\s*\w+$/m,
    `status: ${status}`
  )

  // Update file via GitHub API
  const updateRes = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.v3+json',
    },
    body: JSON.stringify({
      message: `${status === 'approved' ? 'Одобрен' : 'Отклонён'} отзыв: ${params.slug}`,
      content: Buffer.from(updatedContent).toString('base64'),
      sha: fileData.sha,
      branch: 'main',
    }),
  })

  if (!updateRes.ok) {
    const err = await updateRes.json().catch(() => ({}))
    return NextResponse.json(
      { error: err.message || 'GitHub API error' },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true, status })
}
