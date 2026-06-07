import { STORAGE_KEYS } from '@/constants/routes'
import { seedEvents, seedUsers } from '@/constants/seedData'
import type {
  CheckIn,
  Event,
  Inscription,
  Payment,
  SessionUser,
  Ticket,
  User,
} from '@/types'
import { generateId, generateTicketCode } from '@/utils/id'
import { getItem, setItem } from '@/utils/storage'

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms))

function ensureSeeded(): void {
  if (localStorage.getItem(STORAGE_KEYS.SEEDED)) return

  setItem(STORAGE_KEYS.USERS, seedUsers)
  setItem(STORAGE_KEYS.EVENTS, seedEvents)
  setItem(STORAGE_KEYS.INSCRIPTIONS, [])
  setItem(STORAGE_KEYS.PAYMENTS, [])
  setItem(STORAGE_KEYS.TICKETS, [])
  setItem(STORAGE_KEYS.CHECKINS, [])
  localStorage.setItem(STORAGE_KEYS.SEEDED, 'true')
}

function getUsers(): User[] {
  ensureSeeded()
  return getItem<User[]>(STORAGE_KEYS.USERS, [])
}

function getEvents(): Event[] {
  ensureSeeded()
  return getItem<Event[]>(STORAGE_KEYS.EVENTS, [])
}

function saveEvents(events: Event[]): void {
  setItem(STORAGE_KEYS.EVENTS, events)
}

function getInscriptions(): Inscription[] {
  ensureSeeded()
  return getItem<Inscription[]>(STORAGE_KEYS.INSCRIPTIONS, [])
}

function saveInscriptions(inscriptions: Inscription[]): void {
  setItem(STORAGE_KEYS.INSCRIPTIONS, inscriptions)
}

function getPayments(): Payment[] {
  ensureSeeded()
  return getItem<Payment[]>(STORAGE_KEYS.PAYMENTS, [])
}

function savePayments(payments: Payment[]): void {
  setItem(STORAGE_KEYS.PAYMENTS, payments)
}

function getTickets(): Ticket[] {
  ensureSeeded()
  return getItem<Ticket[]>(STORAGE_KEYS.TICKETS, [])
}

function saveTickets(tickets: Ticket[]): void {
  setItem(STORAGE_KEYS.TICKETS, tickets)
}

function getCheckIns(): CheckIn[] {
  ensureSeeded()
  return getItem<CheckIn[]>(STORAGE_KEYS.CHECKINS, [])
}

function saveCheckIns(checkIns: CheckIn[]): void {
  setItem(STORAGE_KEYS.CHECKINS, checkIns)
}

function toSessionUser(user: User): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

export function getSession(): SessionUser | null {
  ensureSeeded()
  return getItem<SessionUser | null>(STORAGE_KEYS.SESSION, null)
}

export function setSession(user: SessionUser | null): void {
  if (user) setItem(STORAGE_KEYS.SESSION, user)
  else localStorage.removeItem(STORAGE_KEYS.SESSION)
}

export async function login(email: string, password: string): Promise<SessionUser> {
  await delay()
  const user = getUsers().find((u) => u.email === email && u.password === password)
  if (!user) throw new Error('E-mail ou senha incorretos')
  const session = toSessionUser(user)
  setSession(session)
  return session
}

export async function register(data: {
  name: string
  email: string
  password: string
}): Promise<SessionUser> {
  await delay()
  const users = getUsers()
  if (users.some((u) => u.email === data.email)) {
    throw new Error('E-mail já cadastrado')
  }
  const newUser: User = {
    id: generateId(),
    name: data.name,
    email: data.email,
    password: data.password,
    role: 'PARTICIPANTE',
    createdAt: new Date().toISOString(),
  }
  setItem(STORAGE_KEYS.USERS, [...users, newUser])
  const session = toSessionUser(newUser)
  setSession(session)
  return session
}

