import { useCallback, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { fetchEvents } from '@/api/mockApi'
import { EventCard } from '@/components/event/EventCard'
import { EventCardSkeleton } from '@/components/ui/EventCardSkeleton'
import { EventFiltersBar } from '@/components/event/EventFiltersBar'
import { EventSpotlight } from '@/components/event/EventSpotlight'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { filtersToSearchParams, searchParamsToFilters } from '@/utils/eventFilters'
import type { EventFilters } from '@/types'

const SORT_OPTIONS = [
  { value: 'date', label: 'Mais próximos' },
  { value: 'popular', label: 'Populares' },
  { value: 'price', label: 'Menor preço' },
  { value: 'name', label: 'A — Z' },
] as const

type SortValue = (typeof SORT_OPTIONS)[number]['value']

export function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [sort, setSort] = useState<SortValue>('date')
  const [filters, setFilters] = useState<EventFilters>(() => searchParamsToFilters(searchParams))

  const handleFilters = useCallback(
    (f: EventFilters) => {
      setFilters(f)
      setSearchParams(filtersToSearchParams(f), { replace: true })
    },
    [setSearchParams],
  )

  const { data: events, isLoading, isError, refetch } = useQuery({
    queryKey: ['events', filters],
    queryFn: () => fetchEvents(filters),
  })

  const sortedEvents = useMemo(() => {
    if (!events) return []
    const copy = [...events]
    if (sort === 'name') copy.sort((a, b) => a.name.localeCompare(b.name))
    else if (sort === 'price') {
      copy.sort((a, b) => {
        const minA = Math.min(...a.lots.map((l) => l.price))
        const minB = Math.min(...b.lots.map((l) => l.price))
        return minA - minB
      })
    } else if (sort === 'popular') {
      copy.sort((a, b) => b.popularityScore - a.popularityScore)
    }
    return copy
  }, [events, sort])

  const spotlightEvent = sortedEvents.find((e) => e.featured) ?? sortedEvents[0]
  const gridEvents = spotlightEvent
    ? sortedEvents.filter((e) => e.id !== spotlightEvent.id)
    : sortedEvents

  return (
    <>
      <section className="relative flex min-h-[45vh] items-end overflow-hidden sm:min-h-[50vh]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1459745429338-5bb593979672?w=1600&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="gradient-overlay absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 pt-28 pb-14 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs font-bold tracking-[0.4em] text-accent-yellow uppercase">
              Agenda completa
            </p>
            <h1 className="mt-2 font-display text-6xl tracking-wider text-on-media sm:text-7xl lg:text-8xl">
              EVENTOS
            </h1>
            <p className="mt-4 max-w-lg text-base text-on-media/80 sm:text-lg">
              Festas, shows, interAtléticas e recepções de todo o Brasil. Encontre o seu rolê.
            </p>
            {!isLoading && events ? (
              <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-on-media/20 bg-on-media/10 px-4 py-2 text-sm text-on-media backdrop-blur-sm">
                <span className="h-2 w-2 animate-pulse rounded-full bg-accent-yellow" />
                {events.length} evento{events.length !== 1 ? 's' : ''} disponíve
                {events.length !== 1 ? 'is' : 'l'}
              </p>
            ) : null}
          </motion.div>
        </div>
      </section>

      <div className="sticky top-16 z-30 border-b border-border/10 bg-bg-dark/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <EventFiltersBar onChange={handleFilters} />
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : sortedEvents.length === 0 ? (
          <EmptyState
            title="Nenhum evento encontrado"
            description="Tente ajustar os filtros ou explore outras categorias."
          />
        ) : (
          <>
            {spotlightEvent ? <EventSpotlight event={spotlightEvent} /> : null}

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-heading text-lg font-bold uppercase tracking-wider text-foreground">
                  {gridEvents.length > 0 ? 'Todos os eventos' : 'Evento em destaque'}
                </h2>
                <p className="mt-1 text-sm text-text-muted">
                  {sortedEvents.length} resultado{sortedEvents.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSort(opt.value)}
                    className={`rounded-full px-4 py-2 text-xs font-bold tracking-wide uppercase transition ${
                      sort === opt.value
                        ? 'bg-foreground text-bg-slate'
                        : 'border border-border/10 bg-surface/5 text-text-muted hover:border-border/25 hover:text-foreground'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {gridEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 xl:grid-cols-3">
                {gridEvents.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} layout="stacked" />
                ))}
              </div>
            ) : null}
          </>
        )}
      </section>
    </>
  )
}
