export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')

  const info = {
    clientId: process.env.KEYSTATIC_GITHUB_CLIENT_ID
      ? `set (starts: ${process.env.KEYSTATIC_GITHUB_CLIENT_ID.slice(0, 6)}, len: ${process.env.KEYSTATIC_GITHUB_CLIENT_ID.length})` : 'MISSING',
    clientSecret: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET
      ? `set (length: ${process.env.KEYSTATIC_GITHUB_CLIENT_SECRET.length})` : 'MISSING',
    secret: process.env.KEYSTATIC_SECRET
      ? `set (length: ${process.env.KEYSTATIC_SECRET.length})` : 'MISSING',
    requestUrl: req.url,
  }

  if (!code) return Response.json(info)

  // Test token exchange with the provided code
  const tokenUrl = new URL('https://github.com/login/oauth/access_token')
  tokenUrl.searchParams.set('client_id', process.env.KEYSTATIC_GITHUB_CLIENT_ID!)
  tokenUrl.searchParams.set('client_secret', process.env.KEYSTATIC_GITHUB_CLIENT_SECRET!)
  tokenUrl.searchParams.set('code', code)

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { Accept: 'application/json' },
  })

  const body = await res.json()

  return Response.json({ ...info, githubStatus: res.status, githubResponse: body })
}
