import { STORAGE_KEYS } from '@/constants/routes'
import type {
  Atletica,
  AtleticaWithStats,
  ChartItem,
  CheckIn,
  DashboardStats,
  EntityStatus,
  Event,
  EventFilters,
  EventWithRelations,
  Faculdade,
  FaculdadeWithStats,
  Inscription,
  Payment,
  SessionUser,
  Ticket,
  User,
} from '@/types'
import { apiRequest, clearAuthToken } from '@/api/client'
import { mapAtletica, mapEvent, mapEventWithRelations, mapFaculdade, type EventDto } from '@/api/mappers'
import { getEventMinPrice, getEventSoldCount, getAvailableLotSpots } from '@/utils/eventHelpers'
import { getItem, setItem } from '@/utils/storage'
import * as mock from '@/api/mockApi'

export { getEventMinPrice, getEventSoldCount, getAvailableLotSpots }

interface LoginResponse {
  token: string
  user: SessionUser
}

interface OrganizerDto {
  id: string
  name: string
  email: string
  status: EntityStatus
  phone?: string
  bio?: string
  createdAt: string
}

interface EventDetailDto {
  event: EventDto
  faculdades: Faculdade[]
  atleticas: Atletica[]
}

function buildEventQuery(filters?: EventFilters): string {
  const params = new URLSearchParams()
  if (filters?.search) params.set('search', filters.search)
  if (filters?.category) params.set('category', filters.category)
  if (filters?.faculdadeId) params.set('faculdadeId', filters.faculdadeId)
  if (filters?.atleticaId) params.set('atleticaId', filters.atleticaId)
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

function eventInputToRequest(data: Record<string, unknown>) {
  return {
    name: data.name,
    description: data.description,
    category: data.category,
    bannerUrl: data.bannerUrl,
    date: data.date,
    time: data.time,
    endTime: data.endTime || null,
    location: data.location,
    address: data.address,
    cidade: data.cidade,
    estado: data.estado,
    capacity: data.capacity,
    faculdadeIds: data.faculdadeIds ?? [],
    atleticaIds: data.atleticaIds ?? [],
    rules: data.rules ?? [],
    lots: (data.lotsInput as Array<{ id?: string; name: string; price: number; quantity: number }> | undefined)?.map(
      (lot) => ({
        id: lot.id,
        name: lot.name,
        price: lot.price,
        quantity: lot.quantity,
      }),
    ) ?? [],
    scheduleItems:
      (data.scheduleInput as Array<{ time: string; title: string; description?: string }> | undefined)?.map(
        (item) => ({
          time: item.time,
          title: item.title,
          description: item.description,
        }),
      ) ?? [],
  }
}

export function getSession(): SessionUser | null {
  return getItem<SessionUser | null>(STORAGE_KEYS.SESSION, null)
}

export function setSession(user: SessionUser | null): void {
  if (user) setItem(STORAGE_KEYS.SESSION, user)
  else localStorage.removeItem(STORAGE_KEYS.SESSION)
}

export async function login(email: string, password: string): Promise<SessionUser> {
  const data = await apiRequest<LoginResponse>(
    '/api/v1/auth/login',
    { method: 'POST', body: JSON.stringify({ email, password }) },
    false,
  )
  setItem(STORAGE_KEYS.TOKEN, data.token)
  setSession(data.user)
  return data.user
}

export async function register(data: {
  name: string
  email: string
  password: string
}): Promise<SessionUser> {
  const response = await apiRequest<LoginResponse>(
    '/api/v1/auth/register',
    { method: 'POST', body: JSON.stringify(data) },
    false,
  )
  setItem(STORAGE_KEYS.TOKEN, response.token)
  setSession(response.user)
  return response.user
}

export async function logout(): Promise<void> {
  clearAuthToken()
  setSession(null)
}

export async function fetchUserProfile(userId: string) {
  return mock.fetchUserProfile(userId)
}

export async function updateProfile(
  userId: string,
  data: { name: string; phone?: string; bio?: string },
): Promise<SessionUser> {
  return mock.updateProfile(userId, data)
}

export async function fetchFaculdades(): Promise<Faculdade[]> {
  const data = await apiRequest<Faculdade[]>('/api/v1/faculdades', {}, false)
  return data.map(mapFaculdade)
}

export async function fetchAtleticas(faculdadeId?: string): Promise<Atletica[]> {
  const qs = faculdadeId ? `?faculdadeId=${faculdadeId}` : ''
  const data = await apiRequest<Atletica[]>(`/api/v1/atleticas${qs}`, {}, false)
  return data.map(mapAtletica)
}

export async function fetchFaculdadeById(id: string): Promise<Faculdade> {
  return mapFaculdade(await apiRequest<Faculdade>(`/api/v1/faculdades/${id}`, {}, false))
}

export async function fetchAtleticaById(id: string): Promise<Atletica> {
  return mapAtletica(await apiRequest<Atletica>(`/api/v1/atleticas/${id}`, {}, false))
}

export async function fetchAllFaculdadesAdmin(): Promise<Faculdade[]> {
  const data = await apiRequest<Faculdade[]>('/api/v1/admin/faculdades')
  return data.map(mapFaculdade)
}

export async function fetchAllAtleticasAdmin(): Promise<Atletica[]> {
  const data = await apiRequest<Atletica[]>('/api/v1/admin/atleticas')
  return data.map(mapAtletica)
}

export async function createFaculdade(data: {
  nome: string
  sigla: string
  cidade: string
  estado: string
  logo?: string
  status: EntityStatus
}): Promise<Faculdade> {
  return mapFaculdade(await apiRequest<Faculdade>('/api/v1/admin/faculdades', {
    method: 'POST',
    body: JSON.stringify(data),
  }))
}

export async function updateFaculdade(
  id: string,
  data: {
    nome: string
    sigla: string
    cidade: string
    estado: string
    logo?: string
    status: EntityStatus
  },
): Promise<Faculdade> {
  return mapFaculdade(await apiRequest<Faculdade>(`/api/v1/admin/faculdades/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }))
}

export async function deleteFaculdade(id: string): Promise<void> {
  await apiRequest<void>(`/api/v1/admin/faculdades/${id}`, { method: 'DELETE' })
}

export async function updateFaculdadeStatus(id: string, status: Faculdade['status']) {
  return mapFaculdade(
    await apiRequest<Faculdade>(`/api/v1/admin/faculdades/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  )
}

export async function updateFaculdadeFeatured(id: string, featured: boolean) {
  return mapFaculdade(
    await apiRequest<Faculdade>(`/api/v1/admin/faculdades/${id}/featured`, {
      method: 'PATCH',
      body: JSON.stringify({ featured }),
    }),
  )
}

export async function createAtletica(data: {
  nome: string
  sigla: string
  descricao?: string
  logo?: string
  faculdadeId: string
  status: EntityStatus
}): Promise<Atletica> {
  return mapAtletica(await apiRequest<Atletica>('/api/v1/admin/atleticas', {
    method: 'POST',
    body: JSON.stringify(data),
  }))
}

export async function updateAtletica(
  id: string,
  data: {
    nome: string
    sigla: string
    descricao?: string
    logo?: string
    faculdadeId: string
    status: EntityStatus
  },
): Promise<Atletica> {
  return mapAtletica(await apiRequest<Atletica>(`/api/v1/admin/atleticas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }))
}

export async function deleteAtletica(id: string): Promise<void> {
  await apiRequest<void>(`/api/v1/admin/atleticas/${id}`, { method: 'DELETE' })
}

export async function updateAtleticaStatus(id: string, status: Atletica['status']) {
  return mapAtletica(
    await apiRequest<Atletica>(`/api/v1/admin/atleticas/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  )
}

export async function updateAtleticaFeatured(id: string, featured: boolean) {
  return mapAtletica(
    await apiRequest<Atletica>(`/api/v1/admin/atleticas/${id}/featured`, {
      method: 'PATCH',
      body: JSON.stringify({ featured }),
    }),
  )
}

export async function updateEventFeatured(id: string, featured: boolean) {
  const data = await apiRequest<EventDto>(`/api/v1/admin/events/${id}/featured`, {
    method: 'PATCH',
    body: JSON.stringify({ featured }),
  })
  return mapEvent(data)
}

export async function updateEventPopular(id: string, popular: boolean) {
  const data = await apiRequest<EventDto>(`/api/v1/admin/events/${id}/popular`, {
    method: 'PATCH',
    body: JSON.stringify({ popular }),
  })
  return mapEvent(data)
}

export async function fetchFaculdadesWithStats(): Promise<FaculdadeWithStats[]> {
  const [faculdades, events] = await Promise.all([fetchFaculdades(), fetchEvents()])
  const featured = faculdades.filter((f) => f.featured)
  const source = featured.length > 0 ? featured : faculdades

  return source
    .map((faculdade) => {
      const related = events.filter((e) => e.faculdadeIds.includes(faculdade.id))
      return {
        ...faculdade,
        activeEventCount: related.length,
        totalPopularity: related.reduce((sum, e) => sum + e.popularityScore, 0),
      }
    })
    .filter((f) => f.activeEventCount > 0 || f.featured)
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1
      return b.totalPopularity - a.totalPopularity
    })
}

export async function fetchAtleticasWithStats(): Promise<AtleticaWithStats[]> {
  const [atleticas, events, faculdades] = await Promise.all([
    fetchAtleticas(),
    fetchEvents(),
    fetchFaculdades(),
  ])
  const now = new Date()
  const featured = atleticas.filter((a) => a.featured)
  const source = featured.length > 0 ? featured : atleticas

  return source
    .map((atletica) => {
      const faculdade = faculdades.find((f) => f.id === atletica.faculdadeId)
      const related = events
        .filter((e) => e.atleticaIds.includes(atletica.id))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      const upcoming = related.filter((e) => new Date(e.date) >= now)
      const past = related.filter((e) => new Date(e.date) < now)

      return {
        ...atletica,
        faculdadeSigla: faculdade?.sigla ?? '—',
        faculdadeNome: faculdade?.nome ?? '',
        activeEventCount: related.length,
        nextEvent: upcoming[0]
          ? { id: upcoming[0].id, name: upcoming[0].name, date: upcoming[0].date }
          : undefined,
        lastEvent: past[past.length - 1]
          ? { id: past[past.length - 1].id, name: past[past.length - 1].name, date: past[past.length - 1].date }
          : related[related.length - 1]
            ? {
                id: related[related.length - 1].id,
                name: related[related.length - 1].name,
                date: related[related.length - 1].date,
              }
            : undefined,
      }
    })
    .filter((a) => a.activeEventCount > 0 || a.featured)
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1
      return b.activeEventCount - a.activeEventCount
    })
}

