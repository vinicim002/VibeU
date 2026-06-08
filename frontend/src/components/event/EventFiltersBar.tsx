import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { fetchAtleticas, fetchFaculdades, fetchFilterMeta } from '@/api/mockApi'
import { EVENT_CATEGORIES } from '@/constants/categories'
import type { EventFilters } from '@/types'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

interface EventFiltersBarProps {
  onChange: (filters: EventFilters) => void
}

interface ActiveChip {
  key: string
  label: string
  clear: () => void
}

export function EventFiltersBar({ onChange }: EventFiltersBarProps) {
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(() => searchParams.get('search') ?? '')
  const [category, setCategory] = useState(() => searchParams.get('category') ?? '')
  const [faculdadeId, setFaculdadeId] = useState(() => searchParams.get('faculdade') ?? '')
  const [atleticaId, setAtleticaId] = useState(() => searchParams.get('atletica') ?? '')
  const [cidade, setCidade] = useState(() => searchParams.get('cidade') ?? '')
  const [estado, setEstado] = useState(() => searchParams.get('estado') ?? '')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [advancedOpen, setAdvancedOpen] = useState(false)

  const { data: faculdades = [] } = useQuery({
    queryKey: ['faculdades'],
    queryFn: fetchFaculdades,
  })

  const { data: atleticas = [] } = useQuery({
    queryKey: ['atleticas', faculdadeId],
    queryFn: () => fetchAtleticas(faculdadeId || undefined),
  })

  const { data: meta } = useQuery({
    queryKey: ['filter-meta'],
    queryFn: fetchFilterMeta,
  })

  useEffect(() => {
    onChange({
      search: search || undefined,
      category: category || undefined,
      faculdadeId: faculdadeId || undefined,
      atleticaId: atleticaId || undefined,
      cidade: cidade || undefined,
      estado: estado || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      priceMin: priceMin ? Number(priceMin) : undefined,
      priceMax: priceMax ? Number(priceMax) : undefined,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps -- onChange intentionally omitted
  }, [search, category, faculdadeId, atleticaId, cidade, estado, dateFrom, dateTo, priceMin, priceMax])

  const clearFilters = () => {
    setSearch('')
    setCategory('')
    setFaculdadeId('')
    setAtleticaId('')
    setCidade('')
    setEstado('')
    setDateFrom('')
    setDateTo('')
    setPriceMin('')
    setPriceMax('')
  }

  const activeChips = useMemo((): ActiveChip[] => {
    const chips: ActiveChip[] = []
    if (search) chips.push({ key: 'search', label: `"${search}"`, clear: () => setSearch('') })
    if (category) {
      const cat = EVENT_CATEGORIES.find((c) => c.value === category)
      chips.push({ key: 'category', label: cat?.label ?? category, clear: () => setCategory('') })
    }
    if (faculdadeId) {
      const fac = faculdades.find((f) => f.id === faculdadeId)
      chips.push({ key: 'faculdade', label: fac?.sigla ?? 'Faculdade', clear: () => setFaculdadeId('') })
    }
    if (atleticaId) {
      const atl = atleticas.find((a) => a.id === atleticaId)
      chips.push({ key: 'atletica', label: atl?.sigla ?? 'Atlética', clear: () => setAtleticaId('') })
    }
    if (estado) chips.push({ key: 'estado', label: estado, clear: () => setEstado('') })
    if (cidade) chips.push({ key: 'cidade', label: cidade, clear: () => setCidade('') })
    if (dateFrom) chips.push({ key: 'dateFrom', label: `De ${dateFrom}`, clear: () => setDateFrom('') })
    if (dateTo) chips.push({ key: 'dateTo', label: `Até ${dateTo}`, clear: () => setDateTo('') })
    if (priceMin) chips.push({ key: 'priceMin', label: `Mín. R$${priceMin}`, clear: () => setPriceMin('') })
    if (priceMax) chips.push({ key: 'priceMax', label: `Máx. R$${priceMax}`, clear: () => setPriceMax('') })
    return chips
  }, [search, category, faculdadeId, atleticaId, estado, cidade, dateFrom, dateTo, priceMin, priceMax, faculdades, atleticas])

  const hasActiveFilters = activeChips.length > 0

  return (
    <div className="space-y-4">
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-text-muted">
          ⌕
        </span>
        <input
          type="search"
          placeholder="Buscar eventos, universidades, atléticas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-border/10 bg-surface/5 py-4 pr-4 pl-11 text-sm text-foreground outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={() => setCategory('')}
          className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold tracking-wide uppercase transition ${
            !category
              ? 'bg-accent-yellow text-black'
              : 'border border-border/10 bg-surface/5 text-text-secondary hover:border-border/25 hover:text-foreground'
          }`}
        >
          Todos
        </button>
        {EVENT_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setCategory(category === cat.value ? '' : cat.value)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold tracking-wide uppercase transition ${
              category === cat.value
                ? 'bg-primary text-white shadow-[0_0_20px_rgba(109,40,217,0.4)]'
                : 'border border-border/10 bg-surface/5 text-text-secondary hover:border-primary/40 hover:text-foreground'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setAdvancedOpen((o) => !o)}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold tracking-wide uppercase transition ${
            advancedOpen || hasActiveFilters
              ? 'border-secondary/50 bg-secondary/10 text-secondary'
              : 'border-border/10 bg-surface/5 text-text-muted hover:text-foreground'
          }`}
        >
          <span>Filtros</span>
          {hasActiveFilters ? (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] text-black">
              {activeChips.length}
            </span>
          ) : null}
        </button>

        {hasActiveFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-semibold text-text-muted transition hover:text-accent"
          >
            Limpar tudo
          </button>
        ) : null}
      </div>

      <AnimatePresence>
        {advancedOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="grid gap-3 rounded-2xl border border-border/10 bg-bg-gray/40 p-4 sm:grid-cols-2 lg:grid-cols-4">
              <Select
                options={[
                  { value: '', label: 'Todas faculdades' },
                  ...faculdades.map((f) => ({ value: f.id, label: `${f.sigla} — ${f.cidade}` })),
                ]}
                value={faculdadeId}
                onChange={(e) => {
                  setFaculdadeId(e.target.value)
                  setAtleticaId('')
                }}
              />
              <Select
                options={[
                  { value: '', label: 'Todas atléticas' },
                  ...atleticas.map((a) => ({ value: a.id, label: a.sigla })),
                ]}
                value={atleticaId}
                onChange={(e) => setAtleticaId(e.target.value)}
              />
              <Select
                options={[
                  { value: '', label: 'Todos estados' },
                  ...(meta?.estados ?? []).map((uf) => ({ value: uf, label: uf })),
                ]}
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              />
              <Select
                options={[
                  { value: '', label: 'Todas cidades' },
                  ...(meta?.cidades ?? []).map((c) => ({ value: c, label: c })),
                ]}
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              />
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              <Input type="number" min="0" placeholder="Preço mín." value={priceMin} onChange={(e) => setPriceMin(e.target.value)} />
              <Input type="number" min="0" placeholder="Preço máx." value={priceMax} onChange={(e) => setPriceMax(e.target.value)} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {activeChips.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.clear}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/15 bg-surface/5 px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-accent/50 hover:bg-accent/10"
            >
              {chip.label}
              <span className="text-text-muted">×</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
