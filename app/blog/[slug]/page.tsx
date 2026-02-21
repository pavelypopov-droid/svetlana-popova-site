import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPosts, getPost } from '@/lib/blog'
import { CtaBlock } from '@/components/shared/CtaBlock'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug)
  if (!post) return {}
  return {
    title: `${post.title} | Светлана Попова — психолог`,
    description: post.excerpt,
  }
}

const categoryColors: Record<string, 'primary' | 'accent' | 'gold'> = {
  'Психология': 'primary',
  'Карьера': 'accent',
  'Коучинг': 'gold',
  'Дети': 'primary',
  'Самопознание': 'accent',
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  return (
    <>
      <section className="bg-brand-dark py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog/" className="text-white/50 hover:text-white text-sm mb-6 inline-flex items-center gap-1 transition-colors">
            ← Все статьи
          </Link>
          <div className="mb-4">
            <Badge color={categoryColors[post.category] || 'primary'}>{post.category}</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            {post.title}
          </h1>
          <p className="text-white/50 text-sm">{formatDate(post.date)}</p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-brand-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="bg-white rounded-2xl shadow-[var(--shadow-card)] p-8 md:p-12 prose prose-lg max-w-none text-brand-dark/80 prose-headings:text-brand-dark prose-headings:font-bold prose-a:text-brand-primary prose-strong:text-brand-dark"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </section>

      <CtaBlock
        title="Остались вопросы?"
        subtitle="Запишитесь на бесплатные 15 минут — поговорим о вашей ситуации."
        buttonText="Записаться на консультацию"
      />
    </>
  )
}
