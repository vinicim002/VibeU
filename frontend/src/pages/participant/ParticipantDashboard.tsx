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
import { formatCurrency, formatDate } from '@/utils/format'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { LoadingState } from '@/components/ui/LoadingState'
import { EmptyState } from '@/components/ui/EmptyState'

export function ParticipantDashboard() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [checkInCode, setCheckInCode] = useState('')

  const { data: inscriptions, isLoading } = useQuery({
    queryKey: ['user-inscriptions', user?.id],
    queryFn: () => fetchUserInscriptions(user!.id),
    enabled: !!user,
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

  const active = inscriptions?.filter((i) => i.inscription.status === 'CONFIRMADA') ?? []
  const history = inscriptions?.filter((i) => i.inscription.status === 'CANCELADA') ?? []

  if (isLoading) return <LoadingState />

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5" glow>
          <p className="text-xs uppercase text-text-muted">Inscrições ativas</p>
          <p className="font-display text-4xl text-accent">{active.length}</p>
        </Card>
        <Card className="p-5" glow>
          <p className="text-xs uppercase text-text-muted">Ingressos</p>
          <p className="font-display text-4xl text-accent-yellow">
            {active.filter((i) => i.ticket?.status === 'ATIVO').length}
          </p>
        </Card>
        <Card className="p-5" glow>
          <p className="text-xs uppercase text-text-muted">Histórico</p>
          <p className="font-display text-4xl text-text-muted">{history.length}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-heading text-sm font-bold uppercase text-white">
          Simular check-in (organizador)
        </h3>
        <p className="mt-1 text-sm text-text-muted">
          Cole o código do ingresso para validar entrada
        </p>
        <div className="mt-4 flex gap-3">
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
        <h3 className="font-heading text-lg font-bold uppercase text-white">
          Meus eventos
        </h3>

        {active.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="Nenhuma inscrição ativa"
              description="Explore os eventos e garanta seu ingresso."
              action={
                <Link to={ROUTES.EVENTS}>
                  <Button variant="ticket">Ver eventos</Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {active.map(({ inscription, event, payment, ticket }) => (
              <Card key={inscription.id} className="p-6" glow>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={event.bannerUrl}
                      alt=""
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-heading font-bold uppercase text-white">
                        {event.name}
                      </h4>
                      <p className="text-sm text-text-muted">
                        {formatDate(event.date)} • {event.location}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="success">{inscription.status}</Badge>
                        {payment ? (
                          <Badge variant="purple">
                            {payment.status} — {formatCurrency(payment.amount)}
                          </Badge>
                        ) : null}
                        {ticket ? (
                          <Badge variant={ticket.status === 'ATIVO' ? 'accent' : 'warning'}>
                            Ingresso {ticket.status}
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ticket ? (
                      <Link to={ROUTES.TICKET.replace(':id', ticket.id)}>
                        <Button variant="ticket" size="sm">
                          Ver ingresso
                        </Button>
                      </Link>
                    ) : null}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => cancelMutation.mutate(inscription.id)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </Card>
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
                className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-text-muted"
              >
                {event.name} — {formatDate(event.date)} — Cancelada
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
