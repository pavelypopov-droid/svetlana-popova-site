import Link from 'next/link'
import { FaWhatsapp, FaTelegram } from 'react-icons/fa6'

interface FooterProps {
  siteName: string
  description: string
  links: readonly { href: string; label: string }[]
  socialLinks: readonly { platform: string; url: string; label: string }[]
  copyright: string
}

const platformIcons: Record<string, { icon: typeof FaWhatsapp; color: string }> = {
  whatsapp: { icon: FaWhatsapp, color: 'text-green-400' },
  telegram: { icon: FaTelegram, color: 'text-blue-400' },
}

export function Footer({ siteName, description, links, socialLinks, copyright }: FooterProps) {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Col 1: About */}
          <div>
            <div className="text-xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif' }}>
              {siteName}
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              {description}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, i) => {
                const iconData = platformIcons[social.platform]
                if (!iconData) return null
                const Icon = iconData.icon
                return (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="text-lg" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <div className="font-semibold mb-4 text-white/80 uppercase text-xs tracking-widest">Навигация</div>
            <nav className="flex flex-col gap-2">
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/60 hover:text-white transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3: Contacts */}
          <div>
            <div className="font-semibold mb-4 text-white/80 uppercase text-xs tracking-widest">Контакты</div>
            <div className="flex flex-col gap-3">
              {socialLinks.map((social, i) => {
                const iconData = platformIcons[social.platform]
                if (!iconData) return null
                const Icon = iconData.icon
                return (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
                  >
                    <Icon className={iconData.color} />
                    {social.label}
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} {copyright}
          </p>
          <Link href="/privacy/" className="text-white/40 hover:text-white/60 text-sm transition-colors">
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </footer>
  )
}
