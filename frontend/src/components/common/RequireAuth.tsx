import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/constants/routes'
import type { UserRole } from '@/types'
import { LoadingState } from '@/components/ui/LoadingState'

interface RequireAuthProps {
  children: React.ReactNode
  roles?: UserRole[]
}

function getDashboardRoute(role: UserRole): string {
  if (role === 'ADMINISTRADOR') return ROUTES.ADMIN_DASHBOARD
  if (role === 'ORGANIZADOR') return ROUTES.ORGANIZER_DASHBOARD
  return ROUTES.PARTICIPANT_DASHBOARD
}

export function RequireAuth({ children, roles }: RequireAuthProps) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <LoadingState />

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={getDashboardRoute(user.role)} replace />
  }

  return children
}
