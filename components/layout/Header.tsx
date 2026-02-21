'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/psihoterapiya/', label: 'Психотерапия' },
  { href: '/karyernoe-konsultirovanie/', label: 'Карьера' },
  { href: '/biznes-kouching/', label: 'Коучинг' },
  { href: '/ob-mne/', label: 'Обо мне' },
  { href: '/otzyvy/', label: 'Отзывы' },
  { href: '/blog/', label: 'Блог' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 backdrop-blur-sm bg-white/90 border-b border-brand-light/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="text-brand-dark font-bold text-lg md:text-xl" style={{ fontFamily: 'Georgia, serif' }}>
            Светлана Попова
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  pathname === link.href
                    ? 'text-brand-primary border-b-2 border-brand-primary'
                    : 'text-brand-dark/70 hover:text-brand-dark'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <Link
              href="/zapis/"
              className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 font-semibold text-sm bg-brand-accent text-white hover:bg-brand-accent/90 transition-all duration-200"
            >
              Записаться
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className="lg:hidden p-2 rounded-lg text-brand-dark"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Меню"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className={`h-0.5 bg-brand-dark rounded transition-all duration-200 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`h-0.5 bg-brand-dark rounded transition-all duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 bg-brand-dark rounded transition-all duration-200 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden pb-4 border-t border-brand-light/50">
            <nav className="flex flex-col gap-1 pt-4">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2.5 text-brand-dark/80 font-medium hover:text-brand-primary hover:bg-brand-light rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/zapis/"
                className="mt-2 inline-flex items-center justify-center rounded-lg px-5 py-3 font-semibold bg-brand-accent text-white hover:bg-brand-accent/90 transition-all"
                onClick={() => setMobileOpen(false)}
              >
                Записаться
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
