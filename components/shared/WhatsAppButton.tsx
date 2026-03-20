'use client'
import { useState, useEffect } from 'react'
import { FaWhatsapp } from 'react-icons/fa6'

function MaxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
    </svg>
  )
}

export function WhatsAppButton({ number }: { number: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <>
      {/* WhatsApp */}
      <a
        href={`https://wa.me/${number}?text=${encodeURIComponent('Здравствуйте, Светлана! Хочу узнать о консультации')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
        style={{ backgroundColor: '#25D366' }}
        title="Написать в WhatsApp"
      >
        <FaWhatsapp className="text-white text-3xl" />
        <span className="absolute right-16 bg-brand-dark text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Написать в WhatsApp
        </span>
      </a>

      {/* MAX Messenger */}
      <a
        href={`https://max.ru/${number}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-24 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
        style={{ backgroundColor: '#7B68EE' }}
        title="Написать в MAX"
      >
        <MaxIcon className="text-white w-8 h-8" />
        <span className="absolute right-16 bg-brand-dark text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Написать в MAX
        </span>
      </a>
    </>
  )
}
