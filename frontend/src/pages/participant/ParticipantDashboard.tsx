import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import {
  cancelInscription,
  fetchUserInscriptions,
  performCheckIn,
} from '@/api/mockApi'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/constants/routes'
import { formatDate } from '@/utils/format'
import { DigitalTicket } from '@/components/ticket/DigitalTicket'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingState } from '@/components/ui/LoadingState'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'

export function ParticipantDashboard() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [checkInCode, setCheckInCode] = useState('')

  const {
    data: inscriptions,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['user-inscriptions', user?.id],
    queryFn: () => fetchUserInscriptions(user!.id),
    enabled: Boolean(user?.id),
    refetchOnMount: 'always',
  })

  const cancelMutation = useMutation({
    mutationFn: (inscriptionId: string) => cancelInscription(inscriptionId, user!.id),
    onSuccess: () => {
      toast.success('Inscrição cancelada')
      queryClient.invalidateQueries({ queryKey: ['user-inscriptions'] })
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const checkInMutation = useMutation({
    mutationFn: performCheckIn,
    onSuccess: () => {
      toast.success('Check-in realizado!')
      setCheckInCode('')
      queryClient.invalidateQueries({ queryKey: ['user-inscriptions'] })
    },
    onError: (e: Error) => toast.error(e.message),
  })

  if (!user) return null

  if (isLoading) return <LoadingState message="Carregando seus ingressos..." />

  if (isError) {
    return (
      <ErrorState
        message="Não foi possível carregar seus ingressos."
        onRetry={() => refetch()}
      />
    )
  }

  const active = inscriptions?.filter((i) => i.inscription.status === 'CONFIRMADA') ?? []
  const history = inscriptions?.filter((i) => i.inscription.status === 'CANCELADA') ?? []
  const ticketsWithData = active.filter((item) => item.ticket && item.event)

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <Card className="p-4 sm:p-5" glow>
          <p className="text-xs uppercase text-text-muted">Inscrições ativas</p>
          <p className="font-display text-3xl text-accent sm:text-4xl">{active.length}</p>
        </Card>
        <Card className="p-4 sm:p-5" glow>
          <p className="text-xs uppercase text-text-muted">Ingressos</p>
          <p className="font-display text-3xl text-accent-yellow sm:text-4xl">
            {active.filter((i) => i.ticket?.status === 'ATIVO').length}
          </p>
        </Card>
        <Card className="p-4 sm:p-5" glow>
          <p className="text-xs uppercase text-text-muted">Histórico</p>
          <p className="font-display text-3xl text-text-muted sm:text-4xl">{history.length}</p>
        </Card>
      </div>

      <Card className="p-4 sm:p-6">
        <h3 className="font-heading text-sm font-bold uppercase text-foreground">
          Simular check-in
        </h3>
        <p className="mt-1 text-sm text-text-muted">
          Cole o código do ingresso para validar entrada
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="VBU-XXXXXXXX"
            value={checkInCode}
            onChange={(e) => setCheckInCode(e.target.value.toUpperCase())}
            className="flex-1"
          />
          <Button
            onClick={() => checkInMutation.mutate(checkInCode)}
            isLoading={checkInMutation.isPending}
            disabled={!checkInCode}
          >
            Check-in
          </Button>
        </div>
      </Card>

      <section>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-accent uppercase">
              Wallet
            </p>
            <h3 className="font-display text-2xl tracking-wider text-foreground sm:text-3xl md:text-4xl">
              MEUS INGRESSOS
            </h3>
          </div>
          <Link
            to={ROUTES.EVENTS}
            className="inline-flex w-full items-center justify-center rounded-full border border-border/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-foreground transition hover:border-border/40 hover:bg-surface/5 sm:w-auto"
          >
            + Novo evento
          </Link>
        </div>

        {ticketsWithData.length === 0 ? (
          <EmptyState
            title="Nenhum ingresso ativo"
            description="Explore os eventos e garanta seu ingresso digital."
            action={
              <Link
                to={ROUTES.EVENTS}
                className="inline-flex items-center justify-center rounded-full bg-accent-yellow px-6 py-3 text-sm font-bold tracking-wider text-black uppercase ticket-notch"
              >
                Ver eventos
              </Link>
            }
          />
        ) : (
          <div className="space-y-6">
            {ticketsWithData.map(({ event, ticket, inscription }, index) => (
              <div key={ticket!.id} className="space-y-3">
                <Link
                  to={ROUTES.TICKET.replace(':id', ticket!.id)}
                  className="block transition hover:brightness-105"
                >
                  <DigitalTicket
                    ticket={ticket!}
                    event={event}
                    user={user}
                    index={index}
                  />
                </Link>

                <div className="flex flex-wrap items-center justify-end gap-2 px-1">
                  <Link
                    to={ROUTES.TICKET.replace(':id', ticket!.id)}
                    className="inline-flex items-center justify-center rounded-full border border-border/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-foreground transition hover:border-border/40"
                  >
                    Tela cheia
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => cancelMutation.mutate(inscription.id)}
                  >
                    Cancelar inscrição
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {history.length > 0 ? (
        <section>
          <h3 className="font-heading text-lg font-bold uppercase text-text-muted">
            Histórico
          </h3>
          <div className="mt-4 space-y-3">
            {history.map(({ inscription, event }) => (
              <div
                key={inscription.id}
                className="rounded-xl border border-border/5 bg-surface/5 px-4 py-3 text-sm text-text-muted"
              >
                {event?.name ?? 'Evento'} — {event ? formatDate(event.date) : '—'} — Cancelada
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
