import { motion } from 'framer-motion'

interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 px-8 py-16 text-center"
    >
      <div className="mb-4 text-5xl opacity-30">🎫</div>
      <h3 className="font-heading text-xl font-semibold uppercase tracking-wide text-white">
        {title}
      </h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-text-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </motion.div>
  )
}
