import { Link, useLocation } from 'react-router-dom'
import logoImage from '@/logo.png'
import { ROUTES } from '@/constants/routes'
import { createNavClickHandler } from '@/utils/navigation'

interface LogoProps {
  className?: string
  linkToHome?: boolean
}

export function Logo({ className = 'h-8', linkToHome = true }: LogoProps) {
  const location = useLocation()

  const image = (
    <img
      src={logoImage}
      alt="VibeU"
      className={`w-auto object-contain ${className}`}
    />
  )

  if (!linkToHome) return image

  return (
    <Link
      to={ROUTES.HOME}
      onClick={createNavClickHandler(ROUTES.HOME, location.pathname)}
      className="inline-flex shrink-0 items-center transition opacity-90 hover:opacity-100"
    >
      {image}
    </Link>
  )
}
