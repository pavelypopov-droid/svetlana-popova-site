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
  const baseUrl = 'https://toselfness.com'
  return {
    title: `${title} | Светлана Попова — психолог`,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}${path}`,
      siteName: 'Светлана Попова — психолог',
      locale: 'ru_RU',
      type: 'website',
    },
    alternates: { canonical: `${baseUrl}${path}` },
  }
}
