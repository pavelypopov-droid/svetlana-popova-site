'use client'

import { useState, useEffect, useCallback } from 'react'

interface Testimonial {
  slug: string
  name: string
  status: string
  age?: number
  role?: string
  service: string
  request: string
  result: string
  text: string
}

const SERVICE_LABELS: Record<string, string> = {
  therapy: 'Психотерапия',
  career: 'Профнавигация',
  coaching: 'Сопровождение',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'На модерации',
  approved: 'Одобрен',
  rejected: 'Отклонён',
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  approved: '#10b981',
  rejected: '#ef4444',
}

export default function AdminPage() {
  const [isAuth, setIsAuth] = useState(false)
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState<string | null>(null)

  const fetchTestimonials = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/testimonials')
    if (res.ok) {
      setTestimonials(await res.json())
    } else if (res.status === 401) {
      setIsAuth(false)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    // Check if already authenticated
    fetch('/api/admin/testimonials').then((res) => {
      if (res.ok) {
        setIsAuth(true)
        res.json().then(setTestimonials)
      }
    })
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    })
    if (res.ok) {
      setIsAuth(true)
      setPassword('')
      fetchTestimonials()
    } else {
      setAuthError('Неверный логин или пароль')
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    setIsAuth(false)
    setTestimonials([])
  }

  const handleStatus = async (slug: string, status: 'approved' | 'rejected') => {
    setUpdating(slug)
    const res = await fetch(`/api/admin/testimonials/${slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setTestimonials((prev) =>
        prev.map((t) => (t.slug === slug ? { ...t, status } : t))
          .sort((a, b) => {
            const order: Record<string, number> = { pending: 0, approved: 1, rejected: 2 }
            return (order[a.status] ?? 1) - (order[b.status] ?? 1)
          })
      )
    }
    setUpdating(null)
  }

  if (!isAuth) {
    return (
      <div style={styles.loginWrapper}>
        <form onSubmit={handleLogin} style={styles.loginForm}>
          <h1 style={styles.loginTitle}>Модерация отзывов</h1>
          <p style={styles.loginSubtitle}>toselfness.com</p>
          <input
            type="text"
            placeholder="Логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            style={styles.input}
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            autoComplete="current-password"
          />
          {authError && <p style={styles.error}>{authError}</p>}
          <button type="submit" style={styles.loginBtn}>Войти</button>
        </form>
      </div>
    )
  }

  const pendingCount = testimonials.filter((t) => t.status === 'pending').length

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Модерация отзывов</h1>
          <p style={styles.subtitle}>
            Всего: {testimonials.length} | На модерации: {pendingCount}
          </p>
        </div>
        <div style={styles.headerActions}>
          <button onClick={fetchTestimonials} style={styles.refreshBtn} disabled={loading}>
            {loading ? 'Загрузка...' : 'Обновить'}
          </button>
          <button onClick={handleLogout} style={styles.logoutBtn}>Выйти</button>
        </div>
      </header>

      <div style={styles.list}>
        {testimonials.map((t) => (
          <div
            key={t.slug}
            style={{
              ...styles.card,
              borderLeft: `4px solid ${STATUS_COLORS[t.status] || '#ccc'}`,
            }}
          >
            <div style={styles.cardHeader}>
              <div>
                <span style={styles.name}>{t.name}</span>
                {t.age && <span style={styles.meta}>, {t.age} лет</span>}
                {t.role && <span style={styles.meta}> — {t.role}</span>}
              </div>
              <span
                style={{
                  ...styles.badge,
                  background: STATUS_COLORS[t.status] || '#ccc',
                }}
              >
                {STATUS_LABELS[t.status] || t.status}
              </span>
            </div>

            <div style={styles.tags}>
              <span style={styles.tag}>{SERVICE_LABELS[t.service] || t.service}</span>
            </div>

            <div style={styles.field}>
              <strong>Запрос:</strong> {t.request}
            </div>
            <div style={styles.field}>
              <strong>Результат:</strong> {t.result}
            </div>
            <div style={styles.text}>{t.text}</div>

            <div style={styles.actions}>
              {t.status !== 'approved' && (
                <button
                  onClick={() => handleStatus(t.slug, 'approved')}
                  disabled={updating === t.slug}
                  style={styles.approveBtn}
                >
                  {updating === t.slug ? '...' : 'Одобрить'}
                </button>
              )}
              {t.status !== 'rejected' && (
                <button
                  onClick={() => handleStatus(t.slug, 'rejected')}
                  disabled={updating === t.slug}
                  style={styles.rejectBtn}
                >
                  {updating === t.slug ? '...' : 'Отклонить'}
                </button>
              )}
            </div>
          </div>
        ))}

        {testimonials.length === 0 && !loading && (
          <p style={styles.empty}>Отзывов пока нет</p>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  loginWrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8f9fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  loginForm: {
    background: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    width: '100%',
    maxWidth: '360px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  loginTitle: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 600,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  loginSubtitle: {
    margin: 0,
    fontSize: '14px',
    textAlign: 'center',
    color: '#888',
  },
  input: {
    padding: '12px 16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
  },
  error: {
    margin: 0,
    color: '#ef4444',
    fontSize: '14px',
    textAlign: 'center',
  },
  loginBtn: {
    padding: '12px',
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '24px 16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 600,
    color: '#1a1a1a',
  },
  subtitle: {
    margin: '4px 0 0',
    fontSize: '14px',
    color: '#888',
  },
  headerActions: {
    display: 'flex',
    gap: '8px',
  },
  refreshBtn: {
    padding: '8px 16px',
    background: '#f3f4f6',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  logoutBtn: {
    padding: '8px 16px',
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    color: '#666',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    flexWrap: 'wrap',
    gap: '8px',
  },
  name: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#1a1a1a',
  },
  meta: {
    fontSize: '15px',
    color: '#666',
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '20px',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  tags: {
    marginBottom: '12px',
  },
  tag: {
    display: 'inline-block',
    padding: '2px 10px',
    background: '#f3f4f6',
    borderRadius: '12px',
    fontSize: '13px',
    color: '#555',
  },
  field: {
    fontSize: '14px',
    color: '#444',
    marginBottom: '4px',
  },
  text: {
    fontSize: '15px',
    color: '#333',
    lineHeight: 1.6,
    margin: '12px 0',
    whiteSpace: 'pre-line',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
  },
  approveBtn: {
    padding: '8px 20px',
    background: '#10b981',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  rejectBtn: {
    padding: '8px 20px',
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    padding: '40px',
  },
}
