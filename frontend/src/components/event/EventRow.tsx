import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { EventWithRelations } from '@/types'
import { getEventMinPrice, getEventSoldCount } from '@/api/mockApi'
import { formatCurrency, formatDate } from '@/utils/format'
import { Badge } from '@/components/ui/Badge'
import { ROUTES } from '@/constants/routes'

interface EventRowProps {
  event: EventWithRelations
  index?: number
}

export function EventRow({ event, index = 0 }: EventRowProps) {
  const minPrice = getEventMinPrice(event)
  const sold = getEventSoldCount(event)
  const available = event.capacity - sold

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group grid grid-cols-1 items-center gap-4 border-b border-border/5 py-6 transition hover:bg-surface/[0.02] md:grid-cols-[140px_1fr_auto]"
    >
      <div className="text-sm text-text-muted">
        <span className="block font-semibold text-foreground">{formatDate(event.date)}</span>
        <span>{event.time.slice(0, 5)}</span>
      </div>

      <div className="flex items-center gap-4">
        <img
          src={event.bannerUrl}
          alt=""
          className="h-20 w-20 shrink-0 rounded-xl object-cover"
        />
        <div className="min-w-0">
          <h3 className="font-heading text-base font-bold uppercase tracking-wide text-foreground group-hover:text-accent">
            {event.name}
          </h3>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-text-muted">
            <span>📍 {event.location}</span>
            <span>•</span>
            <span>{event.cidade}, {event.estado}</span>
          </p>
          {event.faculdades.length > 0 ? (
            <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-secondary">
              {event.faculdades.map((f) => (
                <span key={f.id} className="inline-flex items-center gap-1">
                  <img src={f.logo} alt="" className="h-4 w-4 rounded-full" />
                  {f.sigla}
                </span>
              ))}
            </p>
          ) : null}
          {event.atleticas.length > 0 ? (
            <p className="mt-1 text-xs text-text-muted">
              Atléticas: {event.atleticas.map((a) => a.sigla).join(', ')}
            </p>
          ) : null}
          {available > 0 && available <= 30 ? (
            <Badge variant="accent" className="mt-2">
              {available} ingressos restantes
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col items-start gap-2 md:items-end">
        <Link
          to={ROUTES.EVENT_DETAIL.replace(':id', event.id)}
          className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2 text-xs font-semibold uppercase tracking-wide text-foreground transition hover:bg-pink-500"
        >
          Comprar — {minPrice === 0 ? 'Grátis' : formatCurrency(minPrice)}
        </Link>
        <Link
          to={ROUTES.EVENT_DETAIL.replace(':id', event.id)}
          className="text-xs text-text-muted underline-offset-4 hover:text-foreground hover:underline"
        >
          Mais info
        </Link>
      </div>
    </motion.div>
  )
}
