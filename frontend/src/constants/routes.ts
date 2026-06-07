export const ROUTES = {
  HOME: '/',
  EVENTS: '/eventos',
  EVENT_DETAIL: '/eventos/:id',
  LOGIN: '/login',
  REGISTER: '/cadastro',
  FORGOT_PASSWORD: '/recuperar-senha',
  PROFILE: '/perfil',
  TICKET: '/ingresso/:id',
  ADMIN_DASHBOARD: '/admin',
  ORGANIZER_DASHBOARD: '/organizador',
  ORGANIZER_CREATE_EVENT: '/organizador/eventos/novo',
  ORGANIZER_EDIT_EVENT: '/organizador/eventos/:id/editar',
  PARTICIPANT_DASHBOARD: '/participante',
} as const

export const STORAGE_KEYS = {
  USERS: 'vibeu_users',
  SESSION: 'vibeu_session',
  EVENTS: 'vibeu_events',
  INSCRIPTIONS: 'vibeu_inscriptions',
  PAYMENTS: 'vibeu_payments',
  TICKETS: 'vibeu_tickets',
  CHECKINS: 'vibeu_checkins',
  SEEDED: 'vibeu_seeded',
} as const

export const CATEGORY_LABELS: Record<string, string> = {
  FESTA: 'Festa',
  SHOW: 'Show',
  ESPORTIVO: 'Esportivo',
  ACADEMICO: 'Acadêmico',
  RECEPCAO: 'Recepção',
}

export const EVENT_STATUS_LABELS: Record<string, string> = {
  RASCUNHO: 'Rascunho',
  PUBLICADO: 'Publicado',
  CANCELADO: 'Cancelado',
  ENCERRADO: 'Encerrado',
}
