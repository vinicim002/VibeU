import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'

interface AdminStatCardProps {
  label: string
  value: string | number
  accent?: string
  icon?: React.ReactNode
  delay?: number
}

export function AdminStatCard({ label, value, accent = 'text-foreground', icon, delay = 0 }: AdminStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="relative overflow-hidden p-4 sm:p-5" glow hover={false}>
        <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-primary/10 blur-2xl" />
        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted sm:text-xs">
              {label}
            </p>
            <p className={`mt-1.5 truncate font-display text-2xl sm:text-3xl ${accent}`}>
              {value}
            </p>
          </div>
          {icon ? (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/10 bg-surface/10 text-text-muted sm:h-10 sm:w-10">
              {icon}
            </div>
          ) : null}
        </div>
      </Card>
    </motion.div>
  )
}
