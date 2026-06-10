import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  className?: string
}

/** Pure primitive — no internal state or side effects. */
export function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-accent text-white ${className}`}
    >
      {children}
    </span>
  )
}
