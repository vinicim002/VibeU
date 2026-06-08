import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { EVENT_CATEGORIES } from '@/constants/categories'
import { ROUTES } from '@/constants/routes'

export function CategoryShowcase() {
  return (
    <section id="categorias" className="border-y border-border/5 bg-bg-slate py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 max-w-2xl md:mb-14"
        >
          <p className="text-xs font-bold tracking-[0.3em] text-accent uppercase">Explore</p>
          <h2 className="mt-1 font-display text-4xl tracking-wider text-foreground md:text-6xl">
            ENCONTRE SUA VIBE
          </h2>
          <p className="mt-4 text-sm text-text-muted md:text-base">
            Festas, open bar, jogos universitários, workshops e muito mais — do campus ao Brasil
            inteiro.
          </p>
        </motion.div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
          {EVENT_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.value}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: Math.min(i * 0.04, 0.4) }}
            >
              <Link
                to={`${ROUTES.EVENTS}?category=${cat.value}`}
                className="group relative flex h-44 overflow-hidden rounded-2xl border border-border/10 transition duration-300 hover:scale-[1.02] hover:border-primary/50 hover:shadow-[0_0_36px_rgba(109,40,217,0.2)] sm:h-52 md:h-56"
              >
                <motion.img
                  src={cat.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.6 }}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${cat.gradient} to-black/90`}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 transition duration-300 group-hover:opacity-100" />
                <div className="relative flex h-full flex-col justify-end p-4 sm:p-5">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-on-media transition group-hover:text-accent-yellow sm:text-sm">
                    {cat.label}
                  </h3>
                  <p className="mt-1 hidden text-xs text-on-media/70 line-clamp-2 sm:block">
                    {cat.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
