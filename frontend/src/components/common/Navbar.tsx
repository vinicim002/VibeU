import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/constants/routes'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { Logo } from '@/components/common/Logo'
import { NavScrollLink } from '@/components/common/NavScrollLink'

const navLinks = [
  { to: ROUTES.EVENTS, label: 'Eventos' },
  { to: '/#como-funciona', label: 'Como Funciona' },
  { to: '/#categorias', label: 'Categorias' },
]

export function Navbar() {
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const dashboardRoute =
    user?.role === 'ADMINISTRADOR'
      ? ROUTES.ADMIN_DASHBOARD
      : user?.role === 'ORGANIZADOR'
        ? ROUTES.ORGANIZER_DASHBOARD
        : ROUTES.PARTICIPANT_DASHBOARD

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 right-0 left-0 z-50 border-b border-border/5 bg-bg-dark/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo className="h-9 sm:h-10" />

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavScrollLink
              key={link.to}
              to={link.to}
              className="text-xs font-semibold uppercase tracking-widest transition hover:text-foreground"
            >
              {link.label}
            </NavScrollLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <div className="hidden items-center gap-3 sm:flex">
            {user ? (
              <>
                <Link
                  to={dashboardRoute}
                  className="hidden text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-foreground lg:block"
                >
                  {user.name.split(' ')[0]}
                </Link>
                <Button variant="ghost" size="sm" onClick={() => logout()}>
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN}>
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to={ROUTES.REGISTER}>
                  <Button variant="primary" size="sm">
                    Cadastrar
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            aria-label="Abrir menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-lg border border-border/15 md:hidden"
          >
            <span
              className={`h-0.5 w-5 bg-foreground transition ${mobileOpen ? 'translate-y-2 rotate-45' : ''}`}
            />
            <span className={`h-0.5 w-5 bg-foreground transition ${mobileOpen ? 'opacity-0' : ''}`} />
            <span
              className={`h-0.5 w-5 bg-foreground transition ${mobileOpen ? '-translate-y-2 -rotate-45' : ''}`}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border/10 bg-bg-dark md:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link) => (
                <NavScrollLink
                  key={link.to}
                  to={link.to}
                  onNavigate={() => setMobileOpen(false)}
                  activeClassName="text-accent-yellow"
                  inactiveClassName="text-foreground"
                  className="rounded-lg px-3 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-surface/5"
                >
                  {link.label}
                </NavScrollLink>
              ))}
              {user ? (
                <>
                  <Link
                    to={dashboardRoute}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-3 text-sm font-semibold uppercase tracking-wider text-foreground hover:bg-surface/5"
                  >
                    Meu painel
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      setMobileOpen(false)
                    }}
                    className="rounded-lg px-3 py-3 text-left text-sm font-semibold uppercase tracking-wider text-red-400 hover:bg-surface/5"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={ROUTES.LOGIN}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-3 text-sm font-semibold uppercase tracking-wider text-foreground hover:bg-surface/5"
                  >
                    Login
                  </Link>
                  <Link
                    to={ROUTES.REGISTER}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-3 text-sm font-semibold uppercase tracking-wider text-accent-yellow hover:bg-surface/5"
                  >
                    Cadastrar
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  )
}
