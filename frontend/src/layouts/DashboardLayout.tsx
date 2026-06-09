import { Link, Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/constants/routes'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { Logo } from '@/components/common/Logo'
import { createNavClickHandler } from '@/utils/navigation'

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
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-4 sm:h-16 sm:gap-3 sm:px-6 lg:px-8">
          <Logo className="h-8 sm:h-9" />
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <ThemeToggle />
            <span className="hidden max-w-[120px] truncate text-sm text-text-muted md:block lg:max-w-none">
              {user?.name}
            </span>
            <Link
              to={ROUTES.PROFILE}
              className="inline-flex items-center justify-center rounded-full border border-border/20 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-foreground transition hover:border-border/40 hover:bg-surface/5 sm:px-4 sm:py-2 sm:text-xs"
            >
              Perfil
            </Link>
            <Button variant="ghost" size="sm" onClick={() => logout()}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-3xl tracking-wider text-foreground sm:text-4xl md:text-5xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Painel de controle — {user?.role.toLowerCase()}
          </p>
        </motion.div>

        <nav className="mt-6 flex gap-2 overflow-x-auto border-b border-border/5 pb-4 sm:mt-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={createNavClickHandler(item.to, location.pathname)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition sm:px-5 ${
                location.pathname === item.to
                  ? 'bg-primary text-white'
                  : 'text-text-muted hover:bg-surface/5 hover:text-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 sm:mt-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