export async function fetchFilterMeta(): Promise<{ estados: string[]; cidades: string[] }> {
  const [faculdades, events] = await Promise.all([fetchFaculdades(), fetchEvents()])
  const estados = [...new Set([...faculdades.map((f) => f.estado), ...events.map((e) => e.estado)])].sort()
  const cidades = [...new Set([...faculdades.map((f) => f.cidade), ...events.map((e) => e.cidade)])].sort()
  return { estados, cidades }
}

export async function fetchEvents(filters?: EventFilters): Promise<EventWithRelations[]> {
  if (filters?.allStatuses) {
    const data = await apiRequest<EventDto[]>('/api/v1/admin/events')
    return data.map((dto) => {
      const event = mapEvent(dto)
      return mapEventWithRelations(event, [], [])
    })
  }

  const data = await apiRequest<EventDto[]>(`/api/v1/events${buildEventQuery(filters)}`, {}, false)
  let events = data.map(mapEvent)

  if (filters?.cidade) {
    events = events.filter((e) => e.cidade.toLowerCase() === filters.cidade!.toLowerCase())
  }
  if (filters?.estado) {
    events = events.filter((e) => e.estado === filters.estado)
  }
  if (filters?.dateFrom) {
    events = events.filter((e) => new Date(e.date) >= new Date(filters.dateFrom!))
  }
  if (filters?.dateTo) {
    events = events.filter((e) => new Date(e.date) <= new Date(filters.dateTo!))
  }
  if (filters?.priceMin !== undefined) {
    events = events.filter((e) => getEventMinPrice(e) >= filters.priceMin!)
  }
  if (filters?.priceMax !== undefined) {
    events = events.filter((e) => getEventMinPrice(e) <= filters.priceMax!)
  }
  if (filters?.featured) {
    events = events.filter((e) => e.featured)
  }

  const faculdades = await fetchFaculdades()
  const atleticas = await fetchAtleticas()

  return events.map((event) =>
    mapEventWithRelations(
      event,
      faculdades.filter((f) => event.faculdadeIds.includes(f.id)),
      atleticas.filter((a) => event.atleticaIds.includes(a.id)),
    ),
  )
}

