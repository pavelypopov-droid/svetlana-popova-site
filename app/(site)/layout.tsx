import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/shared/WhatsAppButton'
import { getNavigation, getSettings } from '@/lib/content'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [nav, settings] = await Promise.all([getNavigation(), getSettings()])

  return (
    <>
      <Header
        siteName={nav?.site_name || 'Светлана Попова'}
        links={nav?.header_links || []}
        ctaText={nav?.header_cta_text || 'Записаться'}
        ctaHref={nav?.header_cta_href || '/zapis/'}
      />
      <main>{children}</main>
      <Footer
        siteName={nav?.site_name || 'Светлана Попова'}
        description={nav?.footer_description || ''}
        links={nav?.footer_links || []}
        socialLinks={nav?.social_links || []}
        copyright={nav?.copyright || 'Светлана Попова. Все права защищены.'}
      />
      <WhatsAppButton number={settings?.contacts?.whatsapp || '79035698984'} />
    </>
  )
}
