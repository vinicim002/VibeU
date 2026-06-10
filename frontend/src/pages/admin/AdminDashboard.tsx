import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  fetchAdminStats,
  fetchEvents,
  fetchEventsByAtletica,
  fetchEventsByFaculdade,
  fetchEventsByMonth,
  fetchOrganizers,
  fetchAllFaculdadesAdmin,
  fetchAllAtleticasAdmin,
  fetchUsersByRole,
  updateEventFeatured,
  updateEventPopular,
} from '@/api'
import { AdminSection } from '@/components/admin/AdminSection'
import { AdminStatCard } from '@/components/admin/AdminStatCard'
import { AdminTabs } from '@/components/admin/AdminTabs'
import { AdminToggleChip } from '@/components/admin/AdminToggleChip'
import { Card } from '@/components/ui/Card'
import { LoadingState } from '@/components/ui/LoadingState'
import { Badge } from '@/components/ui/Badge'
import { EVENT_STATUS_LABELS } from '@/constants/routes'
import { AdminInstitutions } from '@/pages/admin/AdminInstitutions'
import { AdminOrganizers } from '@/pages/admin/AdminOrganizers'

const COLORS = ['#6D28D9', '#3B82F6', '#EC4899', '#E2FF00', '#8B5CF6', '#14B8A6']
const TOOLTIP_STYLE = { background: '#111827', border: '1px solid #ffffff20', borderRadius: 12 }

type AdminTabId = 'overview' | 'events' | 'organizers' | 'institutions'

function ChartEmpty() {
  return (
    <div className="flex h-full min-h-[180px] items-center justify-center rounded-xl border border-dashed border-border/10 bg-surface/5">
      <p className="text-xs text-text-muted sm:text-sm">Sem dados ainda</p>
    </div>
  )
}

