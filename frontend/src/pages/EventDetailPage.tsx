import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import {
  fetchEventById,
  getAvailableLotSpots,
  getEventMinPrice,
  getEventSoldCount,
  subscribeToEvent,
} from '@/api/mockApi'
import { useAuth } from '@/contexts/AuthContext'
import { CATEGORY_LABELS, ROUTES } from '@/constants/routes'
import { formatCurrency, formatDateLong, formatTime } from '@/utils/format'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { LoadingState } from '@/components/ui/LoadingState'
import { ErrorState } from '@/components/ui/ErrorState'

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedLotId, setSelectedLotId] = useState<string>('')

  const { data: event, isLoading, isError, refetch } = useQuery({
    queryKey: ['event', id],
    queryFn: () => fetchEventById(id!),
    enabled: !!id,
  })

  const subscribeMutation = useMutation({
    mutationFn: (lotId: string) => subscribeToEvent(user!.id, id!, lotId),
    onSuccess: ({ ticket }) => {
      toast.success('Inscrição confirmada! Seu ingresso foi gerado.')
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['event', id] })
      navigate(ROUTES.TICKET.replace(':id', ticket.id))
    },
    onError: (err: Error) => toast.error(err.message),
  })

  if (isLoading) return <LoadingState message="Carregando evento..." />
  if (isError || !event) return <ErrorState message="Evento não encontrado" onRetry={() => refetch()} />

  const sold = getEventSoldCount(event)
  const available = event.capacity - sold
  const minPrice = getEventMinPrice(event)
  const activeLot = selectedLotId || event.lots.find((l) => getAvailableLotSpots(l) > 0)?.id

  return (
    <>
      <section className="relative h-[50vh] min-h-[400px]">
        <img src={event.bannerUrl} alt="" className="h-full w-full object-cover" />
        <div className="gradient-overlay absolute inset-0" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            <Badge variant="purple" className="mb-4">
              {CATEGORY_LABELS[event.category]}
            </Badge>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-5xl tracking-wider text-white md:text-7xl"
            >
              {event.name}
            </motion.h1>
            <p className="mt-2 text-text-secondary">
              {formatDateLong(event.date)} • {formatTime(event.time)}
              {event.endTime ? ` — ${formatTime(event.endTime)}` : ''}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <section>
              <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-white">
                Sobre o evento
              </h2>
              <p className="mt-4 leading-relaxed text-text-secondary">{event.description}</p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-white">
                Localização
              </h2>
              <Card className="mt-4 p-6" glow>
                <p className="font-semibold text-white">{event.location}</p>
                <p className="mt-1 text-sm text-text-muted">{event.address}</p>
              </Card>
            </section>

            {event.schedule.length > 0 ? (
              <section>
                <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-white">
                  Cronograma
                </h2>
                <div className="mt-4 space-y-3">
                  {event.schedule.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
                    >
                      <span className="font-display text-2xl text-accent-yellow">
                        {formatTime(item.time)}
                      </span>
                      <div>
                        <p className="font-semibold text-white">{item.title}</p>
                        {item.description ? (
                          <p className="text-sm text-text-muted">{item.description}</p>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <div>
            <Card className="sticky top-24 p-6" glow>
              <p className="text-xs uppercase tracking-wider text-text-muted">A partir de</p>
              <p className="font-display text-4xl text-accent-yellow">
                {minPrice === 0 ? 'GRÁTIS' : formatCurrency(minPrice)}
              </p>
              <p className="mt-2 text-sm text-text-muted">
                {available} vagas disponíveis de {event.capacity}
              </p>

              <div className="mt-6 space-y-3">
                <h3 className="font-heading text-sm font-bold uppercase text-white">Lotes</h3>
                {event.lots.map((lot) => {
                  const spots = getAvailableLotSpots(lot)
                  const isSelected = activeLot === lot.id
                  return (
                    <button
                      key={lot.id}
                      type="button"
                      disabled={spots === 0}
                      onClick={() => setSelectedLotId(lot.id)}
                      className={`w-full rounded-xl border p-4 text-left transition ${
                        isSelected
                          ? 'border-accent-yellow bg-accent-yellow/10'
                          : 'border-white/10 hover:border-white/30'
                      } ${spots === 0 ? 'cursor-not-allowed opacity-40' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{lot.name}</span>
                        <span className="font-display text-lg text-accent-yellow">
                          {lot.price === 0 ? 'GRÁTIS' : formatCurrency(lot.price)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-text-muted">
                        {spots > 0 ? `${spots} restantes` : 'Esgotado'}
                      </p>
                    </button>
                  )
                })}
              </div>

              {user ? (
                user.role === 'PARTICIPANTE' ? (
                  <Button
                    variant="ticket"
                    className="mt-6 w-full"
                    disabled={!activeLot || subscribeMutation.isPending}
                    isLoading={subscribeMutation.isPending}
                    onClick={() => {
                      if (activeLot) subscribeMutation.mutate(activeLot)
                    }}
                  >
                    Get Tickets!
                  </Button>
                ) : (
                  <p className="mt-6 text-center text-sm text-text-muted">
                    Faça login como participante para se inscrever.
                  </p>
                )
              ) : (
                <Link to={ROUTES.LOGIN} state={{ from: { pathname: `/eventos/${id}` } }}>
                  <Button variant="ticket" className="mt-6 w-full">
                    Login para comprar
                  </Button>
                </Link>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
