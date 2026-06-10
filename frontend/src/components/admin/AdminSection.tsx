import type { ReactNode } from 'react'

interface AdminSectionProps {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function AdminSection({
  title,
  description,
  action,
  children,
  className = '',
}: AdminSectionProps) {
  return (
    <section className={className}>
      <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground sm:text-base">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 max-w-2xl text-xs text-text-muted sm:text-sm">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  )
}
