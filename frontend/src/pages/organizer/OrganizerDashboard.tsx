import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import {
  cancelEvent,
  deleteEvent,
  fetchOrganizerEvents,
  fetchOrganizerStats,
  publishEvent,
} from '@/api/mockApi'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES, EVENT_STATUS_LABELS } from '@/constants/routes'
import { formatCurrency, formatDate } from '@/utils/format'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { LoadingState } from '@/components/ui/LoadingState'
import { EmptyState } from '@/components/ui/EmptyState'

export function OrganizerDashboard() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['organizer-stats', user?.id],
    queryFn: () => fetchOrganizerStats(user!.id),
    enabled: !!user,
  })

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['organizer-events', user?.id],
    queryFn: () => fetchOrganizerEvents(user!.id),
    enabled: !!user,
  })

  const publishMutation = useMutation({
    mutationFn: publishEvent,
    onSuccess: () => {
      toast.success('Evento publicado!')
      queryClient.invalidateQueries({ queryKey: ['organizer-events'] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const cancelMutation = useMutation({
    mutationFn: cancelEvent,
    onSuccess: () => {
      toast.success('Evento cancelado')
      queryClient.invalidateQueries({ queryKey: ['organizer-events'] })
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      toast.success('Evento excluído')
      queryClient.invalidateQueries({ queryKey: ['organizer-events'] })
    },
    onError: (e: Error) => toast.error(e.message),
  })

  if (statsLoading || eventsLoading) return <LoadingState />

  const statCards = stats
    ? [
        { label: 'Meus eventos', value: stats.totalEvents },
        { label: 'Publicados', value: stats.publishedEvents },
        { label: 'Inscrições', value: stats.totalInscriptions },
        { label: 'Receita', value: formatCurrency(stats.totalRevenue) },
        { label: 'Check-ins', value: stats.totalCheckIns },
      ]
    : []

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-text-muted">Gerencie seus eventos universitários</p>
        <Link to={ROUTES.ORGANIZER_CREATE_EVENT}>
          <Button variant="accent">+ Novo evento</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat) => (
          <Card key={stat.label} className="p-5" glow>
            <p className="text-xs uppercase tracking-wider text-text-muted">{stat.label}</p>
            <p className="mt-2 font-display text-3xl text-white">{stat.value}</p>
          </Card>
        ))}
      </div>

      {events?.length === 0 ? (
        <EmptyState
          title="Nenhum evento criado"
          description="Crie seu primeiro evento e comece a vender ingressos."
          action={
            <Link to={ROUTES.ORGANIZER_CREATE_EVENT}>
              <Button variant="primary">Criar evento</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {events?.map((event) => (
            <Card key={event.id} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={event.bannerUrl}
                  alt=""
                  className="h-16 w-16 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-heading font-bold uppercase text-white">{event.name}</h3>
                  <p className="text-sm text-text-muted">
                    {formatDate(event.date)} • {event.location}
                  </p>
                  <Badge
                    variant={event.status === 'PUBLICADO' ? 'success' : event.status === 'CANCELADO' ? 'danger' : 'default'}
                    className="mt-2"
                  >
                    {EVENT_STATUS_LABELS[event.status]}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {event.status === 'RASCUNHO' ? (
                  <>
                    <Button size="sm" onClick={() => publishMutation.mutate(event.id)}>
                      Publicar
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => deleteMutation.mutate(event.id)}
                    >
                      Excluir
                    </Button>
                  </>
                ) : null}
                {event.status === 'PUBLICADO' ? (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => cancelMutation.mutate(event.id)}
                  >
                    Cancelar
                  </Button>
                ) : null}
                <Link to={ROUTES.EVENT_DETAIL.replace(':id', event.id)}>
                  <Button size="sm" variant="ghost">
                    Ver
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
