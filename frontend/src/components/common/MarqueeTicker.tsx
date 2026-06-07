interface MarqueeTickerProps {
  text?: string
}

export function MarqueeTicker({ text = 'EVENTOS UNIVERSITÁRIOS' }: MarqueeTickerProps) {
  const content = Array(8).fill(text).join(' ★ ')

  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-bg-gray py-3">
      <div className="-rotate-1 transform bg-primary/20 py-2">
        <div className="marquee-track flex whitespace-nowrap">
          <span className="px-4 font-display text-lg tracking-[0.3em] text-white md:text-xl">
            {content}
          </span>
          <span className="px-4 font-display text-lg tracking-[0.3em] text-white md:text-xl" aria-hidden>
            {content}
          </span>
        </div>
      </div>
    </div>
  )
}
