import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  accent?: boolean
}

export function Card({ children, className = '', accent = false }: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] hover:-translate-y-1 transition-all duration-200 p-6 ${accent ? 'border-l-4 border-brand-accent' : ''} ${className}`}>
      {children}
    </div>
  )
}
