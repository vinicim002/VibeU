import { Link } from 'react-router-dom'
import { ProfileForm } from '@/components/forms/ProfileForm'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/constants/routes'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

function getDashboardRoute(role: string) {
  if (role === 'ADMINISTRADOR') return ROUTES.ADMIN_DASHBOARD
  if (role === 'ORGANIZADOR') return ROUTES.ORGANIZER_DASHBOARD
  return ROUTES.PARTICIPANT_DASHBOARD
}

export function ProfilePage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl tracking-wider text-foreground">PERFIL</h1>
        <Link
          to={getDashboardRoute(user.role)}
          className="text-xs font-semibold uppercase tracking-wider text-text-muted transition hover:text-foreground"
        >
          ← Voltar ao painel
        </Link>
      </div>
      <Card className="p-6" glow>
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/30 font-display text-2xl text-foreground">
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-foreground">{user.name}</p>
            <p className="text-sm text-text-muted">{user.email}</p>
            <Badge variant="purple" className="mt-2">
              {user.role}
            </Badge>
          </div>
        </div>
        <ProfileForm />
      </Card>
    </div>
  )
}