export function AdminDashboard() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<AdminTabId>('overview')

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: fetchAdminStats,
  })

  const { data: events } = useQuery({
    queryKey: ['admin-events'],
    queryFn: () => fetchEvents({ allStatuses: true }),
  })

  const { data: organizers } = useQuery({
    queryKey: ['admin-organizers'],
    queryFn: () => fetchOrganizers(),
  })

  const { data: faculdades } = useQuery({
    queryKey: ['admin-faculdades'],
    queryFn: fetchAllFaculdadesAdmin,
  })

  const { data: atleticas } = useQuery({
    queryKey: ['admin-atleticas'],
    queryFn: fetchAllAtleticasAdmin,
  })

  const { data: eventsByMonth = [] } = useQuery({
    queryKey: ['admin-chart-events-month'],
    queryFn: fetchEventsByMonth,
    enabled: activeTab === 'overview',
  })

  const { data: usersByRole = [] } = useQuery({
    queryKey: ['admin-chart-users-role'],
    queryFn: fetchUsersByRole,
    enabled: activeTab === 'overview',
  })

  const { data: eventsByFaculdade = [] } = useQuery({
    queryKey: ['admin-chart-events-faculdade'],
    queryFn: fetchEventsByFaculdade,
    enabled: activeTab === 'overview',
  })

  const { data: eventsByAtletica = [] } = useQuery({
    queryKey: ['admin-chart-events-atletica'],
    queryFn: fetchEventsByAtletica,
    enabled: activeTab === 'overview',
  })

  const invalidateEvents = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-events'] })
    queryClient.invalidateQueries({ queryKey: ['events'] })
    queryClient.invalidateQueries({ queryKey: ['admin-chart-events-month'] })
    queryClient.invalidateQueries({ queryKey: ['admin-chart-events-faculdade'] })
    queryClient.invalidateQueries({ queryKey: ['admin-chart-events-atletica'] })
  }

  const featuredMutation = useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      updateEventFeatured(id, featured),
    onSuccess: () => {
      invalidateEvents()
      toast.success('Destaque atualizado')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const popularMutation = useMutation({
    mutationFn: ({ id, popular }: { id: string; popular: boolean }) =>
      updateEventPopular(id, popular),
    onSuccess: () => {
      invalidateEvents()
      toast.success('Popularidade atualizada')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  if (statsLoading || !stats) return <LoadingState />

  const tabs = [
    { id: 'overview', label: 'Visão geral' },
    { id: 'events', label: 'Eventos', count: events?.length ?? 0 },
    { id: 'organizers', label: 'Organizadores', count: organizers?.length ?? 0 },
    { id: 'institutions', label: 'Instituições', count: (faculdades?.length ?? 0) + (atleticas?.length ?? 0) },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      <AdminTabs tabs={tabs} active={activeTab} onChange={(id) => setActiveTab(id as AdminTabId)} />

      {activeTab === 'overview' ? (
        <>
          <AdminSection title="Indicadores" description="Panorama geral da plataforma.">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              <AdminStatCard label="Usuários" value={stats.totalUsers} accent="text-secondary" delay={0} />
              <AdminStatCard label="Organizadores" value={stats.totalOrganizers} accent="text-violet-400" delay={0.03} />
              <AdminStatCard label="Participantes" value={stats.totalParticipants} accent="text-cyan-400" delay={0.06} />
              <AdminStatCard label="Eventos" value={stats.totalEvents} accent="text-primary-light" delay={0.09} />
              <AdminStatCard label="Ativos" value={stats.activeEvents} accent="text-green-400" delay={0.12} />
              <AdminStatCard label="Encerrados" value={stats.closedEvents} accent="text-text-muted" delay={0.15} />
              <AdminStatCard label="Faculdades" value={stats.totalFaculdades} accent="text-accent-yellow" delay={0.18} />
              <AdminStatCard label="Atléticas" value={stats.totalAtleticas} accent="text-accent" delay={0.21} />
              <AdminStatCard label="Ingressos" value={stats.ticketsIssued} accent="text-pink-400" delay={0.24} />
            </div>
          </AdminSection>

          <AdminSection title="Análises" description="Distribuição de eventos e usuários.">
            <div className="grid gap-4 sm:gap-6 xl:grid-cols-2">
              <Card className="p-4 sm:p-5" hover={false}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Eventos por mês
                </h3>
                <div className="mt-3 h-48 sm:h-56">
                  {eventsByMonth.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={eventsByMonth} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} tickLine={false} />
                        <YAxis stroke="#9ca3af" fontSize={10} allowDecimals={false} tickLine={false} />
                        <Tooltip contentStyle={TOOLTIP_STYLE} />
                        <Bar dataKey="value" fill="#6D28D9" radius={[4, 4, 0, 0]} maxBarSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <ChartEmpty />
                  )}
                </div>
              </Card>

              <Card className="p-4 sm:p-5" hover={false}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Usuários por perfil
                </h3>
                <div className="mt-3 h-48 sm:h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={usersByRole.filter((u) => u.value > 0)}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={3}
                      >
                        {usersByRole.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={TOOLTIP_STYLE} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {usersByRole.map((item, i) => (
                    <span key={item.name} className="inline-flex items-center gap-1.5 text-[10px] text-text-muted sm:text-xs">
                      <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      {item.name}: {item.value}
                    </span>
                  ))}
                </div>
              </Card>

              <Card className="p-4 sm:p-5 xl:col-span-2" hover={false}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Eventos por faculdade e atlética
                </h3>
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                  <div className="h-44 sm:h-52">
                    {eventsByFaculdade.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={eventsByFaculdade.slice(0, 6)} layout="vertical" margin={{ left: 0, right: 8 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                          <XAxis type="number" stroke="#9ca3af" fontSize={10} allowDecimals={false} />
                          <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={10} width={52} tickLine={false} />
                          <Tooltip contentStyle={TOOLTIP_STYLE} />
                          <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} maxBarSize={18} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <ChartEmpty />
                    )}
                  </div>
                  <div className="h-44 sm:h-52">
                    {eventsByAtletica.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={eventsByAtletica.slice(0, 6)} layout="vertical" margin={{ left: 0, right: 8 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                          <XAxis type="number" stroke="#9ca3af" fontSize={10} allowDecimals={false} />
                          <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={10} width={52} tickLine={false} />
                          <Tooltip contentStyle={TOOLTIP_STYLE} />
                          <Bar dataKey="value" fill="#EC4899" radius={[0, 4, 4, 0]} maxBarSize={18} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <ChartEmpty />
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </AdminSection>
        </>
      ) : null}

      {activeTab === 'events' ? (
        <AdminSection
          title="Gestão de eventos"
          description="Marque destaques e populares para a Home."
        >
          {events?.length === 0 ? (
            <Card className="p-8 text-center" hover={false}>
              <p className="text-sm text-text-muted">Nenhum evento cadastrado.</p>
            </Card>
          ) : (
            <div className="grid gap-3 sm:gap-4">
              {events?.map((event) => (
                <Card key={event.id} className="p-4 sm:p-5" hover={false}>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-heading text-sm font-bold uppercase text-foreground sm:text-base">
                          {event.name}
                        </h4>
                        <Badge variant={event.status === 'PUBLICADO' ? 'success' : 'default'}>
                          {EVENT_STATUS_LABELS[event.status]}
                        </Badge>
                      </div>
                      <p className="mt-1 truncate text-xs text-text-muted sm:text-sm">
                        {event.organizerName}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 lg:shrink-0 lg:justify-end">
                      <AdminToggleChip
                        active={event.featured}
                        activeLabel="Em destaque"
                        inactiveLabel="Destacar"
                        onClick={() =>
                          featuredMutation.mutate({ id: event.id, featured: !event.featured })
                        }
                        activeClass="border-accent-yellow/40 bg-accent-yellow/15 text-accent-yellow"
                      />
                      <AdminToggleChip
                        active={event.popular}
                        activeLabel="Popular"
                        inactiveLabel="Marcar popular"
                        onClick={() =>
                          popularMutation.mutate({ id: event.id, popular: !event.popular })
                        }
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </AdminSection>
      ) : null}

      {activeTab === 'organizers' ? <AdminOrganizers embedded /> : null}

      {activeTab === 'institutions' ? <AdminInstitutions embedded /> : null}
    </div>
  )
}
