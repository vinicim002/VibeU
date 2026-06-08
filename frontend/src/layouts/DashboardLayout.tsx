import { Link, Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/constants/routes'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/common/ThemeToggle'

interface DashboardLayoutProps {
  title: string
  navItems: Array<{ to: string; label: string }>
}

export function DashboardLayout({ title, navItems }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-bg-dark">
      <header className="border-b border-border/5 bg-bg-slate/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to={ROUTES.HOME} className="font-display text-2xl tracking-widest text-foreground">
            VIBE<span className="text-accent">U</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="hidden text-sm text-text-muted sm:block">{user?.name}</span>
            <Link
              to={ROUTES.PROFILE}
              className="inline-flex items-center justify-center rounded-full border border-border/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-foreground transition hover:border-border/40 hover:bg-surface/5"
            >
              Perfil
            </Link>
            <Button variant="ghost" size="sm" onClick={() => logout()}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-4xl tracking-wider text-foreground md:text-5xl">
            {title}
          </h1>
          <p className="mt-2 text-text-muted">Painel de controle — {user?.role.toLowerCase()}</p>
        </motion.div>

        <nav className="mt-8 flex gap-2 overflow-x-auto border-b border-border/5 pb-4">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`shrink-0 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                location.pathname === item.to
                  ? 'bg-primary text-white'
                  : 'text-text-muted hover:bg-surface/5 hover:text-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
