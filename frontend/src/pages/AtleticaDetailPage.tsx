import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { fetchAtleticaById, fetchEvents, fetchFaculdades } from '@/api/mockApi'
import { EventCard } from '@/components/event/EventCard'
import { EventCardSkeleton } from '@/components/ui/EventCardSkeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'

export function AtleticaDetailPage() {
  const { id } = useParams<{ id: string }>()

  const { data: atletica, isError: atlError, refetch } = useQuery({
    queryKey: ['atletica', id],
    queryFn: () => fetchAtleticaById(id!),
    enabled: !!id,
  })

  const { data: faculdades = [] } = useQuery({
    queryKey: ['faculdades'],
    queryFn: fetchFaculdades,
  })

  const { data: events, isLoading } = useQuery({
    queryKey: ['events', 'atletica', id],
    queryFn: () => fetchEvents({ atleticaId: id }),
    enabled: !!id,
  })

  const faculdade = faculdades.find((f) => f.id === atletica?.faculdadeId)

  if (atlError || (!atletica && !isLoading)) {
    return (
      <ErrorState
        message="Atlética não encontrada."
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <>
      <section className="border-b border-border/10 bg-bg-slate py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:flex-row sm:text-left lg:px-8">
          {atletica ? (
            <>
              <img src={atletica.logo} alt="" className="h-24 w-24 rounded-2xl border border-border/10" />
              <div>
                <p className="text-xs font-bold tracking-[0.3em] text-accent uppercase">Atlética</p>
                <h1 className="font-heading text-3xl font-bold uppercase tracking-wide text-foreground">
                  {atletica.nome}
                </h1>
                {faculdade ? (
                  <p className="mt-2 text-sm text-secondary">{faculdade.sigla} — {faculdade.nome}</p>
                ) : null}
                <p className="mt-2 max-w-xl text-sm text-text-muted">{atletica.descricao}</p>
              </div>
            </>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="font-heading text-lg font-bold uppercase tracking-wider text-foreground">
          Eventos desta atlética
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
            description="Esta atlética ainda não possui eventos publicados."
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
