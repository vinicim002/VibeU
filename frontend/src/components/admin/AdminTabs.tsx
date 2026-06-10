interface AdminTab {
  id: string
  label: string
  count?: number
}

interface AdminTabsProps {
  tabs: AdminTab[]
  active: string
  onChange: (id: string) => void
}

export function AdminTabs({ tabs, active, onChange }: AdminTabsProps) {
  return (
    <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="inline-flex min-w-full gap-1 rounded-2xl border border-border/10 bg-bg-slate/60 p-1 sm:min-w-0 sm:w-fit">
        {tabs.map((tab) => {
          const isActive = tab.id === active
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`shrink-0 rounded-xl px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition sm:px-4 sm:text-xs ${
                isActive
                  ? 'bg-primary text-white shadow-[0_0_20px_rgba(109,40,217,0.35)]'
                  : 'text-text-muted hover:bg-surface/5 hover:text-foreground'
              }`}
            >
              {tab.label}
              {tab.count !== undefined ? (
                <span
                  className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${
                    isActive ? 'bg-white/20' : 'bg-surface/10'
                  }`}
                >
                  {tab.count}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
