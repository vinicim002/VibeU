import type { MouseEvent } from 'react'

export const NAVBAR_HEIGHT = 64

export function scrollToTop(behavior: ScrollBehavior = 'smooth') {
  window.scrollTo({ top: 0, left: 0, behavior })
}

export function scrollToSection(sectionId: string, behavior: ScrollBehavior = 'smooth') {
  requestAnimationFrame(() => {
    const element = document.getElementById(sectionId)
    if (!element) return

    const top = element.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT
    window.scrollTo({ top, behavior })
  })
}

export function parseNavTarget(to: string): { path: string; hash: string | null } {
  const hashIndex = to.indexOf('#')
  if (hashIndex === -1) return { path: to, hash: null }

  return {
    path: to.slice(0, hashIndex) || '/',
    hash: to.slice(hashIndex + 1),
  }
}

export function isNavLinkActive(to: string, pathname: string, hash: string): boolean {
  const target = parseNavTarget(to)
  if (target.hash) {
    return pathname === target.path && hash === `#${target.hash}`
  }
  return pathname === target.path
}

export function createNavClickHandler(
  to: string,
  pathname: string,
  onAfter?: () => void,
) {
  return (event: MouseEvent<HTMLAnchorElement>) => {
    const target = parseNavTarget(to)
    if (target.path !== pathname) return

    event.preventDefault()

    if (target.hash) {
      scrollToSection(target.hash)
    } else {
      scrollToTop()
    }

    onAfter?.()
  }
}
