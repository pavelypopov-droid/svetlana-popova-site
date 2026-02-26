/**
 * Custom OAuth callback that overrides Keystatic's built-in handler.
 * Keystatic's handler requires expires_in + refresh_token (expiring tokens),
 * but standard GitHub OAuth Apps return non-expiring tokens without these fields.
 * This handler accepts both and sets the keystatic-gh-access-token cookie directly.
 */
export const dynamic = 'force-dynamic'

const ONE_YEAR = 60 * 60 * 24 * 365

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const errorDescription = url.searchParams.get('error_description')

  if (errorDescription) {
    return new Response(`GitHub auth error: ${errorDescription}`, { status: 400 })
  }

  if (!code) {
    return new Response('Bad Request: missing code', { status: 400 })
  }

  // Exchange code for access token
  const tokenUrl = new URL('https://github.com/login/oauth/access_token')
  tokenUrl.searchParams.set('client_id', process.env.KEYSTATIC_GITHUB_CLIENT_ID!)
  tokenUrl.searchParams.set('client_secret', process.env.KEYSTATIC_GITHUB_CLIENT_SECRET!)
  tokenUrl.searchParams.set('code', code)

  const tokenRes = await fetch(tokenUrl.toString(), {
    method: 'POST',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  })

  const tokenData = await tokenRes.json() as Record<string, unknown>

  if (!tokenData.access_token || typeof tokenData.access_token !== 'string') {
    return new Response(
      `Authorization failed: ${JSON.stringify(tokenData)}`,
      { status: 401 }
    )
  }

  const isSecure = process.env.NODE_ENV === 'production'
  const cookieOpts = `Path=/; SameSite=Lax; ${isSecure ? 'Secure; ' : ''}HttpOnly`
  const maxAge = typeof tokenData.expires_in === 'number' ? tokenData.expires_in : ONE_YEAR

  const headers = new Headers()
  headers.append(
    'Set-Cookie',
    `keystatic-gh-access-token=${tokenData.access_token}; ${cookieOpts}; Max-Age=${maxAge}`
  )

  // Read state cookie to know where to redirect after login
  const cookieHeader = req.headers.get('cookie') ?? ''
  const stateCookieMatch = state
    ? cookieHeader.match(new RegExp(`ks-${state}=([^;]+)`))
    : null
  const from = stateCookieMatch ? decodeURIComponent(stateCookieMatch[1]) : ''
  const redirectTo = from && from.startsWith('/keystatic') ? from : '/keystatic'

  headers.set('Location', redirectTo)
  return new Response(null, { status: 302, headers })
}
