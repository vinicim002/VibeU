export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr))
}

export function formatDateLong(dateStr: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr))
}

export function formatDay(dateStr: string): string {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit' }).format(
    new Date(dateStr),
  )
}

export function formatMonthYear(dateStr: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'short',
    year: '2-digit',
  })
    .format(new Date(dateStr))
    .toUpperCase()
}

export function formatTime(time: string): string {
  return time.slice(0, 5)
}

export function getAvailableSpots(capacity: number, sold: number): number {
  return Math.max(0, capacity - sold)
}