export async function fetchEventById(id: string): Promise<EventWithRelations> {
  const data = await apiRequest<EventDetailDto>(`/api/v1/events/${id}`, {}, false)
  const event = mapEvent(data.event)
  return mapEventWithRelations(
    event,
    data.faculdades.map(mapFaculdade),
    data.atleticas.map(mapAtletica),
  )
}

export async function fetchOrganizerEvents(_organizerId: string): Promise<Event[]> {
  const data = await apiRequest<EventDto[]>('/api/v1/organizer/events')
  return data.map(mapEvent)
}

export async function createEvent(_organizerId: string, data: Record<string, unknown>): Promise<Event> {
  const response = await apiRequest<EventDto>('/api/v1/organizer/events', {
    method: 'POST',
    body: JSON.stringify(eventInputToRequest(data)),
  })
  return mapEvent(response)
}

export async function updateOrganizerEvent(
  _organizerId: string,
  eventId: string,
  data: Record<string, unknown>,
): Promise<Event> {
  const response = await apiRequest<EventDto>(`/api/v1/organizer/events/${eventId}`, {
    method: 'PUT',
    body: JSON.stringify(eventInputToRequest(data)),
  })
  return mapEvent(response)
}

export async function fetchOrganizerEventById(_organizerId: string, eventId: string): Promise<Event> {
  const data = await apiRequest<EventDto>(`/api/v1/organizer/events/${eventId}`)
  return mapEvent(data)
}

