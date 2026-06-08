import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { fetchAtleticasWithStats } from '@/api/mockApi'
import { formatDate } from '@/utils/format'
import { ROUTES } from '@/constants/routes'

export function AtleticaCommunity() {
  const { data: atleticas = [] } = useQuery({
    queryKey: ['atleticas-stats'],
    queryFn: fetchAtleticasWithStats,
  })

  if (atleticas.length === 0) return null

  return (
    <section className="border-y border-border/5 bg-bg-gray/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-accent uppercase">
              Comunidade
            </p>
            <h2 className="font-display text-4xl tracking-wider text-foreground md:text-5xl">
              VIBE DAS ATLÉTICAS
            </h2>
            <p className="mt-3 max-w-xl text-sm text-text-muted">
              Quem organiza, quem vibra, quem lota a pista. Acompanhe as atléticas mais ativas
              e os próximos rolês do campus.
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {atleticas.map((atl, i) => (
            <motion.div
              key={atl.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <Link
                to={`${ROUTES.EVENTS}?atletica=${atl.id}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/10 bg-bg-slate p-6 transition duration-300 hover:border-accent/40 hover:shadow-[0_0_32px_rgba(236,72,153,0.15)]"
              >
                <div className="absolute top-0 right-0 h-24 w-24 rounded-bl-[4rem] bg-gradient-to-bl from-accent/20 to-transparent" />

                <div className="relative flex items-start gap-4">
                  <img
                    src={atl.logo}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-2xl border border-border/10 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-base font-bold uppercase tracking-wide text-foreground group-hover:text-accent">
                      {atl.nome}
                    </p>
                    <span className="mt-1 inline-block rounded-full bg-secondary/20 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-secondary uppercase">
                      {atl.faculdadeSigla}
                    </span>
                  </div>
                  <span className="shrink-0 rounded-full border border-border/10 bg-surface/5 px-2.5 py-1 text-xs font-bold text-accent-yellow">
                    {atl.activeEventCount}
                  </span>
                </div>

                <p className="relative mt-4 text-sm text-text-muted line-clamp-2">
                  {atl.descricao}
                </p>

                <div className="relative mt-5 space-y-2 border-t border-border/5 pt-4">
                  {atl.nextEvent ? (
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 text-[10px] font-bold tracking-wider text-accent uppercase">
                        Próximo
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {atl.nextEvent.name}
                        </p>
                        <p className="text-xs text-text-muted">
                          {formatDate(atl.nextEvent.date)}
                        </p>
                      </div>
                    </div>
                  ) : null}
                  {atl.lastEvent && atl.lastEvent.id !== atl.nextEvent?.id ? (
                    <div className="flex items-start gap-2 opacity-70">
                      <span className="mt-0.5 text-[10px] font-bold tracking-wider text-text-muted uppercase">
                        Último
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm text-text-secondary">
                          {atl.lastEvent.name}
                        </p>
                        <p className="text-xs text-text-muted">
                          {formatDate(atl.lastEvent.date)}
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>

                <p className="relative mt-4 text-xs font-semibold text-accent transition group-hover:text-accent-yellow">
                  Ver eventos da atlética →
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
