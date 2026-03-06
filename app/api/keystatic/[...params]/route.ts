import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

async function getHandler() {
  const { makeRouteHandler } = await import('@keystatic/next/route-handler')
  const { default: config } = await import('../../../../keystatic.config')
  return makeRouteHandler({
    config,
    clientId: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_CLIENT_ID,
    clientSecret: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
    secret: process.env.KEYSTATIC_SECRET,
  })
}

export async function GET(req: NextRequest) {
  const handler = await getHandler()
  return handler.GET(req)
}

export async function POST(req: NextRequest) {
  const handler = await getHandler()
  return handler.POST(req)
}
