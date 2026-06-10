import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { fetchEvents } from '@/api'
import { HeroSection } from '@/components/common/HeroSection'
import { MarqueeTicker } from '@/components/common/MarqueeTicker'
import { EventCard } from '@/components/event/EventCard'
import { AtleticaCommunity } from '@/components/home/AtleticaCommunity'
import { CategoryShowcase } from '@/components/home/CategoryShowcase'
import { UniversityShowcase } from '@/components/home/UniversityShowcase'
import { LoadingState } from '@/components/ui/LoadingState'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'

export function HomePage() {
  const { data: events, isLoading } = useQuery({
    queryKey: ['events', 'home'],
    queryFn: () => fetchEvents(),
  })

  const featured = events?.filter((e) => e.featured).slice(0, 4) ?? []
  const markedPopular = events?.filter((e) => e.popular) ?? []
  const popular =
    markedPopular.length > 0
      ? markedPopular.slice(0, 3)
      : [...(events ?? [])].sort((a, b) => b.popularityScore - a.popularityScore).slice(0, 3)
  const upcoming = events?.slice(0, 4) ?? []

  return (
    <>
      <HeroSection />
      <MarqueeTicker text="VIBEU — EVENTOS UNIVERSITÁRIOS EM TODO O BRASIL" />

      {featured.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] text-accent-yellow uppercase">
                Acontecendo agora
              </p>
              <h2 className="font-display text-4xl tracking-wider text-foreground md:text-5xl">
                EM DESTAQUE
              </h2>
            </div>
            <Link to={ROUTES.EVENTS}>
              <Button variant="ghost">Ver agenda completa</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 xl:grid-cols-3">
            {featured.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} layout="stacked" />
            ))}
          </div>
        </section>
      ) : null}

      <UniversityShowcase />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-accent uppercase">Trending</p>
            <h2 className="font-display text-4xl tracking-wider text-foreground md:text-5xl">
              MAIS POPULARES
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              Os eventos com maior movimentação na plataforma.
            </p>
          </div>
        </div>
        {isLoading ? (
          <LoadingState />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 xl:grid-cols-3">
            {popular.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} layout="stacked" />
            ))}
          </div>
        )}
      </section>

      <AtleticaCommunity />
      <CategoryShowcase />

      <section className="border-y border-border/5 bg-bg-slate py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] text-secondary uppercase">Agenda</p>
              <h2 className="font-display text-4xl tracking-wider text-foreground md:text-5xl">
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 xl:grid-cols-3">
              {upcoming.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} layout="stacked" />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-secondary/20" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl tracking-wider text-foreground md:text-6xl">
              SUA UNIVERSIDADE, SUA VIBE
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              Cadastre-se e garanta ingressos para festas, interAtléticas, recepções e muito mais.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to={ROUTES.REGISTER}>
                <Button variant="ticket" size="lg">
                  Criar conta grátis
                </Button>
              </Link>
              <Link to={ROUTES.EVENTS}>
                <Button variant="ghost" size="lg">
                  Explorar eventos
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="como-funciona" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <h2 className="font-display text-4xl tracking-wider text-foreground md:text-5xl">
          COMO FUNCIONA
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            {
              step: '01',
              title: 'Descubra',
              desc: 'Navegue por universidades, atléticas e categorias na vitrine do VibeU.',
            },
            {
              step: '02',
              title: 'Inscreva-se',
              desc: 'Escolha o lote e confirme sua participação em segundos.',
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
              className="rounded-2xl border border-border/10 bg-gradient-to-br from-primary/10 to-transparent p-8"
            >
              <span className="font-display text-5xl text-primary/40">{item.step}</span>
              <h3 className="mt-4 font-heading text-xl font-bold uppercase text-foreground">
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
