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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-text-muted sm:text-base">Gerencie seus eventos universitários</p>
        <Link to={ROUTES.ORGANIZER_CREATE_EVENT} className="w-full sm:w-auto">
          <Button variant="accent" className="w-full sm:w-auto">
            + Novo evento
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        {statCards.map((stat) => (
          <Card key={stat.label} className="p-4 sm:p-5" glow>
            <p className="text-[10px] uppercase tracking-wider text-text-muted sm:text-xs">
              {stat.label}
            </p>
            <p className="mt-2 font-display text-2xl text-foreground sm:text-3xl">{stat.value}</p>
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
            <Card key={event.id} className="flex flex-col gap-4 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
                <img
                  src={event.bannerUrl}
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-xl object-cover sm:h-16 sm:w-16"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-heading font-bold uppercase text-foreground">
                    {event.name}
                  </h3>
                  <p className="mt-1 text-xs text-text-muted sm:text-sm">
                    {formatDate(event.date)} • {event.location} • {event.cidade}/{event.estado}
                  </p>
                  <Badge
                    variant={event.status === 'PUBLICADO' ? 'success' : event.status === 'CANCELADO' ? 'danger' : 'default'}
                    className="mt-2"
                  >
                    {EVENT_STATUS_LABELS[event.status]}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 lg:shrink-0 lg:justify-end">
                {(event.status === 'RASCUNHO' || event.status === 'PUBLICADO') ? (
                  <Link to={ROUTES.ORGANIZER_EDIT_EVENT.replace(':id', event.id)}>
                    <Button size="sm" variant="secondary">
                      Editar
                    </Button>
                  </Link>
                ) : null}
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
