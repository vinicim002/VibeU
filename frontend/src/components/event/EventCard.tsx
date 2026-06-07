import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Event } from '@/types'
import { CATEGORY_LABELS } from '@/constants/routes'
import { getEventMinPrice, getEventSoldCount } from '@/api/mockApi'
import { formatCurrency, formatDate, formatDay, formatMonthYear } from '@/utils/format'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'

interface EventCardProps {
  event: Event
  index?: number
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const minPrice = getEventMinPrice(event)
  const sold = getEventSoldCount(event)
  const available = event.capacity - sold
  const isLowStock = available > 0 && available <= 20

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-bg-gray transition-all duration-300 hover:border-primary/40 hover:glow-purple"
    >
      <div className="grid md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden md:aspect-auto md:min-h-[220px]">
          <img
            src={event.bannerUrl}
            alt={event.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 to-transparent" />
          <div className="absolute top-4 left-4">
            <Badge variant="purple">{CATEGORY_LABELS[event.category]}</Badge>
          </div>
        </div>

        <div className="flex flex-col justify-between p-6">
          <div>
            <div className="mb-4 flex items-start gap-4">
              <div className="text-center">
                <span className="block font-display text-4xl leading-none text-white">
                  {formatDay(event.date)}
                </span>
                <span className="block text-[10px] font-bold tracking-widest text-text-muted uppercase">
                  {formatMonthYear(event.date)}
                </span>
              </div>
              <div>
                <h3 className="font-heading text-lg leading-tight font-bold uppercase tracking-wide text-white">
                  {event.name}
                </h3>
                <p className="mt-1 text-sm text-text-muted">{event.location}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-text-muted">{formatDate(event.date)}</span>
              {isLowStock ? (
                <Badge variant="warning">{available} vagas restantes</Badge>
              ) : available === 0 ? (
                <Badge variant="danger">Esgotado</Badge>
              ) : (
                <Badge variant="success">Disponível</Badge>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-end justify-between gap-4">
            <div>
              <span className="text-xs text-text-muted uppercase">A partir de</span>
              <p className="font-display text-2xl text-accent-yellow">
                {minPrice === 0 ? 'GRÁTIS' : formatCurrency(minPrice)}
              </p>
            </div>
            <Link to={ROUTES.EVENT_DETAIL.replace(':id', event.id)}>
              <Button variant="ticket" size="sm">
                Get Tickets!
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
