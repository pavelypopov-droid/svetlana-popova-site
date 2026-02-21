import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'

const contentDir = path.join(process.cwd(), 'content/blog')

export interface PostMeta {
  slug: string
  title: string
  date: string
  category: string
  excerpt: string
}

export interface Post extends PostMeta {
  content: string
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(contentDir)) return []
  const files = fs.readdirSync(contentDir)
  const posts = files
    .filter(f => f.endsWith('.md'))
    .map(filename => {
      const raw = fs.readFileSync(path.join(contentDir, filename), 'utf8')
      const { data } = matter(raw)
      return {
        slug: data.slug || filename.replace(/\.md$/, ''),
        title: data.title,
        date: data.date,
        category: data.category,
        excerpt: data.excerpt,
      } as PostMeta
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  return posts
}

export async function getPost(slug: string): Promise<Post | null> {
  if (!fs.existsSync(contentDir)) return null
  const files = fs.readdirSync(contentDir)
  const file = files.find(f => {
    const raw = fs.readFileSync(path.join(contentDir, f), 'utf8')
    const { data } = matter(raw)
    return (data.slug || f.replace(/\.md$/, '')) === slug
  })
  if (!file) return null
  const raw = fs.readFileSync(path.join(contentDir, file), 'utf8')
  const { data, content } = matter(raw)
  const processed = await remark().use(remarkHtml).process(content)
  return {
    slug,
    title: data.title,
    date: data.date,
    category: data.category,
    excerpt: data.excerpt,
    content: processed.toString(),
  }
}
