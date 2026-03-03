import { makeRouteHandler } from '@keystatic/next/route-handler'
import config from '../../../../keystatic.config'

export const dynamic = 'force-dynamic'

const handler = makeRouteHandler({
  config,
  clientId: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_CLIENT_ID,
  clientSecret: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
  secret: process.env.KEYSTATIC_SECRET,
})

export const GET = handler.GET
export const POST = handler.POST
