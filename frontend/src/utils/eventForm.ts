import type { Event } from '@/types'
import type { EventFormData } from '@/validations/auth'
import type { EventCategory } from '@/types'

export function eventToFormData(event: Event): EventFormData {
  return {
    name: event.name,
    description: event.description,
    category: event.category,
    bannerUrl: event.bannerUrl,
    date: event.date,
    time: event.time,
    endTime: event.endTime,
    location: event.location,
    address: event.address,
    cidade: event.cidade,
    estado: event.estado,
    capacity: event.capacity,
    faculdadeIds: event.faculdadeIds,
    atleticaIds: event.atleticaIds,
    rulesText: event.rules.join('\n'),
    lots: event.lots.map((l) => ({
      id: l.id,
      name: l.name,
      price: l.price,
      quantity: l.quantity,
    })),
    scheduleItems: event.schedule.map((s) => ({
      time: s.time,
      title: s.title,
      description: s.description,
    })),
  }
}

export function formDataToEventInput(data: EventFormData) {
  return {
    name: data.name,
    description: data.description,
    category: data.category as EventCategory,
    bannerUrl: data.bannerUrl,
    date: data.date,
    time: data.time,
    endTime: data.endTime,
    location: data.location,
    address: data.address,
    cidade: data.cidade,
    estado: data.estado.toUpperCase(),
    capacity: data.capacity,
    faculdadeIds: data.faculdadeIds,
    atleticaIds: data.atleticaIds,
    rules: data.rulesText
      ? data.rulesText.split('\n').map((r) => r.trim()).filter(Boolean)
      : [],
    lotsInput: data.lots,
    scheduleInput: data.scheduleItems,
  }
}
