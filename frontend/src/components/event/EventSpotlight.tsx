import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { EventWithRelations } from '@/types'
import { CATEGORY_LABELS, ROUTES } from '@/constants/routes'
import { getEventMinPrice } from '@/api'
import { formatCurrency, formatDateLong, formatTime } from '@/utils/format'
import { Badge } from '@/components/ui/Badge'

interface EventSpotlightProps {
  event: EventWithRelations
}

export function EventSpotlight({ event }: EventSpotlightProps) {
  const minPrice = getEventMinPrice(event)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative mb-12 overflow-hidden rounded-3xl border border-border/10"
    >
      <div className="absolute inset-0">
        <img
          src={event.bannerUrl}
          alt=""
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
      </div>

      <div className="relative flex min-h-[320px] flex-col justify-end p-6 sm:min-h-[380px] sm:p-10 lg:min-h-[420px]">
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant="accent">Em destaque</Badge>
          <Badge variant="purple">{CATEGORY_LABELS[event.category]}</Badge>
        </div>

        <h2 className="max-w-2xl font-display text-4xl tracking-wider text-on-media sm:text-5xl lg:text-6xl">
          {event.name}
        </h2>

        <p className="mt-3 max-w-xl text-sm text-on-media/80 sm:text-base">
          {formatDateLong(event.date)} • {formatTime(event.time)} • {event.location} — {event.cidade}, {event.estado}
        </p>

        {event.faculdades.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {event.faculdades.map((f) => (
              <span
                key={f.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/15 bg-surface/10 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur-sm"
              >
                <img src={f.logo} alt="" className="h-4 w-4 rounded-full" />
                {f.sigla}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            to={ROUTES.EVENT_DETAIL.replace(':id', event.id)}
            className="inline-flex items-center justify-center rounded-full bg-accent-yellow px-8 py-3.5 text-sm font-bold tracking-wider text-black uppercase ticket-notch transition hover:brightness-110"
          >
            Garantir ingresso — {minPrice === 0 ? 'Grátis' : formatCurrency(minPrice)}
          </Link>
          <Link
            to={ROUTES.EVENT_DETAIL.replace(':id', event.id)}
            className="text-sm font-semibold text-on-media/80 underline-offset-4 transition hover:text-on-media hover:underline"
          >
            Ver detalhes
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
