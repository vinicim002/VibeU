import type { Event, User } from '@/types'
import { generateId } from '@/utils/id'

const ORGANIZER_ID = 'org-demo-001'
const ADMIN_ID = 'admin-demo-001'
const PARTICIPANT_ID = 'part-demo-001'

export const seedUsers: User[] = [
  {
    id: ADMIN_ID,
    name: 'Admin VibeU',
    email: 'admin@vibeu.edu',
    password: 'admin123',
    role: 'ADMINISTRADOR',
    phone: '(11) 99999-0001',
    bio: 'Administrador da plataforma VibeU',
    createdAt: new Date().toISOString(),
  },
  {
    id: ORGANIZER_ID,
    name: 'Carlos Organizador',
    email: 'org@vibeu.edu',
    password: 'org123',
    role: 'ORGANIZADOR',
    phone: '(11) 98888-0002',
    bio: 'Organizador de eventos universitários',
    createdAt: new Date().toISOString(),
  },
  {
    id: PARTICIPANT_ID,
    name: 'Ana Participante',
    email: 'part@vibeu.edu',
    password: 'part123',
    role: 'PARTICIPANTE',
    phone: '(11) 97777-0003',
    bio: 'Estudante apaixonada por eventos',
    createdAt: new Date().toISOString(),
  },
]