export async function publishEvent(id: string): Promise<Event> {
  const data = await apiRequest<EventDto>(`/api/v1/organizer/events/${id}/publish`, { method: 'PATCH' })
  return mapEvent(data)
}

export async function cancelEvent(id: string): Promise<Event> {
  const data = await apiRequest<EventDto>(`/api/v1/organizer/events/${id}/cancel`, { method: 'PATCH' })
  return mapEvent(data)
}

export async function deleteEvent(id: string): Promise<void> {
  await apiRequest<void>(`/api/v1/organizer/events/${id}`, { method: 'DELETE' })
}

export async function subscribeToEvent(
  userId: string,
  eventId: string,
  lotId: string,
): Promise<{ inscription: Inscription; payment: Payment; ticket: Ticket }> {
  return mock.subscribeToEvent(userId, eventId, lotId)
}

export async function cancelInscription(inscriptionId: string, userId: string): Promise<void> {
  return mock.cancelInscription(inscriptionId, userId)
}

export async function fetchUserInscriptions(userId: string) {
  return mock.fetchUserInscriptions(userId)
}

export async function fetchTicketById(ticketId: string) {
  return mock.fetchTicketById(ticketId)
}

export async function fetchOrganizers(status?: EntityStatus): Promise<OrganizerDto[]> {
  const qs = status ? `?status=${status}` : ''
  return apiRequest<OrganizerDto[]>(`/api/v1/admin/organizers${qs}`)
}

