import type {
  Atletica,
  Event,
  EventWithRelations,
  Faculdade,
  Lot,
  ScheduleItem,
} from '@/types'

interface LotDto {
  id: string
  name: string
  price: number
  quantity: number
  sold: number
  startsAt?: string
  endsAt?: string
}

interface ScheduleDto {
  id: string
  time: string
  title: string
  description?: string
}

export interface EventDto {
  id: string
  name: string
  description: string
  category: Event['category']
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
  status: Event['status']
  faculdadeIds: string[]
  atleticaIds: string[]
  lots: LotDto[]
  schedule: ScheduleDto[]
  rules: string[]
  featured: boolean
  popular: boolean
  popularityScore: number
  createdAt: string
}

export function mapLot(dto: LotDto): Lot {
  return {
    id: dto.id,
    name: dto.name,
    price: Number(dto.price),
    quantity: dto.quantity,
    sold: dto.sold ?? 0,
    startsAt: dto.startsAt ?? '',
    endsAt: dto.endsAt ?? '',
  }
}

export function mapSchedule(dto: ScheduleDto): ScheduleItem {
  return {
    id: dto.id,
    time: dto.time,
    title: dto.title,
    description: dto.description,
  }
}

export function mapEvent(dto: EventDto): Event {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    category: dto.category,
    bannerUrl: dto.bannerUrl,
    date: dto.date,
    time: dto.time,
    endTime: dto.endTime,
    location: dto.location,
    address: dto.address,
    cidade: dto.cidade,
    estado: dto.estado,
    capacity: dto.capacity,
    organizerId: dto.organizerId,
    organizerName: dto.organizerName,
    status: dto.status,
    faculdadeIds: dto.faculdadeIds ?? [],
    atleticaIds: dto.atleticaIds ?? [],
    lots: (dto.lots ?? []).map(mapLot),
    schedule: (dto.schedule ?? []).map(mapSchedule),
    rules: dto.rules ?? [],
    featured: dto.featured ?? false,
    popular: dto.popular ?? false,
    popularityScore: dto.popularityScore ?? 0,
    createdAt: dto.createdAt,
  }
}

export function mapFaculdade(dto: Faculdade): Faculdade {
  return { ...dto, featured: dto.featured ?? false }
}

export function mapAtletica(dto: Atletica): Atletica {
  return { ...dto, featured: dto.featured ?? false }
}

export function mapEventWithRelations(
  event: Event,
  faculdades: Faculdade[],
  atleticas: Atletica[],
): EventWithRelations {
  return { ...event, faculdades, atleticas }
}