export const seedEvents: Event[] = [
  {
    id: generateId(),
    name: 'VibeU Summer Party',
    description:
      'A maior festa universitária do semestre. DJs, open bar, pista premium e muita energia. Traga sua vibe e viva uma noite inesquecível no campus.',
    category: 'FESTA',
    bannerUrl:
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80',
    date: '2026-07-15',
    time: '22:00',
    endTime: '04:00',
    location: 'Campus Central — Arena VibeU',
    address: 'Av. Universitária, 1000 — São Paulo, SP',
    capacity: 500,
    organizerId: ORGANIZER_ID,
    organizerName: 'Carlos Organizador',
    status: 'PUBLICADO',
    lots: [
      {
        id: generateId(),
        name: '1º Lote — Early Bird',
        price: 45,
        quantity: 150,
        sold: 98,
        startsAt: '2026-06-01',
        endsAt: '2026-06-30',
      },
      {
        id: generateId(),
        name: '2º Lote — Regular',
        price: 65,
        quantity: 200,
        sold: 45,
        startsAt: '2026-07-01',
        endsAt: '2026-07-14',
      },
      {
        id: generateId(),
        name: '3º Lote — Last Call',
        price: 85,
        quantity: 150,
        sold: 12,
        startsAt: '2026-07-15',
        endsAt: '2026-07-15',
      },
    ],
    schedule: [
      { id: generateId(), time: '22:00', title: 'Abertura', description: 'DJ Warm-up' },
      { id: generateId(), time: '23:30', title: 'Main Set', description: 'Headliner' },
      { id: generateId(), time: '02:00', title: 'After', description: 'Closing vibes' },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: 'Recepção de Calouros 2026',
    description:
      'Boas-vindas aos novos universitários! Shows acústicos, food trucks, tours pelo campus e integração com atléticas e centros acadêmicos.',
    category: 'RECEPCAO',
    bannerUrl:
      'https://images.unsplash.com/photo-1523580495186-239f2e061932?w=1200&q=80',
    date: '2026-08-20',
    time: '18:00',
    endTime: '23:00',
    location: 'Praça do Centenário',
    address: 'Campus Norte — Bloco A, São Paulo, SP',
    capacity: 800,
    organizerId: ORGANIZER_ID,
    organizerName: 'Carlos Organizador',
    status: 'PUBLICADO',
    lots: [
      {
        id: generateId(),
        name: 'Ingresso Gratuito',
        price: 0,
        quantity: 800,
        sold: 320,
        startsAt: '2026-06-01',
        endsAt: '2026-08-20',
      },
    ],
    schedule: [
      { id: generateId(), time: '18:00', title: 'Credenciamento' },
      { id: generateId(), time: '19:00', title: 'Show Acústico' },
      { id: generateId(), time: '21:00', title: 'Tour pelo Campus' },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: 'InterUniversitário VibeU',
    description:
      'Campeonato esportivo entre faculdades. Futebol, vôlei, basquete e e-sports. Torça pelo seu time e garanta seu ingresso.',
    category: 'ESPORTIVO',
    bannerUrl:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba7951?w=1200&q=80',
    date: '2026-09-10',
    time: '09:00',
    endTime: '18:00',
    location: 'Ginásio Poliesportivo',
    address: 'Campus Sul — Ginásio 1, São Paulo, SP',
    capacity: 300,
    organizerId: ORGANIZER_ID,
    organizerName: 'Carlos Organizador',
    status: 'PUBLICADO',
    lots: [
      {
        id: generateId(),
        name: 'Arquibancada',
        price: 20,
        quantity: 250,
        sold: 87,
        startsAt: '2026-06-01',
        endsAt: '2026-09-09',
      },
      {
        id: generateId(),
        name: 'VIP Lounge',
        price: 50,
        quantity: 50,
        sold: 22,
        startsAt: '2026-06-01',
        endsAt: '2026-09-09',
      },
    ],
    schedule: [
      { id: generateId(), time: '09:00', title: 'Abertura' },
      { id: generateId(), time: '10:00', title: 'Finais — Futebol' },
      { id: generateId(), time: '14:00', title: 'Finais — E-sports' },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: 'Symposium Acadêmico VibeU',
    description:
      'Palestras, workshops e networking com profissionais de tecnologia, inovação e empreendedorismo universitário.',
    category: 'ACADEMICO',
    bannerUrl:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
    date: '2026-10-05',
    time: '08:30',
    endTime: '17:00',
    location: 'Auditório Principal',
    address: 'Campus Central — Bloco B, São Paulo, SP',
    capacity: 200,
    organizerId: ORGANIZER_ID,
    organizerName: 'Carlos Organizador',
    status: 'PUBLICADO',
    lots: [
      {
        id: generateId(),
        name: 'Estudante',
        price: 15,
        quantity: 150,
        sold: 45,
        startsAt: '2026-06-01',
        endsAt: '2026-10-04',
      },
      {
        id: generateId(),
        name: 'Visitante',
        price: 30,
        quantity: 50,
        sold: 8,
        startsAt: '2026-06-01',
        endsAt: '2026-10-04',
      },
    ],
    schedule: [
      { id: generateId(), time: '08:30', title: 'Credenciamento' },
      { id: generateId(), time: '09:00', title: 'Keynote' },
      { id: generateId(), time: '14:00', title: 'Workshops' },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: 'Neon Night Show',
    description:
      'Show universitário com bandas locais, luzes neon e produção premium. Uma noite de música ao vivo no melhor estilo festival.',
    category: 'SHOW',
    bannerUrl:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80',
    date: '2026-11-22',
    time: '20:00',
    endTime: '02:00',
    location: 'Anfiteatro Externo',
    address: 'Campus Oeste — Anfiteatro, São Paulo, SP',
    capacity: 400,
    organizerId: ORGANIZER_ID,
    organizerName: 'Carlos Organizador',
    status: 'PUBLICADO',
    lots: [
      {
        id: generateId(),
        name: 'Pista',
        price: 35,
        quantity: 300,
        sold: 156,
        startsAt: '2026-06-01',
        endsAt: '2026-11-21',
      },
      {
        id: generateId(),
        name: 'Front Stage',
        price: 70,
        quantity: 100,
        sold: 67,
        startsAt: '2026-06-01',
        endsAt: '2026-11-21',
      },
    ],
    schedule: [
      { id: generateId(), time: '20:00', title: 'Opening Act' },
      { id: generateId(), time: '21:30', title: 'Banda Principal' },
      { id: generateId(), time: '00:30', title: 'Encerramento' },
    ],
    createdAt: new Date().toISOString(),
  },
]

export const DEMO_CREDENTIALS = [
  { role: 'Administrador', email: 'admin@vibeu.edu', password: 'admin123' },
  { role: 'Organizador', email: 'org@vibeu.edu', password: 'org123' },
  { role: 'Participante', email: 'part@vibeu.edu', password: 'part123' },
] as const
