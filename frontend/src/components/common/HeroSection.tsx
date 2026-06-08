import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { EVENT_CATEGORIES } from '@/constants/categories'
import { ROUTES } from '@/constants/routes'

const heroImages = [
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1600&q=80',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600&q=80',
  'https://images.unsplash.com/photo-1459745429338-5bb593979672?w=1600&q=80',
]

const discoveryPills = EVENT_CATEGORIES.slice(0, 5)

export function HeroSection() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImages[0]} alt="" className="h-full w-full object-cover" />
        <div className="gradient-overlay absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-secondary/20" />
      </div>

      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[12vw] whitespace-nowrap text-foreground/[0.04] select-none"
      >
        VIBEU FESTIVAL
      </span>

      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 py-32 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="mb-4 text-xs font-bold tracking-[0.4em] text-accent-yellow uppercase">
            Sua universidade, sua vibe
          </p>
          <h1 className="font-display text-6xl leading-[0.9] text-on-media text-glow-purple sm:text-7xl md:text-8xl lg:text-9xl">
            FEEL THE
            <br />
            <span className="text-accent text-glow-pink">VIBE</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-on-media/80">
            A vitrine premium dos eventos universitários do Brasil. Festas, interAtléticas,
            open bar e recepções — tudo em um só lugar.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link to={ROUTES.EVENTS}>
              <Button variant="ticket" size="lg">
                Ver eventos
              </Button>
            </Link>
            <Link to={ROUTES.REGISTER}>
              <Button variant="ghost" size="lg">
                Criar conta
              </Button>
            </Link>
          </div>

          <div className="mt-10">
            <p className="text-xs font-bold tracking-[0.25em] text-text-muted uppercase">
              Descubra por categoria
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {discoveryPills.map((cat, i) => (
                <motion.div
                  key={cat.value}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                >
                  <Link
                    to={`${ROUTES.EVENTS}?category=${cat.value}`}
                    className="inline-block rounded-full border border-on-media/20 bg-on-media/10 px-4 py-2 text-xs font-semibold text-on-media backdrop-blur-sm transition hover:border-accent/50 hover:bg-accent/20 hover:text-accent-yellow"
                  >
                    {cat.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="relative overflow-hidden rounded-2xl border border-border/10 shadow-2xl glow-purple">
            <img
              src={heroImages[1]}
              alt="Evento universitário"
              className="aspect-[4/5] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute -top-6 -right-6 rounded-2xl border border-border/10 bg-bg-gray/90 p-4 backdrop-blur-xl"
          >
            <p className="font-display text-3xl text-accent-yellow">500+</p>
            <p className="text-xs text-text-muted uppercase">Eventos ativos</p>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 5, delay: 1 }}
            className="absolute -bottom-4 -left-6 rounded-2xl border border-border/10 bg-white p-4 text-black"
          >
            <p className="font-display text-3xl text-primary">12k+</p>
            <p className="text-xs text-black/60 uppercase">Ingressos emitidos</p>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute right-0 bottom-8 left-0 mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-8 px-4 text-center text-xs tracking-widest text-text-muted uppercase sm:justify-between sm:text-left">
        <span>Music Festival</span>
        <span>Campus Central — São Paulo</span>
        <span>2026 Season</span>
      </div>
    </section>
  )
}