export async function logout(): Promise<void> {
  await delay(100)
  setSession(null)
}

export async function updateProfile(
  userId: string,
  data: { name: string; phone?: string; bio?: string },
): Promise<SessionUser> {
  await delay()
  const users = getUsers()
  const index = users.findIndex((u) => u.id === userId)
  if (index === -1) throw new Error('Usuário não encontrado')

  const updated = { ...users[index], ...data }
  users[index] = updated
  setItem(STORAGE_KEYS.USERS, users)

  const session = toSessionUser(updated)
  setSession(session)
  return session
}

export async function fetchEvents(filters?: {
  category?: string
  search?: string
  status?: string
  allStatuses?: boolean
}): Promise<Event[]> {
  await delay()
  let events = getEvents()

  if (filters?.allStatuses) {
    // no status filter
  } else if (filters?.status) {
    events = events.filter((e) => e.status === filters.status)
  } else {
    events = events.filter((e) => e.status === 'PUBLICADO')
  }

  if (filters?.category) {
    events = events.filter((e) => e.category === filters.category)
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase()
    events = events.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q),
    )
  }

  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export async function fetchEventById(id: string): Promise<Event | null> {
  await delay()
  return getEvents().find((e) => e.id === id) ?? null
}

export async function fetchOrganizerEvents(organizerId: string): Promise<Event[]> {
  await delay()
  return getEvents()
    .filter((e) => e.organizerId === organizerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function createEvent(
  organizerId: string,
  data: Omit<Event, 'id' | 'organizerId' | 'organizerName' | 'status' | 'lots' | 'schedule' | 'createdAt'>,
): Promise<Event> {
  await delay()
  const users = getUsers()
  const organizer = users.find((u) => u.id === organizerId)
  if (!organizer) throw new Error('Organizador não encontrado')

  const event: Event = {
    ...data,
    id: generateId(),
    organizerId,
    organizerName: organizer.name,
    status: 'RASCUNHO',
    lots: [
      {
        id: generateId(),
        name: '1º Lote',
        price: 0,
        quantity: data.capacity,
        sold: 0,
        startsAt: data.date,
        endsAt: data.date,
      },
    ],
    schedule: [],
    createdAt: new Date().toISOString(),
  }

  const events = getEvents()
  saveEvents([...events, event])
  return event
}

export async function updateEvent(id: string, data: Partial<Event>): Promise<Event> {
  await delay()
  const events = getEvents()
  const index = events.findIndex((e) => e.id === id)
  if (index === -1) throw new Error('Evento não encontrado')

  events[index] = { ...events[index], ...data }
  saveEvents(events)
  return events[index]
}

export async function publishEvent(id: string): Promise<Event> {
  return updateEvent(id, { status: 'PUBLICADO' })
}

export async function cancelEvent(id: string): Promise<Event> {
  return updateEvent(id, { status: 'CANCELADO' })
}

export async function deleteEvent(id: string): Promise<void> {
  await delay()
  const events = getEvents()
  const event = events.find((e) => e.id === id)
  if (!event) throw new Error('Evento não encontrado')
  if (event.status !== 'RASCUNHO') {
    throw new Error('Apenas eventos em rascunho podem ser excluídos')
  }
  saveEvents(events.filter((e) => e.id !== id))
}

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

export async function subscribeToEvent(
  userId: string,
  eventId: string,
  lotId: string,
): Promise<{ inscription: Inscription; payment: Payment; ticket: Ticket }> {
  await delay(500)
  const events = getEvents()
  const eventIndex = events.findIndex((e) => e.id === eventId)
  if (eventIndex === -1) throw new Error('Evento não encontrado')

  const event = events[eventIndex]
  if (event.status !== 'PUBLICADO') throw new Error('Evento não disponível')

  const lotIndex = event.lots.findIndex((l) => l.id === lotId)
  if (lotIndex === -1) throw new Error('Lote não encontrado')

  const lot = event.lots[lotIndex]
  if (getAvailableLotSpots(lot) <= 0) throw new Error('Lote esgotado')

  const inscriptions = getInscriptions()
  const existing = inscriptions.find(
    (i) =>
      i.eventId === eventId &&
      i.userId === userId &&
      i.status !== 'CANCELADA',
  )
  if (existing) throw new Error('Você já possui inscrição neste evento')

  const inscription: Inscription = {
    id: generateId(),
    eventId,
    userId,
    lotId,
    status: 'CONFIRMADA',
    createdAt: new Date().toISOString(),
  }

  const payment: Payment = {
    id: generateId(),
    inscriptionId: inscription.id,
    amount: lot.price,
    status: lot.price === 0 ? 'PAGO' : 'PAGO',
    paidAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }

  const ticket: Ticket = {
    id: generateId(),
    inscriptionId: inscription.id,
    eventId,
    userId,
    code: generateTicketCode(),
    status: 'ATIVO',
    createdAt: new Date().toISOString(),
  }

  event.lots[lotIndex] = { ...lot, sold: lot.sold + 1 }
  events[eventIndex] = event
  saveEvents(events)
  saveInscriptions([...inscriptions, inscription])
  savePayments([...getPayments(), payment])
  saveTickets([...getTickets(), ticket])

  return { inscription, payment, ticket }
}

export async function cancelInscription(inscriptionId: string, userId: string): Promise<void> {
  await delay()
  const inscriptions = getInscriptions()
  const index = inscriptions.findIndex((i) => i.id === inscriptionId && i.userId === userId)
  if (index === -1) throw new Error('Inscrição não encontrada')

  inscriptions[index] = { ...inscriptions[index], status: 'CANCELADA' }
  saveInscriptions(inscriptions)

  const tickets = getTickets()
  const ticketIndex = tickets.findIndex((t) => t.inscriptionId === inscriptionId)
  if (ticketIndex !== -1) {
    tickets[ticketIndex] = { ...tickets[ticketIndex], status: 'CANCELADO' }
    saveTickets(tickets)
  }
}

export async function fetchUserInscriptions(userId: string): Promise<
  Array<{
    inscription: Inscription
    event: Event
    payment: Payment | null
    ticket: Ticket | null
  }>
> {
  await delay()
  const inscriptions = getInscriptions().filter((i) => i.userId === userId)
  const events = getEvents()
  const payments = getPayments()
  const tickets = getTickets()

  return inscriptions
    .map((inscription) => ({
      inscription,
      event: events.find((e) => e.id === inscription.eventId)!,
      payment: payments.find((p) => p.inscriptionId === inscription.id) ?? null,
      ticket: tickets.find((t) => t.inscriptionId === inscription.id) ?? null,
    }))
    .filter((item) => item.event)
    .sort(
      (a, b) =>
        new Date(b.inscription.createdAt).getTime() -
        new Date(a.inscription.createdAt).getTime(),
    )
}

export async function fetchTicketById(ticketId: string): Promise<{
  ticket: Ticket
  event: Event
  user: User
  payment: Payment | null
} | null> {
  await delay()
  const ticket = getTickets().find((t) => t.id === ticketId)
  if (!ticket) return null

  const event = getEvents().find((e) => e.id === ticket.eventId)
  const user = getUsers().find((u) => u.id === ticket.userId)
  if (!event || !user) return null

  const payment =
    getPayments().find((p) => p.inscriptionId === ticket.inscriptionId) ?? null

  return { ticket, event, user, payment }
}

export async function fetchAllUsers(): Promise<User[]> {
  await delay()
  return getUsers().map(({ password: _, ...rest }) => ({ ...rest, password: '' } as User))
}

export async function fetchAdminStats(): Promise<{
  totalEvents: number
  totalUsers: number
  totalInscriptions: number
  totalRevenue: number
  activeTickets: number
  checkInsToday: number
}> {
  await delay()
  const events = getEvents()
  const users = getUsers()
  const inscriptions = getInscriptions().filter((i) => i.status === 'CONFIRMADA')
  const payments = getPayments().filter((p) => p.status === 'PAGO')
  const tickets = getTickets().filter((t) => t.status === 'ATIVO')
  const checkIns = getCheckIns()
  const today = new Date().toDateString()

  return {
    totalEvents: events.length,
    totalUsers: users.length,
    totalInscriptions: inscriptions.length,
    totalRevenue: payments.reduce((acc, p) => acc + p.amount, 0),
    activeTickets: tickets.length,
    checkInsToday: checkIns.filter(
      (c) => new Date(c.checkedAt).toDateString() === today,
    ).length,
  }
}

export async function fetchOrganizerStats(organizerId: string): Promise<{
  totalEvents: number
  publishedEvents: number
  totalInscriptions: number
  totalRevenue: number
  totalCheckIns: number
}> {
  await delay()
  const events = getEvents().filter((e) => e.organizerId === organizerId)
  const eventIds = new Set(events.map((e) => e.id))
  const inscriptions = getInscriptions().filter(
    (i) => eventIds.has(i.eventId) && i.status === 'CONFIRMADA',
  )
  const payments = getPayments().filter(
    (p) =>
      p.status === 'PAGO' &&
      inscriptions.some((i) => i.id === p.inscriptionId),
  )
  const tickets = getTickets().filter((t) => eventIds.has(t.eventId))
  const checkIns = getCheckIns().filter((c) =>
    tickets.some((t) => t.id === c.ticketId),
  )

  return {
    totalEvents: events.length,
    publishedEvents: events.filter((e) => e.status === 'PUBLICADO').length,
    totalInscriptions: inscriptions.length,
    totalRevenue: payments.reduce((acc, p) => acc + p.amount, 0),
    totalCheckIns: checkIns.length,
  }
}

export async function performCheckIn(ticketCode: string): Promise<CheckIn> {
  await delay()
  const tickets = getTickets()
  const ticket = tickets.find((t) => t.code === ticketCode)
  if (!ticket) throw new Error('Ingresso não encontrado')
  if (ticket.status === 'CANCELADO') throw new Error('Ingresso cancelado')
  if (ticket.status === 'UTILIZADO') throw new Error('Ingresso já utilizado')

  const checkIns = getCheckIns()
  if (checkIns.some((c) => c.ticketId === ticket.id)) {
    throw new Error('Check-in já realizado')
  }

  const checkIn: CheckIn = {
    id: generateId(),
    ticketId: ticket.id,
    checkedAt: new Date().toISOString(),
  }

  const ticketIndex = tickets.findIndex((t) => t.id === ticket.id)
  tickets[ticketIndex] = { ...ticket, status: 'UTILIZADO' }

  saveTickets(tickets)
  saveCheckIns([...checkIns, checkIn])
  return checkIn
}

export async function fetchMonthlyRevenue(): Promise<Array<{ month: string; revenue: number }>> {
  await delay()
  const payments = getPayments().filter((p) => p.status === 'PAGO')
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

  return months.map((month, index) => {
    const revenue = payments
      .filter((p) => new Date(p.paidAt ?? p.createdAt).getMonth() === index)
      .reduce((acc, p) => acc + p.amount, 0)
    return { month, revenue }
  })
}

export async function fetchEventsByCategory(): Promise<Array<{ name: string; value: number }>> {
  await delay()
  const events = getEvents()
  const categories = ['FESTA', 'SHOW', 'ESPORTIVO', 'ACADEMICO', 'RECEPCAO'] as const

  return categories.map((cat) => ({
    name: cat.charAt(0) + cat.slice(1).toLowerCase(),
    value: events.filter((e) => e.category === cat).length,
  }))
}
