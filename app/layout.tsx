import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics, YandexMetrikaNoScript } from '@/components/Analytics'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'], display: 'swap' })

export const metadata: Metadata = {
  title: 'Психолог — Светлана Попова',
  description: 'Психотерапия, профнавигация и сопровождение бизнес-лидеров. 18+ лет практики. Первая сессия бесплатно.',
  metadataBase: new URL('https://toselfness.com'),
  openGraph: {
    title: 'Психолог — Светлана Попова',
    description: 'Психотерапия, профнавигация и сопровождение бизнес-лидеров. 18+ лет практики. Первая сессия бесплатно.',
    url: 'https://toselfness.com',
    siteName: 'Светлана Попова — психолог',
    images: [{ url: '/images/og/og-main.jpg', width: 1200, height: 630 }],
    locale: 'ru_RU',
    type: 'website',
  },
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
        <YandexMetrikaNoScript />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
