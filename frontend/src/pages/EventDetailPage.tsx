import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  fetchEventById,
  getAvailableLotSpots,
  getEventMinPrice,
  getEventSoldCount,
} from '@/api'
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
  const [selectedLotId, setSelectedLotId] = useState<string>('')

  const { data: event, isPending, isError, refetch } = useQuery({
    queryKey: ['event', id],
    queryFn: () => fetchEventById(id!),
    enabled: !!id,
    staleTime: 0,
  })

  if (isPending) return <LoadingState message="Carregando evento..." />
  if (isError || !event) {
    return (
      <ErrorState
        message="Evento não encontrado. Atualize a lista de eventos e tente novamente."
        onRetry={() => refetch()}
      />
    )
  }

  const sold = getEventSoldCount(event)
  const available = event.capacity - sold
  const minPrice = getEventMinPrice(event)
  const activeLot = selectedLotId || event.lots.find((l) => getAvailableLotSpots(l) > 0)?.id
  const loginReturnPath = activeLot ? `/eventos/${id}?lot=${activeLot}` : `/eventos/${id}`

  return (
    <>
      <section className="relative min-h-[55vh]">
        <img src={event.bannerUrl} alt="" className="h-full min-h-[55vh] w-full object-cover" />
        <div className="gradient-overlay absolute inset-0" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge variant="purple">{CATEGORY_LABELS[event.category]}</Badge>
              {event.featured ? <Badge variant="accent">Destaque</Badge> : null}
              <Badge variant="default">{event.cidade}, {event.estado}</Badge>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-5xl tracking-wider text-on-media md:text-7xl"
            >
              {event.name}
            </motion.h1>
            <p className="mt-2 text-on-media/80">
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
              <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-foreground">
                Sobre o evento
              </h2>
              <p className="mt-4 leading-relaxed text-text-secondary">{event.description}</p>
            </section>

            {event.faculdades.length > 0 ? (
              <section>
                <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-foreground">
                  Faculdades participantes
                </h2>
                <div className="mt-4 flex flex-wrap gap-4">
                  {event.faculdades.map((f) => (
                    <Link
                      key={f.id}
                      to={ROUTES.FACULDADE_DETAIL.replace(':id', f.id)}
                      className="flex items-center gap-3 rounded-xl border border-border/10 bg-surface/5 px-4 py-3 transition hover:border-secondary/50"
                    >
                      <img src={f.logo} alt="" className="h-10 w-10 rounded-full" />
                      <div>
                        <p className="font-semibold text-foreground">{f.sigla}</p>
                        <p className="text-xs text-text-muted">{f.nome}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {event.atleticas.length > 0 ? (
              <section>
                <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-foreground">
                  Atléticas organizadoras
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {event.atleticas.map((a) => (
                    <Link
                      key={a.id}
                      to={ROUTES.ATLETICA_DETAIL.replace(':id', a.id)}
                      className="flex items-start gap-3 rounded-xl border border-border/10 bg-surface/5 p-4 transition hover:border-accent/40"
                    >
                      <img src={a.logo} alt="" className="h-10 w-10 rounded-full" />
                      <div>
                        <p className="font-semibold text-foreground">{a.nome}</p>
                        <p className="mt-1 text-xs text-text-muted">{a.descricao}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            <section>
              <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-foreground">
                Localização
              </h2>
              <Card className="mt-4 p-6" glow>
                <p className="font-semibold text-foreground">{event.location}</p>
                <p className="mt-1 text-sm text-text-muted">{event.address}</p>
                <p className="mt-2 text-sm text-secondary">
                  {event.cidade}, {event.estado}
                </p>
                <p className="mt-4 text-xs text-text-muted italic">
                  Mapa interativo — em breve
                </p>
              </Card>
            </section>

            {event.schedule.length > 0 ? (
              <section>
                <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-foreground">
                  Cronograma
                </h2>
                <div className="mt-4 space-y-3">
                  {event.schedule.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 rounded-xl border border-border/10 bg-surface/5 p-4"
                    >
                      <span className="font-display text-2xl text-accent-yellow">
                        {formatTime(item.time)}
                      </span>
                      <div>
                        <p className="font-semibold text-foreground">{item.title}</p>
                        {item.description ? (
                          <p className="text-sm text-text-muted">{item.description}</p>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {event.rules.length > 0 ? (
              <section>
                <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-foreground">
                  Regras do evento
                </h2>
                <ul className="mt-4 space-y-2">
                  {event.rules.map((rule) => (
                    <li
                      key={rule}
                      className="flex items-start gap-2 rounded-lg border border-border/5 bg-surface/5 px-4 py-3 text-sm text-text-secondary"
                    >
                      <span className="text-accent">•</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section>
              <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-foreground">
                Organizador
              </h2>
              <Card className="mt-4 p-6">
                <p className="font-semibold text-foreground">{event.organizerName}</p>
                <p className="mt-1 text-sm text-text-muted">
                  Responsável pela produção e gestão deste evento na plataforma VibeU.
                </p>
              </Card>
            </section>
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
                <h3 className="font-heading text-sm font-bold uppercase text-foreground">Lotes</h3>
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
                          : 'border-border/10 hover:border-border/30'
                      } ${spots === 0 ? 'cursor-not-allowed opacity-40' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">{lot.name}</span>
                        <span className="font-display text-lg text-accent-yellow">
                          {lot.price === 0 ? 'GRÁTIS' : formatCurrency(lot.price)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-text-muted">
                        {spots > 0 ? `${spots} de ${lot.quantity} restantes` : 'Esgotado'}
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
                    disabled={!activeLot}
                    onClick={() => {
                      if (activeLot) {
                        navigate(
                          `${ROUTES.EVENT_CHECKOUT.replace(':id', id!)}?lot=${activeLot}`,
                        )
                      }
                    }}
                  >
                    Comprar Ingresso
                  </Button>
                ) : (
                  <p className="mt-6 text-center text-sm text-text-muted">
                    Faça login como participante para se inscrever.
                  </p>
                )
              ) : (
                <Link
                  to={ROUTES.LOGIN}
                  state={{ from: { pathname: loginReturnPath } }}
                >
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
