import { motion } from 'framer-motion'
import QRCode from 'react-qr-code'
import type { Event, Ticket, User } from '@/types'
import { formatDate, formatTime } from '@/utils/format'

interface TicketPassProps {
  ticket: Ticket
  event: Event
  user: User
}

export function TicketPass({ ticket, event, user }: TicketPassProps) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateX: -15 }}
      animate={{ opacity: 1, rotateX: 0 }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-md overflow-hidden rounded-t-3xl border border-white/10 bg-[#f5f5f0] text-black shadow-2xl"
    >
      <div className="relative bg-black p-6 text-white">
        <div className="flex items-start justify-between">
          <span className="rounded-full border border-white/30 px-3 py-1 text-xs font-bold">
            VibeU Pass
          </span>
          <div className="text-right">
            <p className="font-display text-3xl leading-none">{formatDate(event.date).split(' ')[0]}</p>
            <p className="text-xs uppercase tracking-widest text-text-muted">
              {formatDate(event.date).split(' ').slice(1).join(' ')}
            </p>
            <p className="mt-1 text-sm font-semibold">{formatTime(event.time)}</p>
          </div>
        </div>

        <h2 className="mt-8 font-heading text-2xl leading-tight font-bold uppercase tracking-wide">
          {event.name}
        </h2>
        <p className="mt-2 text-sm text-text-muted">{event.location}</p>
      </div>

      <div className="grid grid-cols-[auto_1fr] gap-6 p-6">
        <div className="flex flex-col items-center justify-center border-r border-dashed border-black/20 pr-6">
          <span className="font-display text-5xl leading-none text-black/20 [writing-mode:vertical-rl] rotate-180">
            vibe
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-black/40 uppercase">
              Participante
            </span>
            <p className="font-semibold">{user.name}</p>
          </div>
          <div className="flex gap-4">
            <div className="rounded-full border border-black/20 px-4 py-2">
              <span className="text-[10px] font-bold tracking-widest text-black/40 uppercase">
                Local
              </span>
              <p className="text-sm font-medium">{event.location.split('—')[0]?.trim()}</p>
            </div>
            <div className="rounded-full border border-black/20 px-4 py-2">
              <span className="text-[10px] font-bold tracking-widest text-black/40 uppercase">
                Código
              </span>
              <p className="font-mono text-sm font-bold">{ticket.code}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-dashed border-black/20 bg-[#f5f5f0] p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="rounded-lg bg-white p-3">
            <QRCode value={ticket.code} size={80} />
          </div>
          <div className="flex-1 text-right">
            <p className="font-mono text-xs tracking-[0.3em] text-black/40">
              ||| || ||| | || |||
            </p>
            <p className="mt-2 text-xs text-black/50">Apresente na entrada do evento</p>
            <p className="mt-1 font-mono text-sm font-bold">{ticket.code}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
