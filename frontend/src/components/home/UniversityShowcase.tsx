import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { fetchFaculdadesWithStats } from '@/api'
import { ROUTES } from '@/constants/routes'

const CARD_GRADIENTS = [
  'from-primary/90 via-primary/40 to-black/80',
  'from-secondary/90 via-secondary/40 to-black/80',
  'from-accent/80 via-primary/50 to-black/80',
  'from-violet-700/90 via-primary/40 to-black/80',
  'from-cyan-700/80 via-secondary/30 to-black/80',
]

export function UniversityShowcase() {
  const { data: faculdades = [] } = useQuery({
    queryKey: ['faculdades-stats'],
    queryFn: fetchFaculdadesWithStats,
  })

  if (faculdades.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.3em] text-secondary uppercase">
            Universidades
          </p>
          <h2 className="font-display text-4xl tracking-wider text-foreground md:text-5xl">
            NO CAMPUS, NA PLATAFORMA
          </h2>
          <p className="mt-3 max-w-xl text-sm text-text-muted">
            Instituições com eventos ativos no VibeU. Escolha sua universidade e mergulhe na agenda.
          </p>
        </div>
        <Link
          to={ROUTES.EVENTS}
          className="text-sm font-semibold text-accent-yellow transition hover:text-foreground"
        >
          Ver todos os eventos →
        </Link>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-3 lg:overflow-visible xl:grid-cols-5">
        {faculdades.map((fac, i) => {
          const gradient = CARD_GRADIENTS[i % CARD_GRADIENTS.length]

          return (
            <motion.div
              key={fac.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="w-[min(280px,78vw)] shrink-0 lg:w-auto"
            >
              <Link
                to={ROUTES.FACULDADE_DETAIL.replace(':id', fac.id)}
                className="group relative flex h-72 flex-col justify-between overflow-hidden rounded-2xl border border-border/10 p-6 transition duration-300 hover:scale-[1.03] hover:border-secondary/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.2)]"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${gradient} transition duration-500 group-hover:scale-105`}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.12),transparent_50%)]" />

                <div className="relative flex items-start justify-between">
                  <img
                    src={fac.logo}
                    alt=""
                    className="h-14 w-14 rounded-2xl border border-border/20 bg-surface/10 object-cover shadow-lg"
                  />
                  {fac.featured ? (
                    <span className="rounded-full bg-accent-yellow/20 px-2.5 py-1 text-[10px] font-bold tracking-wider text-accent-yellow uppercase">
                      Em alta
                    </span>
                  ) : null}
                </div>

                <div className="relative">
                  <p className="font-display text-4xl tracking-wider text-on-media">
                    {fac.sigla}
                  </p>
                  <p className="mt-1 text-sm font-medium text-on-media/90 line-clamp-2">
                    {fac.nome}
                  </p>
                  <p className="mt-2 text-xs text-on-media/60">
                    {fac.cidade}, {fac.estado}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="rounded-full bg-on-media/15 px-3 py-1 text-xs font-bold text-on-media backdrop-blur-sm">
                      {fac.activeEventCount}{' '}
                      {fac.activeEventCount === 1 ? 'evento ativo' : 'eventos ativos'}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
