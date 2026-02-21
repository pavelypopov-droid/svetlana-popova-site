import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  color?: 'primary' | 'accent' | 'gold'
}

export function Badge({ children, color = 'primary' }: BadgeProps) {
  const colors = {
    primary: 'bg-brand-primary/10 text-brand-primary',
    accent: 'bg-brand-accent/10 text-brand-accent',
    gold: 'bg-brand-gold/10 text-brand-gold',
  }
  return (
    <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${colors[color]}`}>
      {children}
    </span>
  )
}
