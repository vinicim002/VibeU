import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { fetchEvents } from '@/api/mockApi'
import { EventRow } from '@/components/event/EventRow'
import { MarqueeTicker } from '@/components/common/MarqueeTicker'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { LoadingState } from '@/components/ui/LoadingState'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'

const categoryOptions = [
  { value: '', label: 'Todas categorias' },
  { value: 'FESTA', label: 'Festa' },
  { value: 'SHOW', label: 'Show' },
  { value: 'ESPORTIVO', label: 'Esportivo' },
  { value: 'ACADEMICO', label: 'Acadêmico' },
  { value: 'RECEPCAO', label: 'Recepção' },
]

export function EventsPage() {
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(searchParams.get('category') ?? '')
  const [sort, setSort] = useState('date')

  const { data: events, isLoading, isError, refetch } = useQuery({
    queryKey: ['events', category, search],
    queryFn: () => fetchEvents({ category: category || undefined, search: search || undefined }),
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
    }
    return copy
  }, [events, sort])

  return (
    <>
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1459745429338-5bb593979672?w=1600&q=80"
            alt=""
            className="h-full w-full object-cover opacity-30"
          />
          <div className="gradient-overlay absolute inset-0" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-7xl tracking-wider text-white md:text-9xl"
            style={{ textShadow: '2px 0 #ec4899, -2px 0 #3b82f6' }}
          >
            EVENTOS
          </motion.h1>
          <p className="mt-4 text-lg text-text-muted italic">
            VibeU — eventos universitários premium
          </p>
        </div>
      </section>

      <MarqueeTicker />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-4 rounded-2xl border border-white/10 bg-bg-gray/50 p-4 md:grid-cols-3">
          <Input
            placeholder="Buscar eventos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            options={categoryOptions}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <Select
            options={[
              { value: 'date', label: 'Mais recentes' },
              { value: 'name', label: 'Nome A-Z' },
              { value: 'price', label: 'Menor preço' },
            ]}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          />
        </div>

        {isLoading ? (
          <LoadingState message="Carregando eventos..." />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : sortedEvents.length === 0 ? (
          <EmptyState
            title="Nenhum evento encontrado"
            description="Tente ajustar os filtros ou volte mais tarde."
          />
        ) : (
          <div>
            {sortedEvents.map((event, i) => (
              <EventRow key={event.id} event={event} index={i} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
