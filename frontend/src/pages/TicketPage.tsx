import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchTicketById } from '@/api/mockApi'
import { TicketPass } from '@/components/ticket/TicketPass'
import { LoadingState } from '@/components/ui/LoadingState'
import { ErrorState } from '@/components/ui/ErrorState'
import { ROUTES } from '@/constants/routes'

export function TicketPage() {
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['ticket', id],
    queryFn: () => fetchTicketById(id!),
    enabled: !!id,
  })

  if (isLoading) return <LoadingState message="Carregando ingresso..." />
  if (isError || !data) {
    return (
      <div className="px-4 py-20">
        <ErrorState message="Ingresso não encontrado" onRetry={() => refetch()} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-dark px-4 py-12">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="font-display text-4xl tracking-wider text-foreground">SEU INGRESSO</h1>
        <p className="mt-2 text-sm text-text-muted">
          Apresente este QR Code na entrada do evento
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-4xl">
        <TicketPass ticket={data.ticket} event={data.event} user={data.user} />
      </div>

      <div className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-3">
        <Link
          to={ROUTES.PARTICIPANT_DASHBOARD}
          className="inline-flex items-center justify-center rounded-full border border-border/20 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-foreground transition hover:border-border/40 hover:bg-surface/5"
        >
          Meus ingressos
        </Link>
        <Link
          to={ROUTES.PROFILE}
          className="inline-flex items-center justify-center rounded-full border border-border/20 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-foreground transition hover:border-border/40 hover:bg-surface/5"
        >
          Meu perfil
        </Link>
        <Link
          to={ROUTES.EVENTS}
          className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-primary-light"
        >
          Ver eventos
        </Link>
      </div>
    </div>
  )
}
