import type { EventCategory } from '@/types'

export interface CategoryConfig {
  value: EventCategory
  label: string
  description: string
  image: string
  gradient: string
}

export const EVENT_CATEGORIES: CategoryConfig[] = [
  {
    value: 'FESTA',
    label: 'Festas Universitárias',
    description: 'A vibe do campus em uma noite inesquecível',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
    gradient: 'from-primary/80 to-accent/60',
  },
  {
    value: 'OPEN_BAR',
    label: 'Open Bar',
    description: 'Drinks liberados e muita energia',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
    gradient: 'from-accent/80 to-primary/60',
  },
  {
    value: 'SHOW',
    label: 'Shows',
    description: 'Música ao vivo e grandes produções',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    gradient: 'from-secondary/80 to-primary/60',
  },
  {
    value: 'ATLETICA',
    label: 'Atléticas',
    description: 'Eventos das atléticas universitárias',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba7951?w=800&q=80',
    gradient: 'from-green-600/80 to-secondary/60',
  },
  {
    value: 'JOGOS_UNIVERSITARIOS',
    label: 'Jogos Universitários',
    description: 'InterAtléticas e competições',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
    gradient: 'from-blue-600/80 to-primary/60',
  },
  {
    value: 'RECEPCAO',
    label: 'Recepção de Calouros',
    description: 'Boas-vindas aos novos universitários',
    image: 'https://images.unsplash.com/photo-1523580495186-239f2e061932?w=800&q=80',
    gradient: 'from-pink-600/80 to-accent/60',
  },
  {
    value: 'WORKSHOP',
    label: 'Workshops',
    description: 'Aprendizado prático e networking',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    gradient: 'from-violet-600/80 to-primary/60',
  },
  {
    value: 'PALESTRA',
    label: 'Palestras',
    description: 'Conteúdo e inspiração acadêmica',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f39d4666?w=800&q=80',
    gradient: 'from-indigo-600/80 to-secondary/60',
  },
  {
    value: 'FEIRA_ACADEMICA',
    label: 'Feiras Acadêmicas',
    description: 'Projetos, startups e inovação',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80',
    gradient: 'from-amber-600/80 to-primary/60',
  },
  {
    value: 'CULTURAL',
    label: 'Eventos Culturais',
    description: 'Arte, teatro e expressão universitária',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80',
    gradient: 'from-rose-600/80 to-accent/60',
  },
]
