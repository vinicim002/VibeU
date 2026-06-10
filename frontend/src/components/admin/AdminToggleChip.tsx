interface AdminToggleChipProps {
  active: boolean
  activeLabel: string
  inactiveLabel: string
  onClick: () => void
  activeClass?: string
}

export function AdminToggleChip({
  active,
  activeLabel,
  inactiveLabel,
  onClick,
  activeClass = 'border-accent/40 bg-accent/15 text-accent',
}: AdminToggleChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition sm:text-xs ${
        active
          ? activeClass
          : 'border-border/15 bg-surface/5 text-text-muted hover:border-border/30 hover:text-foreground'
      }`}
    >
      {active ? activeLabel : inactiveLabel}
    </button>
  )
}
