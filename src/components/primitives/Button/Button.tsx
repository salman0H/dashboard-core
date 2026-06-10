import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ghost' | 'primary' | 'outline'
  size?: 'sm' | 'md'
  children: ReactNode
}

/**
 * Pure primitive — rendering is determined entirely by props.
 * No internal side effects. Accessible by default.
 */
export function Button({
  variant = 'ghost',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-1.5 font-medium rounded-core transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1'

  const variants: Record<string, string> = {
    ghost:
      'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900',
    primary:
      'bg-accent text-white hover:bg-blue-700 active:scale-[0.98]',
    outline:
      'border border-border text-slate-700 hover:bg-slate-50 active:scale-[0.98]',
  }

  const sizes: Record<string, string> = {
    sm: 'h-7 px-2.5 text-xs',
    md: 'h-8 w-8',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
