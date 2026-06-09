import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import {
  fetchEventById,
  getAvailableLotSpots,
  subscribeToEvent,
} from '@/api/mockApi'
import { useAuth } from '@/contexts/AuthContext'
import { RequireAuth } from '@/components/common/RequireAuth'
import { CATEGORY_LABELS, ROUTES } from '@/constants/routes'
import { formatCurrency, formatDateLong, formatTime } from '@/utils/format'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { LoadingState } from '@/components/ui/LoadingState'
import { ErrorState } from '@/components/ui/ErrorState'

function CheckoutContent() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const lotId = searchParams.get('lot')
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: event, isPending, isError, refetch } = useQuery({
    queryKey: ['event', id],
    queryFn: () => fetchEventById(id!),
    enabled: !!id,
  })

  const lot = event?.lots.find((l) => l.id === lotId)

  const mutation = useMutation({
    mutationFn: () => subscribeToEvent(user!.id, id!, lotId!),
    onSuccess: ({ ticket }) => {
      toast.success('Pagamento confirmado! Seu ingresso foi gerado.')
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['user-inscriptions'] })
      navigate(ROUTES.TICKET.replace(':id', ticket.id))
    },
    onError: (err: Error) => toast.error(err.message),
  })

  if (isPending || mutation.isPending) {
    return <LoadingState message={mutation.isPending ? 'Processando pagamento...' : 'Carregando...'} />
  }

  if (isError || !event || !lot || getAvailableLotSpots(lot) <= 0) {
    return (
      <ErrorState
        message="Checkout inválido. Selecione um lote disponível no evento."
        onRetry={() => refetch()}
      />
    )
  }

  const total = lot.price

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-xs font-bold tracking-[0.3em] text-accent uppercase">Checkout</p>
      <h1 className="mt-2 font-display text-4xl tracking-wider text-foreground sm:text-5xl">
        FINALIZAR COMPRA
      </h1>

      <Card className="mt-8 p-6" glow>
        <div className="flex gap-4">
          <img
            src={event.bannerUrl}
            alt=""
            className="h-24 w-24 shrink-0 rounded-xl object-cover"
          />
          <div>
            <Badge variant="purple">{CATEGORY_LABELS[event.category]}</Badge>
            <h2 className="mt-2 font-heading text-lg font-bold uppercase text-foreground">
              {event.name}
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              {formatDateLong(event.date)} • {formatTime(event.time)}
            </p>
            <p className="text-sm text-text-muted">{event.location}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3 border-t border-border/10 pt-6">
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Lote</span>
            <span className="font-medium text-foreground">{lot.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Participante</span>
            <span className="font-medium text-foreground">{user?.name}</span>
          </div>
          <div className="flex justify-between border-t border-border/10 pt-3">
            <span className="font-heading font-bold uppercase text-foreground">Total</span>
            <span className="font-display text-2xl text-accent-yellow">
              {total === 0 ? 'GRÁTIS' : formatCurrency(total)}
            </span>
          </div>
        </div>

        <p className="mt-4 text-xs text-text-muted">
          Pagamento simulado — em produção, integração com gateway de pagamento.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            variant="ticket"
            className="flex-1 sm:flex-none"
            isLoading={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            Confirmar e pagar
          </Button>
          <Link to={ROUTES.EVENT_DETAIL.replace(':id', event.id)}>
            <Button variant="ghost">Voltar ao evento</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}

export function CheckoutPage() {
  return (
    <RequireAuth roles={['PARTICIPANTE']}>
      <CheckoutContent />
    </RequireAuth>
  )
}
