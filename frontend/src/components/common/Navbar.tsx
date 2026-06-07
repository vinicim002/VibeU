import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/constants/routes'
import { Button } from '@/components/ui/Button'

const navLinks = [
  { to: ROUTES.EVENTS, label: 'Eventos' },
  { to: '/#como-funciona', label: 'Como Funciona' },
  { to: '/#categorias', label: 'Categorias' },
]

export function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()

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
      className="fixed top-0 right-0 left-0 z-50 border-b border-white/5 bg-bg-dark/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to={ROUTES.HOME} className="group flex items-center gap-2">
          <span className="font-display text-2xl tracking-widest text-white transition group-hover:text-primary-light">
            VIBE<span className="text-accent">U</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-xs font-semibold uppercase tracking-widest transition hover:text-white ${
                location.pathname === link.to ? 'text-accent-yellow' : 'text-text-muted'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to={dashboardRoute}
                className="hidden text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-white sm:block"
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
      </div>
    </motion.header>
  )
}
