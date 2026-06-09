import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ScrollRestoration } from '@/components/common/ScrollRestoration'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { RequireAuth } from '@/components/common/RequireAuth'
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
import { EditEventPage } from '@/pages/organizer/EditEventPage'
import { ParticipantDashboard } from '@/pages/participant/ParticipantDashboard'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { FaculdadeDetailPage } from '@/pages/FaculdadeDetailPage'
import { AtleticaDetailPage } from '@/pages/AtleticaDetailPage'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollRestoration />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.EVENTS} element={<EventsPage />} />
          <Route path={ROUTES.EVENT_DETAIL} element={<EventDetailPage />} />
          <Route path={ROUTES.EVENT_CHECKOUT} element={<CheckoutPage />} />
          <Route path={ROUTES.FACULDADE_DETAIL} element={<FaculdadeDetailPage />} />
          <Route path={ROUTES.ATLETICA_DETAIL} element={<AtleticaDetailPage />} />
          <Route
            path={ROUTES.PROFILE}
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
        </Route>

        <Route path={ROUTES.TICKET} element={<TicketPage />} />

        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={['ADMINISTRADOR']} />}>
          <Route
            path={ROUTES.ADMIN_DASHBOARD}
            element={
              <DashboardLayout
                title="ADMIN"
                navItems={[{ to: ROUTES.ADMIN_DASHBOARD, label: 'Visão Geral' }]}
              />
            }
          >
            <Route index element={<AdminDashboard />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={['ORGANIZADOR']} />}>
          <Route
            path={ROUTES.ORGANIZER_DASHBOARD}
            element={
              <DashboardLayout
                title="ORGANIZADOR"
                navItems={[
                  { to: ROUTES.ORGANIZER_DASHBOARD, label: 'Meus Eventos' },
                  { to: ROUTES.ORGANIZER_CREATE_EVENT, label: 'Novo Evento' },
                ]}
              />
            }
          >
            <Route index element={<OrganizerDashboard />} />
          </Route>
          <Route
            path={ROUTES.ORGANIZER_CREATE_EVENT}
            element={
              <DashboardLayout
                title="ORGANIZADOR"
                navItems={[
                  { to: ROUTES.ORGANIZER_DASHBOARD, label: 'Meus Eventos' },
                  { to: ROUTES.ORGANIZER_CREATE_EVENT, label: 'Novo Evento' },
                ]}
              />
            }
          >
            <Route index element={<CreateEventPage />} />
          </Route>
          <Route
            path={ROUTES.ORGANIZER_EDIT_EVENT}
            element={
              <DashboardLayout
                title="ORGANIZADOR"
                navItems={[
                  { to: ROUTES.ORGANIZER_DASHBOARD, label: 'Meus Eventos' },
                  { to: ROUTES.ORGANIZER_CREATE_EVENT, label: 'Novo Evento' },
                ]}
              />
            }
          >
            <Route index element={<EditEventPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={['PARTICIPANTE']} />}>
          <Route
            path={ROUTES.PARTICIPANT_DASHBOARD}
            element={
              <DashboardLayout
                title="PARTICIPANTE"
                navItems={[
                  { to: ROUTES.PARTICIPANT_DASHBOARD, label: 'Meus Ingressos' },
                  { to: ROUTES.EVENTS, label: 'Explorar' },
                ]}
              />
            }
          >
            <Route index element={<ParticipantDashboard />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
