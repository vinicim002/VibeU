import type { Atletica, Event, Faculdade, User } from '@/types'

const ORGANIZER_ID = 'org-demo-001'
const ADMIN_ID = 'admin-demo-001'
const PARTICIPANT_ID = 'part-demo-001'

export const SEED_VERSION = '3'

const logo = (sigla: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(sigla)}&background=6D28D9&color=fff&size=128&bold=true`

export const seedFaculdades: Faculdade[] = [
  { id: 'fac-usp', nome: 'Universidade de São Paulo', sigla: 'USP', cidade: 'São Paulo', estado: 'SP', logo: logo('USP'), status: 'ATIVO', featured: true },
  { id: 'fac-unesp', nome: 'Universidade Estadual Paulista', sigla: 'UNESP', cidade: 'São Paulo', estado: 'SP', logo: logo('UNESP'), status: 'ATIVO', featured: false },
  { id: 'fac-unicamp', nome: 'Universidade Estadual de Campinas', sigla: 'UNICAMP', cidade: 'Campinas', estado: 'SP', logo: logo('UNICAMP'), status: 'ATIVO', featured: true },
  { id: 'fac-ufmg', nome: 'Universidade Federal de Minas Gerais', sigla: 'UFMG', cidade: 'Belo Horizonte', estado: 'MG', logo: logo('UFMG'), status: 'ATIVO', featured: true },
  { id: 'fac-puc', nome: 'PUC-SP', sigla: 'PUC', cidade: 'São Paulo', estado: 'SP', logo: logo('PUC'), status: 'ATIVO', featured: false },
]

export const seedAtleticas: Atletica[] = [
  { id: 'atl-aaa-med-usp', nome: 'AAA Medicina USP', sigla: 'AAA Med USP', logo: logo('AAA'), descricao: 'Atlética Acadêmica de Medicina da USP', faculdadeId: 'fac-usp', status: 'ATIVO', featured: true },
  { id: 'atl-aaa-med-unesp', nome: 'AAA Medicina UNESP', sigla: 'AAA Med UNESP', logo: logo('AAA'), descricao: 'Atlética Acadêmica de Medicina da UNESP', faculdadeId: 'fac-unesp', status: 'ATIVO', featured: false },
  { id: 'atl-eng-unicamp', nome: 'Atlética de Engenharia UNICAMP', sigla: 'ATL Eng', logo: logo('ENG'), descricao: 'Atlética dos cursos de Engenharia', faculdadeId: 'fac-unicamp', status: 'ATIVO', featured: true },
  { id: 'atl-imperial-ufmg', nome: 'Imperial Atlética UFMG', sigla: 'Imperial', logo: logo('IMP'), descricao: 'Uma das maiores atléticas do Brasil', faculdadeId: 'fac-ufmg', status: 'ATIVO', featured: true },
  { id: 'atl-puc-social', nome: 'Atlética Ciências Sociais PUC', sigla: 'ATL PUC', logo: logo('PUC'), descricao: 'Atlética de Ciências Sociais', faculdadeId: 'fac-puc', status: 'ATIVO', featured: false },
  { id: 'atl-inter-usp-unesp', nome: 'Liga InterAtlética USP-UNESP', sigla: 'InterLiga', logo: logo('INT'), descricao: 'Parceria entre atléticas USP e UNESP', faculdadeId: 'fac-usp', status: 'ATIVO', featured: false },
]

export const seedUsers: User[] = [
  { id: ADMIN_ID, name: 'Admin VibeU', email: 'admin@vibeu.edu', password: 'admin123', role: 'ADMINISTRADOR', phone: '(11) 99999-0001', bio: 'Administrador da plataforma VibeU', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: ORGANIZER_ID, name: 'Carlos Organizador', email: 'org@vibeu.edu', password: 'org123', role: 'ORGANIZADOR', phone: '(11) 98888-0002', bio: 'Organizador de eventos universitários', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: PARTICIPANT_ID, name: 'Ana Participante', email: 'part@vibeu.edu', password: 'part123', role: 'PARTICIPANTE', phone: '(11) 97777-0003', bio: 'Estudante apaixonada por eventos', createdAt: '2026-01-01T00:00:00.000Z' },
]

export const seedEvents: Event[] = [
  {
    id: 'evt-summer-party-001',
    name: 'VibeU Summer Party',
    description: 'A maior festa universitária do semestre. DJs, open bar, pista premium e muita energia. Traga sua vibe e viva uma noite inesquecível no campus.',
    category: 'FESTA',
    bannerUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80',
    date: '2026-07-15', time: '22:00', endTime: '04:00',
    location: 'Campus Central — Arena VibeU',
    address: 'Av. Universitária, 1000 — São Paulo, SP',
    cidade: 'São Paulo', estado: 'SP',
    capacity: 500, organizerId: ORGANIZER_ID, organizerName: 'Carlos Organizador', status: 'PUBLICADO',
    faculdadeIds: ['fac-usp', 'fac-puc'],
    atleticaIds: ['atl-aaa-med-usp', 'atl-puc-social'],
    featured: true, popular: true, popularityScore: 950,
    lots: [
      { id: 'lot-summer-early', name: '1º Lote — Early Bird', price: 45, quantity: 150, sold: 98, startsAt: '2026-06-01', endsAt: '2026-06-30' },
      { id: 'lot-summer-regular', name: '2º Lote — Regular', price: 65, quantity: 200, sold: 45, startsAt: '2026-07-01', endsAt: '2026-07-14' },
      { id: 'lot-summer-last', name: '3º Lote — Last Call', price: 85, quantity: 150, sold: 12, startsAt: '2026-07-15', endsAt: '2026-07-15' },
    ],
    schedule: [
      { id: 'sch-summer-1', time: '22:00', title: 'Abertura', description: 'DJ Warm-up' },
      { id: 'sch-summer-2', time: '23:30', title: 'Main Set', description: 'Headliner' },
      { id: 'sch-summer-3', time: '02:00', title: 'After', description: 'Closing vibes' },
    ],
    rules: ['Documento com foto obrigatório', 'Proibido entrada de menores', 'Sem reembolso após início do evento'],
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'evt-medfolia-2027',
    name: 'MedFolia 2027',
    description: 'A maior interAtlética de medicina do estado. Parceria entre USP e UNESP com open bar, shows e muita energia. Evento aberto para universitários de todo o Brasil.',
    category: 'OPEN_BAR',
    bannerUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&q=80',
    date: '2027-03-20', time: '20:00', endTime: '06:00',
    location: 'Espaço Arena Universitária',
    address: 'Av. Prof. Lineu Prestes, 1280 — São Paulo, SP',
    cidade: 'São Paulo', estado: 'SP',
    capacity: 2000, organizerId: ORGANIZER_ID, organizerName: 'Carlos Organizador', status: 'PUBLICADO',
    faculdadeIds: ['fac-usp', 'fac-unesp'],
    atleticaIds: ['atl-aaa-med-usp', 'atl-aaa-med-unesp', 'atl-inter-usp-unesp'],
    featured: true, popular: true, popularityScore: 1200,
    lots: [
      { id: 'lot-medfolia-1', name: '1º Lote', price: 80, quantity: 800, sold: 520, startsAt: '2026-10-01', endsAt: '2027-01-31' },
      { id: 'lot-medfolia-2', name: '2º Lote', price: 110, quantity: 800, sold: 180, startsAt: '2027-02-01', endsAt: '2027-03-19' },
      { id: 'lot-medfolia-3', name: '3º Lote', price: 140, quantity: 400, sold: 45, startsAt: '2027-03-20', endsAt: '2027-03-20' },
    ],
    schedule: [
      { id: 'sch-med-1', time: '20:00', title: 'Credenciamento' },
      { id: 'sch-med-2', time: '21:00', title: 'Abertura Oficial' },
      { id: 'sch-med-3', time: '23:00', title: 'Show Principal' },
    ],
    rules: ['Carteirinha universitária obrigatória', 'Open bar até 02h', 'Proibido copos de vidro na pista'],
    createdAt: '2026-02-01T00:00:00.000Z',
  },
  {
    id: 'evt-recepcao-001',
    name: 'Recepção de Calouros 2026',
    description: 'Boas-vindas aos novos universitários! Shows acústicos, food trucks, tours pelo campus e integração com atléticas e centros acadêmicos.',
    category: 'RECEPCAO',
    bannerUrl: 'https://images.unsplash.com/photo-1523580495186-239f2e061932?w=1200&q=80',
    date: '2026-08-20', time: '18:00', endTime: '23:00',
    location: 'Praça do Centenário',
    address: 'Campus Norte — Bloco A, Campinas, SP',
    cidade: 'Campinas', estado: 'SP',
    capacity: 800, organizerId: ORGANIZER_ID, organizerName: 'Carlos Organizador', status: 'PUBLICADO',
    faculdadeIds: ['fac-unicamp'],
    atleticaIds: ['atl-eng-unicamp'],
    featured: false, popular: false, popularityScore: 680,
    lots: [{ id: 'lot-recepcao-free', name: 'Ingresso Gratuito', price: 0, quantity: 800, sold: 320, startsAt: '2026-06-01', endsAt: '2026-08-20' }],
    schedule: [
      { id: 'sch-recepcao-1', time: '18:00', title: 'Credenciamento' },
      { id: 'sch-recepcao-2', time: '19:00', title: 'Show Acústico' },
      { id: 'sch-recepcao-3', time: '21:00', title: 'Tour pelo Campus' },
    ],
    rules: ['Evento exclusivo para calouros 2026', 'Inscrição obrigatória'],
    createdAt: '2026-01-20T00:00:00.000Z',
  },
  {
    id: 'evt-esportivo-001',
    name: 'InterUniversitário VibeU',
    description: 'Campeonato esportivo entre faculdades. Futebol, vôlei, basquete e e-sports. Torça pelo seu time e garanta seu ingresso.',
    category: 'JOGOS_UNIVERSITARIOS',
    bannerUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba7951?w=1200&q=80',
    date: '2026-09-10', time: '09:00', endTime: '18:00',
    location: 'Ginásio Poliesportivo',
    address: 'Campus Sul — Ginásio 1, Belo Horizonte, MG',
    cidade: 'Belo Horizonte', estado: 'MG',
    capacity: 300, organizerId: ORGANIZER_ID, organizerName: 'Carlos Organizador', status: 'PUBLICADO',
    faculdadeIds: ['fac-ufmg', 'fac-usp'],
    atleticaIds: ['atl-imperial-ufmg', 'atl-inter-usp-unesp'],
    featured: true, popular: true, popularityScore: 820,
    lots: [
      { id: 'lot-esportivo-geral', name: 'Arquibancada', price: 20, quantity: 250, sold: 87, startsAt: '2026-06-01', endsAt: '2026-09-09' },
      { id: 'lot-esportivo-vip', name: 'VIP Lounge', price: 50, quantity: 50, sold: 22, startsAt: '2026-06-01', endsAt: '2026-09-09' },
    ],
    schedule: [
      { id: 'sch-esportivo-1', time: '09:00', title: 'Abertura' },
      { id: 'sch-esportivo-2', time: '10:00', title: 'Finais — Futebol' },
      { id: 'sch-esportivo-3', time: '14:00', title: 'Finais — E-sports' },
    ],
    rules: ['Camisa do time permitida', 'Proibido objetos pontiagudos'],
    createdAt: '2026-02-01T00:00:00.000Z',
  },
  {
    id: 'evt-academico-001',
    name: 'Symposium Acadêmico VibeU',
    description: 'Palestras, workshops e networking com profissionais de tecnologia, inovação e empreendedorismo universitário.',
    category: 'PALESTRA',
    bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
    date: '2026-10-05', time: '08:30', endTime: '17:00',
    location: 'Auditório Principal',
    address: 'Campus Central — Bloco B, São Paulo, SP',
    cidade: 'São Paulo', estado: 'SP',
    capacity: 200, organizerId: ORGANIZER_ID, organizerName: 'Carlos Organizador', status: 'PUBLICADO',
    faculdadeIds: ['fac-usp', 'fac-unesp', 'fac-puc'],
    atleticaIds: ['atl-aaa-med-usp'],
    featured: false, popular: false, popularityScore: 450,
    lots: [
      { id: 'lot-academico-estudante', name: 'Estudante', price: 15, quantity: 150, sold: 45, startsAt: '2026-06-01', endsAt: '2026-10-04' },
      { id: 'lot-academico-visitante', name: 'Visitante', price: 30, quantity: 50, sold: 8, startsAt: '2026-06-01', endsAt: '2026-10-04' },
    ],
    schedule: [
      { id: 'sch-academico-1', time: '08:30', title: 'Credenciamento' },
      { id: 'sch-academico-2', time: '09:00', title: 'Keynote' },
      { id: 'sch-academico-3', time: '14:00', title: 'Workshops' },
    ],
    rules: ['Notebook recomendado para workshops', 'Certificado digital incluso'],
    createdAt: '2026-02-15T00:00:00.000Z',
  },
  {
    id: 'evt-neon-show-001',
    name: 'Neon Night Show',
    description: 'Show universitário com bandas locais, luzes neon e produção premium. Uma noite de música ao vivo no melhor estilo festival.',
    category: 'SHOW',
    bannerUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80',
    date: '2026-11-22', time: '20:00', endTime: '02:00',
    location: 'Anfiteatro Externo',
    address: 'Campus Oeste — Anfiteatro, Campinas, SP',
    cidade: 'Campinas', estado: 'SP',
    capacity: 400, organizerId: ORGANIZER_ID, organizerName: 'Carlos Organizador', status: 'PUBLICADO',
    faculdadeIds: ['fac-unicamp'],
    atleticaIds: ['atl-eng-unicamp'],
    featured: true, popular: false, popularityScore: 780,
    lots: [
      { id: 'lot-neon-pista', name: 'Pista', price: 35, quantity: 300, sold: 156, startsAt: '2026-06-01', endsAt: '2026-11-21' },
      { id: 'lot-neon-front', name: 'Front Stage', price: 70, quantity: 100, sold: 67, startsAt: '2026-06-01', endsAt: '2026-11-21' },
    ],
    schedule: [
      { id: 'sch-neon-1', time: '20:00', title: 'Opening Act' },
      { id: 'sch-neon-2', time: '21:30', title: 'Banda Principal' },
      { id: 'sch-neon-3', time: '00:30', title: 'Encerramento' },
    ],
    rules: ['Proibido câmeras profissionais', 'Entrada permitida até 22h'],
    createdAt: '2026-03-01T00:00:00.000Z',
  },
]

export const DEMO_CREDENTIALS = [
  { role: 'Administrador', email: 'admin@vibeu.edu', password: 'Admin123' },
  { role: 'Organizador', email: 'org@vibeu.edu', password: 'Org12345' },
  { role: 'Participante', email: 'part@vibeu.edu', password: 'Part1234' },
] as const
