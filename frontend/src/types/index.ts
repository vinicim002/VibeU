export type UserRole = 'ADMINISTRADOR' | 'ORGANIZADOR' | 'PARTICIPANTE'

export type EventStatus = 'RASCUNHO' | 'PUBLICADO' | 'CANCELADO' | 'ENCERRADO'

export type InscriptionStatus = 'PENDENTE' | 'CONFIRMADA' | 'CANCELADA'

export type PaymentStatus = 'PENDENTE' | 'PAGO' | 'CANCELADO' | 'REEMBOLSADO'

export type TicketStatus = 'ATIVO' | 'UTILIZADO' | 'CANCELADO'

export type EventCategory =
  | 'FESTA'
  | 'SHOW'
  | 'ESPORTIVO'
  | 'ACADEMICO'
  | 'RECEPCAO'

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
  capacity: number
  organizerId: string
  organizerName: string
  status: EventStatus
  lots: Lot[]
  schedule: ScheduleItem[]
  createdAt: string
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
  totalEvents: number
  totalUsers: number
  totalInscriptions: number
  totalRevenue: number
  activeTickets: number
  checkInsToday: number
}
