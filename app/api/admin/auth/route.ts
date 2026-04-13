import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

function makeToken(login: string, password: string): string {
  const secret = process.env.ADMIN_PASSWORD || ''
  return crypto.createHmac('sha256', secret).update(`${login}:${password}`).digest('hex')
}

export function verifyAdmin(): boolean {
  const cookieStore = cookies()
  const token = cookieStore.get('admin-token')?.value
  if (!token) return false

  const expectedLogin = process.env.ADMIN_LOGIN || ''
  const expectedPassword = process.env.ADMIN_PASSWORD || ''
  const expectedToken = makeToken(expectedLogin, expectedPassword)

  return token === expectedToken
}

export async function POST(request: Request) {
  const { login, password } = await request.json()

  const expectedLogin = process.env.ADMIN_LOGIN
  const expectedPassword = process.env.ADMIN_PASSWORD

  if (!expectedLogin || !expectedPassword) {
    return NextResponse.json({ error: 'Админ не настроен' }, { status: 500 })
  }

  if (login !== expectedLogin || password !== expectedPassword) {
    return NextResponse.json({
      error: 'Неверный логин или пароль',
      debug: {
        hasLogin: !!expectedLogin,
        hasPassword: !!expectedPassword,
        loginLength: expectedLogin?.length,
        passwordLength: expectedPassword?.length,
      },
    }, { status: 401 })
  }

  const token = makeToken(login, password)

  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete('admin-token')
  return res
}
