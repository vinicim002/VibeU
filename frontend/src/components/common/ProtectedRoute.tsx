import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/constants/routes'
import type { UserRole } from '@/types'
import { LoadingState } from '@/components/ui/LoadingState'

interface ProtectedRouteProps {
  children: React.ReactNode
  roles?: UserRole[]
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <LoadingState />

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  if (roles && !roles.includes(user.role)) {
    const redirect =
      user.role === 'ADMINISTRADOR'
        ? ROUTES.ADMIN_DASHBOARD
        : user.role === 'ORGANIZADOR'
          ? ROUTES.ORGANIZER_DASHBOARD
          : ROUTES.PARTICIPANT_DASHBOARD
    return <Navigate to={redirect} replace />
  }

  return children
}
