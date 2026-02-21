import type { ReactNode } from 'react'
import Link from 'next/link'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  href?: string
  onClick?: () => void
  children: ReactNode
  className?: string
  type?: 'button' | 'submit'
}

export function Button({ variant = 'primary', href, onClick, children, className = '', type = 'button' }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-lg px-6 py-3 font-semibold transition-all duration-200 text-base cursor-pointer'
  const variants = {
    primary: 'bg-brand-accent text-white hover:bg-brand-accent/90 shadow-sm hover:shadow-md',
    secondary: 'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white',
    ghost: 'text-brand-primary hover:underline px-0',
  }
  const classes = `${base} ${variants[variant]} ${className}`
  if (href) return <Link href={href} className={classes}>{children}</Link>
  return <button type={type} onClick={onClick} className={classes}>{children}</button>
}
