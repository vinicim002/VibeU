import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { fetchEvents } from '@/api/mockApi'
import { HeroSection } from '@/components/common/HeroSection'
import { MarqueeTicker } from '@/components/common/MarqueeTicker'
import { EventCard } from '@/components/event/EventCard'
import { LoadingState } from '@/components/ui/LoadingState'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'

const categories = [
  { label: 'Festas', emoji: '🎉', value: 'FESTA' },
  { label: 'Shows', emoji: '🎸', value: 'SHOW' },
  { label: 'Esportivo', emoji: '⚽', value: 'ESPORTIVO' },
  { label: 'Acadêmico', emoji: '📚', value: 'ACADEMICO' },
  { label: 'Recepção', emoji: '🎓', value: 'RECEPCAO' },
]

export function HomePage() {
  const { data: events, isLoading } = useQuery({
    queryKey: ['events', 'featured'],
    queryFn: () => fetchEvents(),
  })

  const featured = events?.slice(0, 4) ?? []

  return (
    <>
      <HeroSection />
      <MarqueeTicker text="VIBEU — EVENTOS UNIVERSITÁRIOS" />

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-accent uppercase">
              Destaques
            </p>
            <h2 className="font-display text-5xl tracking-wider text-white md:text-6xl">
              PRÓXIMOS EVENTOS
            </h2>
          </div>
          <Link to={ROUTES.EVENTS}>
            <Button variant="ghost">Ver todos</Button>
          </Link>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            {featured.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        )}
      </section>

      <section id="categorias" className="border-y border-white/5 bg-bg-slate py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-5xl tracking-wider text-white md:text-6xl">
            EXPLORE POR CATEGORIA
          </h2>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.value}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`${ROUTES.EVENTS}?category=${cat.value}`}
                  className="group flex flex-col items-center rounded-2xl border border-white/10 bg-bg-gray/50 p-8 text-center transition hover:border-primary hover:glow-purple"
                >
                  <span className="text-4xl">{cat.emoji}</span>
                  <span className="mt-4 font-heading text-sm font-bold uppercase tracking-wider text-white group-hover:text-accent">
                    {cat.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <h2 className="font-display text-5xl tracking-wider text-white md:text-6xl">
          COMO FUNCIONA
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            {
              step: '01',
              title: 'Descubra',
              desc: 'Navegue pelos eventos do campus e encontre sua vibe.',
            },
            {
              step: '02',
              title: 'Inscreva-se',
              desc: 'Escolha o lote, confirme e pague de forma simulada.',
            },
            {
              step: '03',
              title: 'Entre',
              desc: 'Receba seu ingresso digital com QR Code único.',
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="rounded-2xl border border-white/10 bg-gradient-to-br from-primary/10 to-transparent p-8"
            >
              <span className="font-display text-5xl text-primary/40">{item.step}</span>
              <h3 className="mt-4 font-heading text-xl font-bold uppercase text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-text-muted">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  )
}
