import { useNavigate } from 'react-router-dom'
import { LoginForm } from '@/components/forms/LoginForm'
import { ROUTES } from '@/constants/routes'
import type { SessionUser } from '@/types'

function getDashboardRoute(user: SessionUser) {
  if (user.role === 'ADMINISTRADOR') return ROUTES.ADMIN_DASHBOARD
  if (user.role === 'ORGANIZADOR') return ROUTES.ORGANIZER_DASHBOARD
  return ROUTES.PARTICIPANT_DASHBOARD
}

export function LoginPage() {
  const navigate = useNavigate()

  return (
    <div>
      <h2 className="font-heading text-3xl font-bold uppercase tracking-wide text-foreground">
        Entrar
      </h2>
      <p className="mt-2 text-sm text-text-muted">
        Acesse sua conta VibeU
      </p>
      <div className="mt-8">
        <LoginForm onSuccess={(user) => navigate(getDashboardRoute(user))} />
      </div>
    </div>
  )
}
