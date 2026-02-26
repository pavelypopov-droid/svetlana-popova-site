import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'], display: 'swap' })

export const metadata: Metadata = {
  title: 'Психолог — Светлана Попова',
  description: 'Психотерапия, карьерное консультирование и бизнес-коучинг. 15+ лет практики. Первая сессия бесплатно.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Светлана Попова',
  jobTitle: 'Психолог-консультант',
  url: 'https://toselfness.com',
  sameAs: ['https://t.me/svet_psv_uz'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
