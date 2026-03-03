import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../keystatic.config'

const reader = createReader(process.cwd(), keystaticConfig)

// ─── Singletons ──────────────────────────────────────────────────────────────

export async function getHomePage() {
  return reader.singletons.homePage.read()
}

export async function getAboutPage() {
  return reader.singletons.aboutPage.read()
}

export async function getBookingPage() {
  return reader.singletons.bookingPage.read()
}

export async function getPrivacyPage() {
  return reader.singletons.privacyPage.read()
}

export async function getQuiz() {
  return reader.singletons.quiz.read()
}

export async function getSettings() {
  return reader.singletons.settings.read()
}

export async function getNavigation() {
  return reader.singletons.navigation.read()
}

export async function getTherapyPage() {
  return reader.singletons.therapyPage.read()
}

export async function getCareerPage() {
  return reader.singletons.careerPage.read()
}

export async function getCoachingPage() {
  return reader.singletons.coachingPage.read()
}

// ─── Collections ─────────────────────────────────────────────────────────────

export async function getAllTestimonials() {
  const slugs = await reader.collections.testimonials.list()
  const items = await Promise.all(
    slugs.map(async (slug) => {
      const item = await reader.collections.testimonials.read(slug)
      return item ? { slug, ...item } : null
    })
  )
  return items.filter((item): item is NonNullable<typeof item> => item !== null)
}

export async function getAllFaq() {
  const slugs = await reader.collections.faq.list()
  const items = await Promise.all(
    slugs.map(async (slug) => {
      const item = await reader.collections.faq.read(slug)
      return item ? { slug, ...item } : null
    })
  )
  return items
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

export async function getAllBlogPosts() {
  const slugs = await reader.collections.blog.list()
  const items = await Promise.all(
    slugs.map(async (slug) => {
      const entry = await reader.collections.blog.read(slug)
      return entry ? { slug, ...entry } : null
    })
  )
  return items
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => new Date(b.date ?? '').getTime() - new Date(a.date ?? '').getTime())
}

export async function getBlogPost(slug: string) {
  return reader.collections.blog.read(slug)
}
