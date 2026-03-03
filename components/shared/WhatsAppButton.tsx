'use client'
import { useState, useEffect } from 'react'
import { FaWhatsapp } from 'react-icons/fa6'

export function WhatsAppButton({ number }: { number: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
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
  )
}
