import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { EventWithRelations } from '@/types'
import { CATEGORY_LABELS } from '@/constants/routes'
import { getEventMinPrice, getEventSoldCount } from '@/api'
import { formatCurrency, formatDate, formatDay, formatMonthYear, formatTime } from '@/utils/format'
import { Badge } from '@/components/ui/Badge'
import { ROUTES } from '@/constants/routes'

interface EventCardProps {
  event: EventWithRelations
  index?: number
  layout?: 'split' | 'stacked'
}

export function EventCard({ event, index = 0, layout = 'split' }: EventCardProps) {
  const minPrice = getEventMinPrice(event)
  const sold = getEventSoldCount(event)
  const available = event.capacity - sold
  const isLowStock = available > 0 && available <= 20
  const isStacked = layout === 'stacked'

  if (isStacked) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.08 }}
        whileHover={{ y: -4 }}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/10 bg-bg-gray transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_32px_rgba(109,40,217,0.2)]"
      >
        <div className="relative aspect-[16/10] shrink-0 overflow-hidden sm:aspect-[5/3]">
          <img
            src={event.bannerUrl}
            alt={event.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <Badge variant="purple">{CATEGORY_LABELS[event.category]}</Badge>
            {event.featured ? <Badge variant="accent">Destaque</Badge> : null}
          </div>
          <div className="absolute right-3 bottom-3 rounded-lg bg-bg-dark/80 px-2.5 py-1.5 text-center backdrop-blur-sm">
            <span className="block font-display text-2xl leading-none text-foreground">
              {formatDay(event.date)}
            </span>
            <span className="block text-[9px] font-bold tracking-widest text-text-muted uppercase">
              {formatMonthYear(event.date)}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <h3 className="font-heading text-base leading-tight font-bold uppercase tracking-wide text-foreground line-clamp-2 group-hover:text-accent-yellow sm:text-lg">
            {event.name}
          </h3>
          <p className="mt-1.5 truncate text-sm text-text-muted">{event.location}</p>
          <p className="mt-0.5 text-xs text-secondary">
            {formatTime(event.time)} • {event.cidade}, {event.estado}
          </p>

          {event.faculdades.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {event.faculdades.slice(0, 3).map((f) => (
                <span
                  key={f.id}
                  className="inline-flex items-center gap-1 rounded-full border border-border/10 bg-surface/5 px-2 py-0.5 text-[10px] font-semibold uppercase text-text-secondary"
                >
                  <img src={f.logo} alt="" className="h-3.5 w-3.5 rounded-full" />
                  {f.sigla}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-text-muted">{formatDate(event.date)}</span>
            {isLowStock ? (
              <Badge variant="warning">{available} vagas</Badge>
            ) : available === 0 ? (
              <Badge variant="danger">Esgotado</Badge>
            ) : (
              <Badge variant="success">Disponível</Badge>
            )}
          </div>

          <div className="mt-auto flex flex-col gap-3 pt-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-[10px] text-text-muted uppercase">A partir de</span>
              <p className="font-display text-xl text-accent-yellow sm:text-2xl">
                {minPrice === 0 ? 'GRÁTIS' : formatCurrency(minPrice)}
              </p>
            </div>
            <Link
              to={ROUTES.EVENT_DETAIL.replace(':id', event.id)}
              className="inline-flex w-full items-center justify-center rounded-full bg-accent-yellow px-4 py-2.5 text-xs font-bold tracking-wider text-black uppercase ticket-notch transition hover:brightness-110 sm:w-auto"
            >
              Comprar Ingresso
            </Link>
          </div>
        </div>
      </motion.article>
    )
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-2xl border border-border/10 bg-bg-gray transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_40px_rgba(109,40,217,0.25)]"
    >
      <div className="grid lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[240px]">
          <img
            src={event.bannerUrl}
            alt={event.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <Badge variant="purple">{CATEGORY_LABELS[event.category]}</Badge>
            {event.featured ? <Badge variant="accent">Destaque</Badge> : null}
          </div>
        </div>

        <div className="flex flex-col justify-between p-5 sm:p-6">
          <div>
            <div className="mb-4 flex items-start gap-3 sm:gap-4">
              <div className="shrink-0 text-center">
                <span className="block font-display text-3xl leading-none text-foreground sm:text-4xl">
                  {formatDay(event.date)}
                </span>
                <span className="block text-[10px] font-bold tracking-widest text-text-muted uppercase">
                  {formatMonthYear(event.date)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-heading text-base leading-tight font-bold uppercase tracking-wide text-foreground line-clamp-2 group-hover:text-accent-yellow sm:text-lg">
                  {event.name}
                </h3>
                <p className="mt-1 truncate text-sm text-text-muted">{event.location}</p>
                <p className="mt-1 text-xs text-secondary">
                  {formatTime(event.time)} • {event.cidade}, {event.estado}
                </p>
              </div>
            </div>

            {event.faculdades.length > 0 ? (
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {event.faculdades.map((f) => (
                  <span
                    key={f.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border/10 bg-surface/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-text-secondary"
                  >
                    <img src={f.logo} alt="" className="h-4 w-4 rounded-full" />
                    {f.sigla}
                  </span>
                ))}
              </div>
            ) : null}

            {event.atleticas.length > 0 ? (
              <p className="mb-3 text-xs text-text-muted line-clamp-1">
                <span className="text-accent">Atléticas:</span>{' '}
                {event.atleticas.map((a) => a.sigla).join(' • ')}
              </p>
            ) : null}

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-text-muted">{formatDate(event.date)}</span>
              {isLowStock ? (
                <Badge variant="warning">{available} vagas</Badge>
              ) : available === 0 ? (
                <Badge variant="danger">Esgotado</Badge>
              ) : (
                <Badge variant="success">Disponível</Badge>
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs text-text-muted uppercase">A partir de</span>
              <p className="font-display text-xl text-accent-yellow sm:text-2xl">
                {minPrice === 0 ? 'GRÁTIS' : formatCurrency(minPrice)}
              </p>
            </div>
            <Link
              to={ROUTES.EVENT_DETAIL.replace(':id', event.id)}
              className="inline-flex w-full items-center justify-center rounded-full bg-accent-yellow px-5 py-2.5 text-xs font-bold tracking-wider text-black uppercase ticket-notch transition hover:brightness-110 sm:w-auto"
            >
              Comprar Ingresso
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
