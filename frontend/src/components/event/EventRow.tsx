import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Event } from '@/types'
import { getEventMinPrice, getEventSoldCount } from '@/api/mockApi'
import { formatCurrency, formatDate } from '@/utils/format'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'

interface EventRowProps {
  event: Event
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
      className="group grid grid-cols-1 items-center gap-4 border-b border-white/5 py-6 transition hover:bg-white/[0.02] md:grid-cols-[140px_1fr_auto]"
    >
      <div className="text-sm text-text-muted">
        <span className="block font-semibold text-white">{formatDate(event.date)}</span>
        <span>{event.time.slice(0, 5)}</span>
      </div>

      <div className="flex items-center gap-4">
        <img
          src={event.bannerUrl}
          alt=""
          className="h-20 w-20 shrink-0 rounded-xl object-cover"
        />
        <div>
          <h3 className="font-heading text-base font-bold uppercase tracking-wide text-white group-hover:text-accent">
            {event.name}
          </h3>
          <p className="mt-1 flex items-center gap-2 text-sm text-text-muted">
            <span>📍 {event.location}</span>
            <span>•</span>
            <span>🕒 {event.time.slice(0, 5)}</span>
          </p>
          {available > 0 && available <= 30 ? (
            <Badge variant="accent" className="mt-2">
              {available} ingressos restantes
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col items-start gap-2 md:items-end">
        <Link to={ROUTES.EVENT_DETAIL.replace(':id', event.id)}>
          <Button variant="accent" size="sm">
            Comprar — {minPrice === 0 ? 'Grátis' : formatCurrency(minPrice)}
          </Button>
        </Link>
        <Link
          to={ROUTES.EVENT_DETAIL.replace(':id', event.id)}
          className="text-xs text-text-muted underline-offset-4 hover:text-white hover:underline"
        >
          Mais info
        </Link>
      </div>
    </motion.div>
  )
}
