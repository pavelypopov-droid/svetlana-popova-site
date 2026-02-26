export const dynamic = 'force-dynamic'

import type { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { makeRouteHandler } = await import('@keystatic/next/route-handler')
  const { default: config } = await import('../../../../keystatic.config')
  const { GET } = makeRouteHandler({ config })
  return GET(req)
}

export async function POST(req: NextRequest) {
  const { makeRouteHandler } = await import('@keystatic/next/route-handler')
  const { default: config } = await import('../../../../keystatic.config')
  const { POST } = makeRouteHandler({ config })
  return POST(req)
}
