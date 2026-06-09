import type { EventFilters } from '@/types'

export function filtersToSearchParams(filters: EventFilters): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.search) params.set('search', filters.search)
  if (filters.category) params.set('category', filters.category)
  if (filters.faculdadeId) params.set('faculdade', filters.faculdadeId)
  if (filters.atleticaId) params.set('atletica', filters.atleticaId)
  if (filters.cidade) params.set('cidade', filters.cidade)
  if (filters.estado) params.set('estado', filters.estado)
  if (filters.dateFrom) params.set('de', filters.dateFrom)
  if (filters.dateTo) params.set('ate', filters.dateTo)
  if (filters.priceMin !== undefined) params.set('precoMin', String(filters.priceMin))
  if (filters.priceMax !== undefined) params.set('precoMax', String(filters.priceMax))
  return params
}

export function searchParamsToFilters(params: URLSearchParams): EventFilters {
  const priceMin = params.get('precoMin')
  const priceMax = params.get('precoMax')
  return {
    search: params.get('search') ?? undefined,
    category: params.get('category') ?? undefined,
    faculdadeId: params.get('faculdade') ?? undefined,
    atleticaId: params.get('atletica') ?? undefined,
    cidade: params.get('cidade') ?? undefined,
    estado: params.get('estado') ?? undefined,
    dateFrom: params.get('de') ?? undefined,
    dateTo: params.get('ate') ?? undefined,
    priceMin: priceMin ? Number(priceMin) : undefined,
    priceMax: priceMax ? Number(priceMax) : undefined,
  }
}
