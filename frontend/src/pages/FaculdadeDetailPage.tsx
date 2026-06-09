import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { fetchEvents, fetchFaculdadeById } from '@/api/mockApi'
import { EventCard } from '@/components/event/EventCard'
import { EventCardSkeleton } from '@/components/ui/EventCardSkeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'

export function FaculdadeDetailPage() {
  const { id } = useParams<{ id: string }>()

  const { data: faculdade, isError: facError, refetch } = useQuery({
    queryKey: ['faculdade', id],
    queryFn: () => fetchFaculdadeById(id!),
    enabled: !!id,
  })

  const { data: events, isLoading } = useQuery({
    queryKey: ['events', 'faculdade', id],
    queryFn: () => fetchEvents({ faculdadeId: id }),
    enabled: !!id,
  })

  if (facError || (!faculdade && !isLoading)) {
    return (
      <ErrorState
        message="Universidade não encontrada."
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <>
      <section className="border-b border-border/10 bg-bg-slate py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:flex-row sm:text-left lg:px-8">
          {faculdade ? (
            <>
              <img src={faculdade.logo} alt="" className="h-24 w-24 rounded-2xl border border-border/10" />
              <div>
                <p className="text-xs font-bold tracking-[0.3em] text-secondary uppercase">Universidade</p>
                <h1 className="font-display text-5xl tracking-wider text-foreground">{faculdade.sigla}</h1>
                <p className="mt-2 text-text-muted">{faculdade.nome}</p>
                <p className="text-sm text-text-muted">
                  {faculdade.cidade}, {faculdade.estado}
                </p>
              </div>
            </>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="font-heading text-lg font-bold uppercase tracking-wider text-foreground">
          Eventos desta universidade
        </h2>
        {isLoading ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : events?.length === 0 ? (
          <EmptyState
            title="Nenhum evento"
            description="Esta universidade ainda não possui eventos publicados."
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
          >
            {events?.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} layout="stacked" />
            ))}
          </motion.div>
        )}
      </section>
    </>
  )
}
