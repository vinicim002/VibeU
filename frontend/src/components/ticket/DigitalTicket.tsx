import { motion } from 'framer-motion'
import { QRCode } from 'react-qr-code'
import type { Event, Ticket, TicketStatus } from '@/types'
import { formatTime } from '@/utils/format'
import {
  formatTicketDate,
  getEnrollmentId,
  getTicketShortCode,
  getUniversityLabel,
} from '@/utils/ticket'

interface TicketUser {
  id: string
  name: string
  email: string
}

interface DigitalTicketProps {
  ticket: Ticket
  event: Event
  user: TicketUser
  index?: number
  className?: string
}

const STATUS_CONFIG: Record<
  TicketStatus,
  { label: string; className: string }
> = {
  ATIVO: {
    label: 'INGRESSO EMITIDO',
    className:
      'border-cyan-400/50 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.35)]',
  },
  UTILIZADO: {
    label: 'CHECK-IN REALIZADO',
    className:
      'border-green-400/50 text-green-300 shadow-[0_0_20px_rgba(74,222,128,0.25)]',
  },
  CANCELADO: {
    label: 'CANCELADO',
    className: 'border-red-400/50 text-red-300 shadow-[0_0_20px_rgba(248,113,113,0.2)]',
  },
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function BuildingIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 21V7l8-4 8 4v14H4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 21v-4h6v4M9 9h.01M15 9h.01M9 13h.01M15 13h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function TicketBarcode({ code }: { code: string }) {
  const bars = Array.from({ length: 48 }, (_, i) => {
    const char = code.charCodeAt(i % code.length)
    return 1 + (char % 3)
  })

  return (
    <div
      className="flex h-9 items-stretch justify-center gap-[1.5px] overflow-hidden opacity-90"
      aria-hidden
    >
      {bars.map((width, i) => (
        <div
          key={i}
          className="rounded-[1px] bg-foreground/90"
          style={{ width: `${width}px` }}
        />
      ))}
    </div>
  )
}

export function DigitalTicket({
  ticket,
  event,
  user,
  index = 0,
  className = '',
}: DigitalTicketProps) {
  const status = STATUS_CONFIG[ticket.status]
  const shortCode = getTicketShortCode(ticket.code)
  const university = getUniversityLabel(user.email)
  const enrollmentId = getEnrollmentId(user.id)
  const locationLabel = event.location.split('—')[0]?.trim() ?? event.location

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`theme-card relative overflow-hidden rounded-2xl border border-border/10 bg-bg-slate shadow-[0_20px_60px_rgba(0,0,0,0.15)] ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-secondary/10 to-transparent" />

      {/* Notches — recorte de ticket */}
      <div className="pointer-events-none absolute top-1/2 left-0 z-20 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bg-dark lg:h-6 lg:w-6" />
      <div className="pointer-events-none absolute top-1/2 right-0 z-20 h-5 w-5 translate-x-1/2 -translate-y-1/2 rounded-full bg-bg-dark lg:right-[28%] lg:translate-x-1/2" />

      <div className="relative flex flex-col lg:flex-row">
        {/* Left — informações */}
        <div className="min-w-0 flex-1 p-5 sm:p-6 lg:p-7">
          <div className="flex items-start justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-secondary uppercase">
              <BuildingIcon />
              {university}
            </span>
            <span
              className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-bold tracking-widest uppercase ${status.className}`}
            >
              {status.label}
            </span>
          </div>

          <h3 className="mt-5 text-xl leading-snug font-bold text-foreground sm:text-2xl">
            {event.name}
          </h3>

          <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
            <li className="flex items-center gap-2.5">
              <span className="text-secondary">
                <CalendarIcon />
              </span>
              {formatTicketDate(event.date)}
            </li>
            <li className="flex items-center gap-2.5">
              <span className="text-secondary">
                <ClockIcon />
              </span>
              {formatTime(event.time)} h
            </li>
            <li className="flex items-center gap-2.5">
              <span className="text-secondary">
                <PinIcon />
              </span>
              {locationLabel}
            </li>
          </ul>

          <div className="my-5 h-px bg-border/10" />

          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-500 uppercase">
              Participante
            </p>
            <p className="mt-1 text-base font-semibold text-foreground">{user.name}</p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-500 uppercase">
                Matrícula
              </p>
              <p className="mt-1 font-mono text-sm text-foreground">{enrollmentId}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-500 uppercase">
                Código único
              </p>
              <p className="mt-1 font-mono text-sm text-violet-300">{ticket.code}</p>
            </div>
          </div>
        </div>

        {/* Right — validação */}
        <div className="relative flex flex-col items-center justify-center border-t border-dashed border-border/10 bg-bg-gray px-5 py-6 lg:w-[28%] lg:shrink-0 lg:border-t-0 lg:border-l lg:px-4 lg:py-8">
          <div className="rounded-xl bg-bg-dark/80 p-3">
            <QRCode
              value={ticket.code}
              size={108}
              fgColor="#3B82F6"
              bgColor="transparent"
              style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
            />
          </div>

          <div className="mt-4 w-full max-w-[140px]">
            <TicketBarcode code={ticket.code} />
          </div>

          <p className="mt-3 font-mono text-xs tracking-[0.25em] text-slate-500 uppercase">
            {shortCode}
          </p>
        </div>
      </div>
    </motion.article>
  )
}
