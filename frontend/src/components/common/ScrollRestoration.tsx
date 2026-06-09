import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToSection, scrollToTop } from '@/utils/navigation'

export function ScrollRestoration() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.slice(1)
      const timer = window.setTimeout(() => scrollToSection(sectionId, 'smooth'), 100)
      return () => window.clearTimeout(timer)
    }

    scrollToTop('instant')
  }, [location.pathname, location.hash])

  return null
}
