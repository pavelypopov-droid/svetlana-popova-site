import type { Metadata } from 'next'

export function generatePageMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  const baseUrl = 'https://iofm.ru'
  return {
    title: `${title} | Светлана Попова — психолог`,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}${path}`,
      siteName: 'Светлана Попова — психолог',
      images: [{ url: `${baseUrl}/images/og/og-main.jpg`, width: 1200, height: 630 }],
      locale: 'ru_RU',
      type: 'website',
    },
    alternates: { canonical: `${baseUrl}${path}` },
  }
}
