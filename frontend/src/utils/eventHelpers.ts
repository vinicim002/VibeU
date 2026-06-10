import type { Event } from '@/types'

export function getEventSoldCount(event: Event): number {
  return event.lots.reduce((acc, lot) => acc + lot.sold, 0)
}

export function getEventMinPrice(event: Event): number {
  const prices = event.lots.map((l) => l.price)
  return prices.length ? Math.min(...prices) : 0
}

export function getAvailableLotSpots(lot: Event['lots'][0]): number {
  return Math.max(0, lot.quantity - lot.sold)
}
