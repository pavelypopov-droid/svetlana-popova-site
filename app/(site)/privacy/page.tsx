import { getPrivacyPage } from '@/lib/content'
import Markdoc from '@markdoc/markdoc'
import React from 'react'

export const metadata = {
  title: 'Политика конфиденциальности | Светлана Попова',
  description: 'Политика обработки персональных данных',
}

export default async function PrivacyPage() {
  const privacy = await getPrivacyPage()

  let htmlContent = ''
  if (privacy?.content) {
    const doc = await privacy.content()
    const transformed = Markdoc.transform(doc.node)
    htmlContent = Markdoc.renderers.html(transformed)
  }

  return (
    <section className="py-16 md:py-24 bg-brand-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-brand-dark mb-8" style={{ fontFamily: 'Georgia, serif' }}>
          {privacy?.title || 'Политика конфиденциальности'}
        </h1>
        <div
          className="bg-white rounded-2xl shadow-[var(--shadow-card)] p-8 prose prose-sm max-w-none text-brand-dark/70 prose-headings:text-brand-dark prose-headings:font-bold"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </section>
  )
}
