export const dynamic = 'force-dynamic'

export async function GET() {
  return Response.json({
    clientId: process.env.KEYSTATIC_GITHUB_CLIENT_ID
      ? `set (${process.env.KEYSTATIC_GITHUB_CLIENT_ID.slice(0, 6)}...)` : 'MISSING',
    clientSecret: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET
      ? `set (length: ${process.env.KEYSTATIC_GITHUB_CLIENT_SECRET.length})` : 'MISSING',
    secret: process.env.KEYSTATIC_SECRET
      ? `set (length: ${process.env.KEYSTATIC_SECRET.length})` : 'MISSING',
    nextPublicClientId: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_CLIENT_ID
      ? `set (${process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_CLIENT_ID.slice(0, 6)}...)` : 'MISSING',
  })
}
