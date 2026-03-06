import type { MetadataRoute } from 'next'
import { getAllBlogPosts } from '@/lib/content'

const baseUrl = 'https://toselfness.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/psihoterapiya`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/karyernoe-konsultirovanie`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/biznes-kouching`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/ob-mne`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/otzyvy`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/faq`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/zapis`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog`, changeFrequency: 'weekly', priority: 0.7 },
  ]

  const posts = await getAllBlogPosts()
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : undefined,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...blogPages]
}
