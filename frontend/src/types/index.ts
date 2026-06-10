export type UserRole = 'ADMINISTRADOR' | 'ORGANIZADOR' | 'PARTICIPANTE'

export type EntityStatus = 'ATIVO' | 'INATIVO'

export type EventStatus = 'RASCUNHO' | 'PUBLICADO' | 'CANCELADO' | 'ENCERRADO'

export type InscriptionStatus = 'PENDENTE' | 'CONFIRMADA' | 'CANCELADA'

export type PaymentStatus = 'PENDENTE' | 'PAGO' | 'CANCELADO' | 'REEMBOLSADO'

export type TicketStatus = 'ATIVO' | 'UTILIZADO' | 'CANCELADO'

export type EventCategory =
  | 'FESTA'
  | 'OPEN_BAR'
  | 'SHOW'
  | 'ATLETICA'
  | 'JOGOS_UNIVERSITARIOS'
  | 'RECEPCAO'
  | 'WORKSHOP'
  | 'PALESTRA'
  | 'FEIRA_ACADEMICA'
  | 'CULTURAL'
  | 'ESPORTIVO'
  | 'ACADEMICO'

export interface Faculdade {
  id: string
  nome: string
  sigla: string
  cidade: string
  estado: string
  logo: string
  status: EntityStatus
  featured: boolean
}

export interface Atletica {
  id: string
  nome: string
  sigla: string
  logo: string
  descricao: string
  faculdadeId: string
  status: EntityStatus
  featured: boolean
}

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  phone?: string
  bio?: string
  createdAt: string
}

export interface Lot {
  id: string
  name: string
  price: number
  quantity: number
  sold: number
  startsAt: string
  endsAt: string
}

export interface ScheduleItem {
  id: string
  time: string
  title: string
  description?: string
}

export interface Event {
  id: string
  name: string
  description: string
  category: EventCategory
  bannerUrl: string
  date: string
  time: string
  endTime?: string
  location: string
  address: string
  cidade: string
  estado: string
  capacity: number
  organizerId: string
  organizerName: string
  status: EventStatus
  faculdadeIds: string[]
  atleticaIds: string[]
  lots: Lot[]
  schedule: ScheduleItem[]
  rules: string[]
  featured: boolean
  popular: boolean
  popularityScore: number
  createdAt: string
}

export interface EventWithRelations extends Event {
  faculdades: Faculdade[]
  atleticas: Atletica[]
}

export interface FaculdadeWithStats extends Faculdade {
  activeEventCount: number
  totalPopularity: number
}

export interface AtleticaEventPreview {
  id: string
  name: string
  date: string
}

export interface AtleticaWithStats extends Atletica {
  faculdadeSigla: string
  faculdadeNome: string
  activeEventCount: number
  nextEvent?: AtleticaEventPreview
  lastEvent?: AtleticaEventPreview
}

export interface EventFilters {
  search?: string
  category?: string
  faculdadeId?: string
  atleticaId?: string
  cidade?: string
  estado?: string
  dateFrom?: string
  dateTo?: string
  priceMin?: number
  priceMax?: number
  featured?: boolean
  status?: string
  allStatuses?: boolean
}

export interface Inscription {
  id: string
  eventId: string
  userId: string
  lotId: string
  status: InscriptionStatus
  createdAt: string
}

export interface Payment {
  id: string
  inscriptionId: string
  amount: number
  status: PaymentStatus
  paidAt?: string
  createdAt: string
}

export interface Ticket {
  id: string
  inscriptionId: string
  eventId: string
  userId: string
  code: string
  status: TicketStatus
  createdAt: string
}

export interface CheckIn {
  id: string
  ticketId: string
  checkedAt: string
}

export interface SessionUser {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface DashboardStats {
  totalUsers: number
  totalOrganizers: number
  totalParticipants: number
  totalEvents: number
  activeEvents: number
  closedEvents: number
  totalFaculdades: number
  totalAtleticas: number
  ticketsIssued: number
}

export interface ChartItem {
  name: string
  value: number
}
