export function EventCardSkeleton() {
  return (
    <div className="theme-card animate-pulse overflow-hidden rounded-2xl border border-border/10 bg-bg-gray">
      <div className="aspect-[16/10] bg-surface/10 sm:aspect-[5/3]" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-3/4 rounded-lg bg-surface/10" />
        <div className="h-4 w-1/2 rounded-lg bg-surface/10" />
        <div className="h-4 w-2/3 rounded-lg bg-surface/10" />
        <div className="flex justify-between pt-2">
          <div className="h-8 w-24 rounded-full bg-surface/10" />
          <div className="h-10 w-32 rounded-full bg-surface/10" />
        </div>
      </div>
    </div>
  )
}
