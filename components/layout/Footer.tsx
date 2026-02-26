import Link from 'next/link'
import { FaWhatsapp, FaTelegram } from 'react-icons/fa6'

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Col 1: About */}
          <div>
            <div className="text-xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif' }}>
              Светлана Попова
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Психолог-консультант. Психотерапия, профнавигация и бизнес-коучинг.
            </p>
            <div className="flex gap-3">
              <a
                href="https://wa.me/79035698984"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="text-lg" />
              </a>
              <a
                href="https://t.me/svet_psv_uz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Telegram"
              >
                <FaTelegram className="text-lg" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <div className="font-semibold mb-4 text-white/80 uppercase text-xs tracking-widest">Навигация</div>
            <nav className="flex flex-col gap-2">
              {[
                { href: '/', label: 'Главная' },
                { href: '/psihoterapiya/', label: 'Психотерапия' },
                { href: '/karyernoe-konsultirovanie/', label: 'Карьерное консультирование' },
                { href: '/biznes-kouching/', label: 'Бизнес-коучинг' },
                { href: '/ob-mne/', label: 'Обо мне' },
                { href: '/otzyvy/', label: 'Отзывы' },
                { href: '/blog/', label: 'Блог' },
                { href: '/zapis/', label: 'Записаться' },
              ].map(link => (
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
              <a
                href="https://wa.me/79035698984"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
              >
                <FaWhatsapp className="text-green-400" />
                WhatsApp
              </a>
              <a
                href="https://t.me/svet_psv_uz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
              >
                <FaTelegram className="text-blue-400" />
                Telegram
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Светлана Попова. Все права защищены.
          </p>
          <Link href="/privacy/" className="text-white/40 hover:text-white/60 text-sm transition-colors">
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </footer>
  )
}