export async function fetchOrganizerById(id: string): Promise<OrganizerDto> {
  return apiRequest<OrganizerDto>(`/api/v1/admin/organizers/${id}`)
}

export async function createOrganizer(data: {
  name: string
  email: string
  password: string
  phone?: string
  bio?: string
}): Promise<OrganizerDto> {
  return apiRequest<OrganizerDto>('/api/v1/admin/organizers', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateOrganizer(
  id: string,
  data: { name: string; email: string; phone?: string; bio?: string },
): Promise<OrganizerDto> {
  return apiRequest<OrganizerDto>(`/api/v1/admin/organizers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function updateOrganizerStatus(id: string, status: EntityStatus): Promise<OrganizerDto> {
  return apiRequest<OrganizerDto>(`/api/v1/admin/organizers/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export async function deleteOrganizer(id: string): Promise<void> {
  await apiRequest<void>(`/api/v1/admin/organizers/${id}`, { method: 'DELETE' })
}

export async function fetchAllUsers(): Promise<User[]> {
  const organizers = await fetchOrganizers()
  return organizers.map((o) => ({
    id: o.id,
    name: o.name,
    email: o.email,
    password: '',
    role: 'ORGANIZADOR' as const,
    phone: o.phone,
    bio: o.bio,
    createdAt: o.createdAt,
  }))
}

export async function fetchAdminStats(): Promise<DashboardStats> {
  return apiRequest<DashboardStats>('/api/v1/admin/stats')
}

export async function fetchEventsByMonth(): Promise<ChartItem[]> {
  return apiRequest<ChartItem[]>('/api/v1/admin/stats/charts/events-by-month')
}

export async function fetchUsersByRole(): Promise<ChartItem[]> {
  return apiRequest<ChartItem[]>('/api/v1/admin/stats/charts/users-by-role')
}

export async function fetchEventsByFaculdade(): Promise<ChartItem[]> {
  return apiRequest<ChartItem[]>('/api/v1/admin/stats/charts/events-by-faculdade')
}

export async function fetchEventsByAtletica(): Promise<ChartItem[]> {
  return apiRequest<ChartItem[]>('/api/v1/admin/stats/charts/events-by-atletica')
}

export async function fetchOrganizerStats(organizerId: string) {
  const events = await fetchOrganizerEvents(organizerId)
  return {
    totalEvents: events.length,
    publishedEvents: events.filter((e) => e.status === 'PUBLICADO').length,
    totalInscriptions: 0,
    totalRevenue: 0,
    totalCheckIns: 0,
  }
}

export async function performCheckIn(ticketCode: string): Promise<CheckIn> {
  return mock.performCheckIn(ticketCode)
}

export async function fetchMonthlyRevenue() {
  return mock.fetchMonthlyRevenue()
}

export async function fetchEventsByCategory() {
  const events = await apiRequest<EventDto[]>('/api/v1/admin/events')
  const categories = [
    'FESTA', 'OPEN_BAR', 'SHOW', 'ATLETICA', 'JOGOS_UNIVERSITARIOS',
    'RECEPCAO', 'WORKSHOP', 'PALESTRA', 'FEIRA_ACADEMICA', 'CULTURAL', 'ESPORTIVO', 'ACADEMICO',
  ] as const
  return categories
    .map((cat) => ({
      name: cat.charAt(0) + cat.slice(1).toLowerCase().replace(/_/g, ' '),
      value: events.filter((e) => e.category === cat).length,
    }))
    .filter((item) => item.value > 0)
}
