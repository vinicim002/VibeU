import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg"
      >
        <p className="font-display text-8xl tracking-wider text-primary/30 sm:text-9xl">404</p>
        <h1 className="mt-4 font-display text-4xl tracking-wider text-foreground sm:text-5xl">
          PÁGINA NÃO ENCONTRADA
        </h1>
        <p className="mt-4 text-text-muted">
          Essa rota não existe ou foi movida. Volte para a vitrine de eventos do VibeU.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to={ROUTES.HOME}>
            <Button variant="primary">Ir para Home</Button>
          </Link>
          <Link to={ROUTES.EVENTS}>
            <Button variant="ghost">Ver eventos</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
