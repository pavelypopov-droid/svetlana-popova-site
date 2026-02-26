/**
 * Custom refresh-token handler for non-expiring GitHub OAuth tokens.
 * Keystatic calls this on every page load to renew the session.
 * Standard OAuth Apps issue non-expiring tokens, so we just re-set
 * the existing access token cookie to confirm the session is valid.
 */
export const dynamic = 'force-dynamic'

const ONE_YEAR = 60 * 60 * 24 * 365

export async function POST(req: Request) {
  const cookieHeader = req.headers.get('cookie') ?? ''
  const match = cookieHeader.match(/keystatic-gh-access-token=([^;]+)/)
  const accessToken = match ? decodeURIComponent(match[1]) : null

  if (!accessToken) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Token is valid — re-set the cookie to extend session
  // NOTE: No HttpOnly — Keystatic reads this cookie via document.cookie on the client
  const isSecure = process.env.NODE_ENV === 'production'
  const cookieOpts = `Path=/; SameSite=Lax; ${isSecure ? 'Secure; ' : ''}Max-Age=${ONE_YEAR}`

  return new Response('', {
    status: 200,
    headers: {
      'Set-Cookie': `keystatic-gh-access-token=${accessToken}; ${cookieOpts}`,
    },
  })
}
