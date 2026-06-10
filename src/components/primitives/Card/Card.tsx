import type { ReactNode, HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /** Makes card a hover-lift interactive element */
  interactive?: boolean
  /** Remove default padding from body — useful for table-in-card patterns */
  noPadding?: boolean
}

interface CardSectionProps {
  children: ReactNode
  className?: string
}

/**
 * Card — surface container following the global design tokens.
 * All new pages should wrap content in <Card> for consistent elevation.
 *
 * Sub-components: Card.Header, Card.Body, Card.Footer
 */
export function Card({ children, interactive = false, noPadding = false, className = '', ...rest }: CardProps) {
  return (
    <div
      className={`card${interactive ? ' card-interactive' : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}

Card.Header = function CardHeader({ children, className = '' }: CardSectionProps) {
  return <div className={`card-header ${className}`}>{children}</div>
}

Card.Body = function CardBody({ children, className = '' }: CardSectionProps & { noPadding?: boolean }) {
  return <div className={`${(arguments[0] as { noPadding?: boolean }).noPadding ? '' : 'card-body'} ${className}`}>{children}</div>
}

Card.Footer = function CardFooter({ children, className = '' }: CardSectionProps) {
  return <div className={`card-footer ${className}`}>{children}</div>
}
