import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { generatePageMetadata } from '@/lib/metadata'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = generatePageMetadata({
  title: 'Блог — психология, карьера и коучинг',
  description: 'Статьи о психологии, карьере и личном развитии. Практичные советы от психолога Светланы Поповой.',
  path: '/blog/',
})

const categoryColors: Record<string, 'primary' | 'accent' | 'gold'> = {
  'Психология': 'primary',
  'Карьера': 'accent',
  'Коучинг': 'gold',
  'Дети': 'primary',
  'Самопознание': 'accent',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <>
      <section className="bg-brand-dark py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-brand-gold text-sm font-semibold uppercase tracking-widest mb-4 block">
            Блог
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Статьи о психологии
          </h1>
          <p className="text-white/70 text-xl">Практичные советы и ответы на частые вопросы</p>
        </div>
      </section>

      <Section bg="bg-brand-bg">
        {posts.length === 0 ? (
          <div className="text-center text-brand-muted py-16">
            Статьи скоро появятся
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <Card key={post.slug} className="flex flex-col hover:shadow-[var(--shadow-hover)]">
                <div className="mb-3">
                  <Badge color={categoryColors[post.category] || 'primary'}>
                    {post.category}
                  </Badge>
                </div>
                <h2 className="text-lg font-bold text-brand-dark mb-3 flex-1 leading-snug">
                  <Link href={`/blog/${post.slug}/`} className="hover:text-brand-primary transition-colors">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-brand-dark/60 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-brand-muted text-xs">{formatDate(post.date)}</span>
                  <Link
                    href={`/blog/${post.slug}/`}
                    className="text-brand-primary text-sm font-medium hover:underline"
                  >
                    Читать →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Section>
    </>
  )
}
