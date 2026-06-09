import { Link, type LinkProps } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { createNavClickHandler, isNavLinkActive } from '@/utils/navigation'

interface NavScrollLinkProps extends Omit<LinkProps, 'to'> {
  to: string
  activeClassName?: string
  inactiveClassName?: string
  onNavigate?: () => void
}

export function NavScrollLink({
  to,
  className,
  activeClassName = 'text-accent-yellow',
  inactiveClassName = 'text-text-muted',
  onNavigate,
  children,
  ...props
}: NavScrollLinkProps) {
  const location = useLocation()
  const isActive = isNavLinkActive(to, location.pathname, location.hash)

  return (
    <Link
      to={to}
      onClick={createNavClickHandler(to, location.pathname, onNavigate)}
      className={`${className ?? ''} ${isActive ? activeClassName : inactiveClassName}`.trim()}
      {...props}
    >
      {children}
    </Link>
  )
}
