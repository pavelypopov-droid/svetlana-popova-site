import type { ReactNode } from 'react'

interface SectionProps {
  children: ReactNode
  bg?: string
  id?: string
  className?: string
}

export function Section({ children, bg = '', id, className = '' }: SectionProps) {
  return (
    <section id={id} className={`py-16 md:py-24 ${bg} ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  )
}
