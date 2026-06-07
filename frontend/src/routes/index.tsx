import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { MainLayout } from '@/layouts/MainLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { ROUTES } from '@/constants/routes'
import { HomePage } from '@/pages/HomePage'
import { EventsPage } from '@/pages/EventsPage'
import { EventDetailPage } from '@/pages/EventDetailPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { TicketPage } from '@/pages/TicketPage'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { OrganizerDashboard } from '@/pages/organizer/OrganizerDashboard'
import { CreateEventPage } from '@/pages/organizer/CreateEventPage'
import { ParticipantDashboard } from '@/pages/participant/ParticipantDashboard'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.EVENTS} element={<EventsPage />} />
          <Route path={ROUTES.EVENT_DETAIL} element={<EventDetailPage />} />
          <Route
            path={ROUTES.PROFILE}
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path={ROUTES.TICKET} element={<TicketPage />} />

        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute roles={['ADMINISTRADOR']}>
              <DashboardLayout
                title="ADMIN"
                navItems={[{ to: ROUTES.ADMIN_DASHBOARD, label: 'Visão Geral' }]}
              />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
        </Route>

        <Route
          element={
            <ProtectedRoute roles={['ORGANIZADOR']}>
              <DashboardLayout
                title="ORGANIZADOR"
                navItems={[
                  { to: ROUTES.ORGANIZER_DASHBOARD, label: 'Meus Eventos' },
                  { to: ROUTES.ORGANIZER_CREATE_EVENT, label: 'Novo Evento' },
                ]}
              />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.ORGANIZER_DASHBOARD} element={<OrganizerDashboard />} />
          <Route path={ROUTES.ORGANIZER_CREATE_EVENT} element={<CreateEventPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute roles={['PARTICIPANTE']}>
              <DashboardLayout
                title="PARTICIPANTE"
                navItems={[
                  { to: ROUTES.PARTICIPANT_DASHBOARD, label: 'Meus Ingressos' },
                  { to: ROUTES.EVENTS, label: 'Explorar' },
                ]}
              />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.PARTICIPANT_DASHBOARD} element={<ParticipantDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
