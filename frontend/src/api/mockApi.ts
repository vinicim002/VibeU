import { STORAGE_KEYS } from "@/constants/routes";
import {
  SEED_VERSION,
  seedAtleticas,
  seedEvents,
  seedFaculdades,
  seedUsers,
} from "@/constants/seedData";
import type {
  Atletica,
  AtleticaWithStats,
  CheckIn,
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
} from "@/types";
import { generateId, generateTicketCode } from "@/utils/id";
import { getItem, setItem } from "@/utils/storage";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

function ensureSeeded(): void {
  const storedVersion = localStorage.getItem(STORAGE_KEYS.SEED_VERSION);
  const isCurrentVersion =
    localStorage.getItem(STORAGE_KEYS.SEEDED) === "true" &&
    storedVersion === SEED_VERSION;

  if (isCurrentVersion) return;

  const session = getItem<SessionUser | null>(STORAGE_KEYS.SESSION, null);

  setItem(STORAGE_KEYS.USERS, seedUsers);
  setItem(STORAGE_KEYS.FACULDADES, seedFaculdades);
  setItem(STORAGE_KEYS.ATLETICAS, seedAtleticas);
  setItem(STORAGE_KEYS.EVENTS, seedEvents);
  setItem(STORAGE_KEYS.INSCRIPTIONS, []);
  setItem(STORAGE_KEYS.PAYMENTS, []);
  setItem(STORAGE_KEYS.TICKETS, []);
  setItem(STORAGE_KEYS.CHECKINS, []);

  if (session) {
    const validUser = seedUsers.find((user) => user.id === session.id);
    if (validUser) {
      setSession(toSessionUser(validUser));
    } else {
      setSession(null);
    }
  }

  localStorage.setItem(STORAGE_KEYS.SEEDED, "true");
  localStorage.setItem(STORAGE_KEYS.SEED_VERSION, SEED_VERSION);
}

function getUsers(): User[] {
  ensureSeeded();
  return getItem<User[]>(STORAGE_KEYS.USERS, []);
}

function normalizeEvent(event: Event): Event {
  return {
    ...event,
    faculdadeIds: event.faculdadeIds ?? [],
    atleticaIds: event.atleticaIds ?? [],
    cidade: event.cidade ?? "São Paulo",
    estado: event.estado ?? "SP",
    rules: event.rules ?? [],
    featured: event.featured ?? false,
    popularityScore: event.popularityScore ?? 0,
  };
}

function getFaculdades(): Faculdade[] {
  ensureSeeded();
  return getItem<Faculdade[]>(STORAGE_KEYS.FACULDADES, []);
}

function getAtleticas(): Atletica[] {
  ensureSeeded();
  return getItem<Atletica[]>(STORAGE_KEYS.ATLETICAS, []);
}

function getEvents(): Event[] {
  ensureSeeded();
  return getItem<Event[]>(STORAGE_KEYS.EVENTS, []).map(normalizeEvent);
}

function enrichEvent(event: Event): EventWithRelations {
  const faculdades = getFaculdades().filter((f) =>
    event.faculdadeIds.includes(f.id),
  );
  const atleticas = getAtleticas().filter((a) =>
    event.atleticaIds.includes(a.id),
  );
  return { ...event, faculdades, atleticas };
}

function saveEvents(events: Event[]): void {
  setItem(STORAGE_KEYS.EVENTS, events);
}

function getInscriptions(): Inscription[] {
  ensureSeeded();
  return getItem<Inscription[]>(STORAGE_KEYS.INSCRIPTIONS, []);
}

function saveInscriptions(inscriptions: Inscription[]): void {
  setItem(STORAGE_KEYS.INSCRIPTIONS, inscriptions);
}

function getPayments(): Payment[] {
  ensureSeeded();
  return getItem<Payment[]>(STORAGE_KEYS.PAYMENTS, []);
}

function savePayments(payments: Payment[]): void {
  setItem(STORAGE_KEYS.PAYMENTS, payments);
}

function getTickets(): Ticket[] {
  ensureSeeded();
  return getItem<Ticket[]>(STORAGE_KEYS.TICKETS, []);
}

function saveTickets(tickets: Ticket[]): void {
  setItem(STORAGE_KEYS.TICKETS, tickets);
}

function getCheckIns(): CheckIn[] {
  ensureSeeded();
  return getItem<CheckIn[]>(STORAGE_KEYS.CHECKINS, []);
}

function saveCheckIns(checkIns: CheckIn[]): void {
  setItem(STORAGE_KEYS.CHECKINS, checkIns);
}

function toSessionUser(user: User): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export function getSession(): SessionUser | null {
  ensureSeeded();
  return getItem<SessionUser | null>(STORAGE_KEYS.SESSION, null);
}

export function setSession(user: SessionUser | null): void {
  if (user) setItem(STORAGE_KEYS.SESSION, user);
  else localStorage.removeItem(STORAGE_KEYS.SESSION);
}

export async function login(
  email: string,
  password: string,
): Promise<SessionUser> {
  await delay();
  const user = getUsers().find(
    (u) => u.email === email && u.password === password,
  );
  if (!user) throw new Error("E-mail ou senha incorretos");
  const session = toSessionUser(user);
  setSession(session);
  return session;
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
}): Promise<SessionUser> {
  await delay();
  const users = getUsers();
  if (users.some((u) => u.email === data.email)) {
    throw new Error("E-mail já cadastrado");
  }
  const newUser: User = {
    id: generateId(),
    name: data.name,
    email: data.email,
    password: data.password,
    role: "PARTICIPANTE",
    createdAt: new Date().toISOString(),
  };
  setItem(STORAGE_KEYS.USERS, [...users, newUser]);
  const session = toSessionUser(newUser);
  setSession(session);
  return session;
}

export async function logout(): Promise<void> {
  await delay(100);
  setSession(null);
}

export async function fetchUserProfile(userId: string): Promise<{
  id: string;
  name: string;
  email: string;
  role: User["role"];
  phone?: string;
  bio?: string;
}> {
  await delay();
  const user = getUsers().find((u) => u.id === userId);
  if (!user) throw new Error("Usuário não encontrado");

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    bio: user.bio,
  };
}

export async function updateProfile(
  userId: string,
  data: { name: string; phone?: string; bio?: string },
): Promise<SessionUser> {
  await delay();
  const users = getUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) throw new Error("Usuário não encontrado");

  const updated = { ...users[index], ...data };
  users[index] = updated;
  setItem(STORAGE_KEYS.USERS, users);

  const session = toSessionUser(updated);
  setSession(session);
  return session;
}

export async function fetchFaculdades(): Promise<Faculdade[]> {
  await delay(100);
  return getFaculdades()
    .filter((f) => f.status === "ATIVO")
    .sort((a, b) => a.sigla.localeCompare(b.sigla));
}

export async function fetchAtleticas(faculdadeId?: string): Promise<Atletica[]> {
  await delay(100);
  let list = getAtleticas().filter((a) => a.status === "ATIVO");
  if (faculdadeId) {
    list = list.filter((a) => a.faculdadeId === faculdadeId);
  }
  return list.sort((a, b) => a.nome.localeCompare(b.nome));
}

function getPublishedEvents(): Event[] {
  return getEvents().filter((e) => e.status === "PUBLICADO");
}

export async function fetchFaculdadesWithStats(): Promise<FaculdadeWithStats[]> {
  await delay(100);
  const events = getPublishedEvents();
  const faculdades = getFaculdades().filter((f) => f.status === "ATIVO");

  return faculdades
    .map((faculdade) => {
      const related = events.filter((e) =>
        e.faculdadeIds.includes(faculdade.id),
      );
      return {
        ...faculdade,
        activeEventCount: related.length,
        totalPopularity: related.reduce(
          (sum, e) => sum + e.popularityScore,
          0,
        ),
      };
    })
    .filter((f) => f.activeEventCount > 0)
    .sort((a, b) => b.totalPopularity - a.totalPopularity);
}

export async function fetchAtleticasWithStats(): Promise<AtleticaWithStats[]> {
  await delay(100);
  const events = getPublishedEvents();
  const faculdades = getFaculdades();
  const atleticas = getAtleticas().filter((a) => a.status === "ATIVO");
  const now = new Date();

  return atleticas
    .map((atletica) => {
      const faculdade = faculdades.find((f) => f.id === atletica.faculdadeId);
      const related = events
        .filter((e) => e.atleticaIds.includes(atletica.id))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const upcoming = related.filter((e) => new Date(e.date) >= now);
      const past = related.filter((e) => new Date(e.date) < now);

      return {
        ...atletica,
        faculdadeSigla: faculdade?.sigla ?? "—",
        faculdadeNome: faculdade?.nome ?? "",
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
      };
    })
    .filter((a) => a.activeEventCount > 0)
    .sort((a, b) => b.activeEventCount - a.activeEventCount);
}

export async function fetchFilterMeta(): Promise<{
  estados: string[];
  cidades: string[];
}> {
  await delay(50);
  const faculdades = getFaculdades();
  const events = getEvents();
  const estados = [
    ...new Set([
      ...faculdades.map((f) => f.estado),
      ...events.map((e) => e.estado),
    ]),
  ].sort();
  const cidades = [
    ...new Set([
      ...faculdades.map((f) => f.cidade),
      ...events.map((e) => e.cidade),
    ]),
  ].sort();
  return { estados, cidades };
}

export async function fetchEvents(
  filters?: EventFilters,
): Promise<EventWithRelations[]> {
  await delay();
  let events = getEvents();

  if (filters?.allStatuses) {
    // no status filter
  } else if (filters?.status) {
    events = events.filter((e) => e.status === filters.status);
  } else {
    events = events.filter((e) => e.status === "PUBLICADO");
  }

  if (filters?.featured) {
    events = events.filter((e) => e.featured);
  }

  if (filters?.category) {
    events = events.filter((e) => e.category === filters.category);
  }

  if (filters?.faculdadeId) {
    events = events.filter((e) =>
      e.faculdadeIds.includes(filters.faculdadeId!),
    );
  }

  if (filters?.atleticaId) {
    events = events.filter((e) => e.atleticaIds.includes(filters.atleticaId!));
  }

  if (filters?.cidade) {
    events = events.filter(
      (e) => e.cidade.toLowerCase() === filters.cidade!.toLowerCase(),
    );
  }

  if (filters?.estado) {
    events = events.filter((e) => e.estado === filters.estado);
  }

  if (filters?.dateFrom) {
    events = events.filter(
      (e) => new Date(e.date) >= new Date(filters.dateFrom!),
    );
  }

  if (filters?.dateTo) {
    events = events.filter((e) => new Date(e.date) <= new Date(filters.dateTo!));
  }

  if (filters?.priceMin !== undefined) {
    events = events.filter((e) => getEventMinPrice(e) >= filters.priceMin!);
  }

  if (filters?.priceMax !== undefined) {
    events = events.filter((e) => getEventMinPrice(e) <= filters.priceMax!);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    events = events.filter((e) => {
      const enriched = enrichEvent(e);
      return (
        e.name.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.cidade.toLowerCase().includes(q) ||
        enriched.faculdades.some(
          (f) =>
            f.nome.toLowerCase().includes(q) ||
            f.sigla.toLowerCase().includes(q),
        ) ||
        enriched.atleticas.some(
          (a) =>
            a.nome.toLowerCase().includes(q) ||
            a.sigla.toLowerCase().includes(q),
        )
      );
    });
  }

  return events
    .map(enrichEvent)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export async function fetchEventById(id: string): Promise<EventWithRelations> {
  await delay();
  const event = getEvents().find((e) => e.id === id);
  if (!event) throw new Error("Evento não encontrado");
  return enrichEvent(event);
}

export async function fetchOrganizerEvents(
  organizerId: string,
): Promise<Event[]> {
  await delay();
  return getEvents()
    .filter((e) => e.organizerId === organizerId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

type CreateEventInput = Omit<
  Event,
  | "id"
  | "organizerId"
  | "organizerName"
  | "status"
  | "lots"
  | "schedule"
  | "createdAt"
  | "rules"
  | "faculdadeIds"
  | "atleticaIds"
  | "featured"
  | "popularityScore"
> &
  Partial<Pick<Event, "rules" | "faculdadeIds" | "atleticaIds" | "featured" | "popularityScore">>;

export async function createEvent(
  organizerId: string,
  data: CreateEventInput,
): Promise<Event> {
  await delay();
  const users = getUsers();
  const organizer = users.find((u) => u.id === organizerId);
  if (!organizer) throw new Error("Organizador não encontrado");

  const event: Event = {
    ...data,
    id: generateId(),
    organizerId,
    organizerName: organizer.name,
    status: "RASCUNHO",
    lots: [
      {
        id: generateId(),
        name: "1º Lote",
        price: 0,
        quantity: data.capacity,
        sold: 0,
        startsAt: data.date,
        endsAt: data.date,
      },
    ],
    schedule: [],
    rules: data.rules ?? [],
    faculdadeIds: data.faculdadeIds ?? [],
    atleticaIds: data.atleticaIds ?? [],
    featured: false,
    popularityScore: 0,
    createdAt: new Date().toISOString(),
  };

  const events = getEvents();
  saveEvents([...events, event]);
  return event;
}

export async function updateEvent(
  id: string,
  data: Partial<Event>,
): Promise<Event> {
  await delay();
  const events = getEvents();
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) throw new Error("Evento não encontrado");

  events[index] = { ...events[index], ...data };
  saveEvents(events);
  return events[index];
}

export async function publishEvent(id: string): Promise<Event> {
  return updateEvent(id, { status: "PUBLICADO" });
}

export async function cancelEvent(id: string): Promise<Event> {
  return updateEvent(id, { status: "CANCELADO" });
}

export async function deleteEvent(id: string): Promise<void> {
  await delay();
  const events = getEvents();
  const event = events.find((e) => e.id === id);
  if (!event) throw new Error("Evento não encontrado");
  if (event.status !== "RASCUNHO") {
    throw new Error("Apenas eventos em rascunho podem ser excluídos");
  }
  saveEvents(events.filter((e) => e.id !== id));
}

export function getEventSoldCount(event: Event): number {
  return event.lots.reduce((acc, lot) => acc + lot.sold, 0);
}

export function getEventMinPrice(event: Event): number {
  const prices = event.lots.map((l) => l.price);
  return prices.length ? Math.min(...prices) : 0;
}

export function getAvailableLotSpots(lot: Event["lots"][0]): number {
  return Math.max(0, lot.quantity - lot.sold);
}

export async function subscribeToEvent(
  userId: string,
  eventId: string,
  lotId: string,
): Promise<{ inscription: Inscription; payment: Payment; ticket: Ticket }> {
  await delay(500);
  const events = getEvents();
  const eventIndex = events.findIndex((e) => e.id === eventId);
  if (eventIndex === -1) throw new Error("Evento não encontrado");

  const event = events[eventIndex];
  if (event.status !== "PUBLICADO") throw new Error("Evento não disponível");

  const lotIndex = event.lots.findIndex((l) => l.id === lotId);
  if (lotIndex === -1) throw new Error("Lote não encontrado");

  const lot = event.lots[lotIndex];
  if (getAvailableLotSpots(lot) <= 0) throw new Error("Lote esgotado");

  const inscriptions = getInscriptions();
  const existing = inscriptions.find(
    (i) =>
      i.eventId === eventId && i.userId === userId && i.status !== "CANCELADA",
  );
  if (existing) throw new Error("Você já possui inscrição neste evento");

  const inscription: Inscription = {
    id: generateId(),
    eventId,
    userId,
    lotId,
    status: "CONFIRMADA",
    createdAt: new Date().toISOString(),
  };

  const payment: Payment = {
    id: generateId(),
    inscriptionId: inscription.id,
    amount: lot.price,
    status: lot.price === 0 ? "PAGO" : "PAGO",
    paidAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  const ticket: Ticket = {
    id: generateId(),
    inscriptionId: inscription.id,
    eventId,
    userId,
    code: generateTicketCode(),
    status: "ATIVO",
    createdAt: new Date().toISOString(),
  };

  event.lots[lotIndex] = { ...lot, sold: lot.sold + 1 };
  events[eventIndex] = event;
  saveEvents(events);
  saveInscriptions([...inscriptions, inscription]);
  savePayments([...getPayments(), payment]);
  saveTickets([...getTickets(), ticket]);

  return { inscription, payment, ticket };
}

export async function cancelInscription(
  inscriptionId: string,
  userId: string,
): Promise<void> {
  await delay();
  const inscriptions = getInscriptions();
  const index = inscriptions.findIndex(
    (i) => i.id === inscriptionId && i.userId === userId,
  );
  if (index === -1) throw new Error("Inscrição não encontrada");

  inscriptions[index] = { ...inscriptions[index], status: "CANCELADA" };
  saveInscriptions(inscriptions);

  const tickets = getTickets();
  const ticketIndex = tickets.findIndex(
    (t) => t.inscriptionId === inscriptionId,
  );
  if (ticketIndex !== -1) {
    tickets[ticketIndex] = { ...tickets[ticketIndex], status: "CANCELADO" };
    saveTickets(tickets);
  }
}

export async function fetchUserInscriptions(userId: string): Promise<
  Array<{
    inscription: Inscription;
    event: Event;
    payment: Payment | null;
    ticket: Ticket | null;
  }>
> {
  await delay();
  const inscriptions = getInscriptions().filter((i) => i.userId === userId);
  const events = getEvents();
  const payments = getPayments();
  const tickets = getTickets();

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
    );
}

export async function fetchTicketById(ticketId: string): Promise<{
  ticket: Ticket;
  event: Event;
  user: User;
  payment: Payment | null;
} | null> {
  await delay();
  const ticket = getTickets().find((t) => t.id === ticketId);
  if (!ticket) return null;

  const event = getEvents().find((e) => e.id === ticket.eventId);
  const user = getUsers().find((u) => u.id === ticket.userId);
  if (!event || !user) return null;

  const payment =
    getPayments().find((p) => p.inscriptionId === ticket.inscriptionId) ?? null;

  return { ticket, event, user, payment };
}

export async function fetchAllUsers(): Promise<User[]> {
  await delay();
  return getUsers().map(
    ({ password: _, ...rest }) => ({ ...rest, password: "" }) as User,
  );
}

export async function fetchAdminStats(): Promise<{
  totalEvents: number;
  totalUsers: number;
  totalInscriptions: number;
  totalRevenue: number;
  activeTickets: number;
  checkInsToday: number;
  totalFaculdades: number;
  totalAtleticas: number;
}> {
  await delay();
  const events = getEvents();
  const users = getUsers();
  const faculdades = getFaculdades();
  const atleticas = getAtleticas();
  const inscriptions = getInscriptions().filter(
    (i) => i.status === "CONFIRMADA",
  );
  const payments = getPayments().filter((p) => p.status === "PAGO");
  const tickets = getTickets().filter((t) => t.status === "ATIVO");
  const checkIns = getCheckIns();
  const today = new Date().toDateString();

  return {
    totalEvents: events.length,
    totalUsers: users.length,
    totalInscriptions: inscriptions.length,
    totalRevenue: payments.reduce((acc, p) => acc + p.amount, 0),
    activeTickets: tickets.length,
    checkInsToday: checkIns.filter(
      (c) => new Date(c.checkedAt).toDateString() === today,
    ).length,
    totalFaculdades: faculdades.length,
    totalAtleticas: atleticas.length,
  };
}

export async function fetchOrganizerStats(organizerId: string): Promise<{
  totalEvents: number;
  publishedEvents: number;
  totalInscriptions: number;
  totalRevenue: number;
  totalCheckIns: number;
}> {
  await delay();
  const events = getEvents().filter((e) => e.organizerId === organizerId);
  const eventIds = new Set(events.map((e) => e.id));
  const inscriptions = getInscriptions().filter(
    (i) => eventIds.has(i.eventId) && i.status === "CONFIRMADA",
  );
  const payments = getPayments().filter(
    (p) =>
      p.status === "PAGO" && inscriptions.some((i) => i.id === p.inscriptionId),
  );
  const tickets = getTickets().filter((t) => eventIds.has(t.eventId));
  const checkIns = getCheckIns().filter((c) =>
    tickets.some((t) => t.id === c.ticketId),
  );

  return {
    totalEvents: events.length,
    publishedEvents: events.filter((e) => e.status === "PUBLICADO").length,
    totalInscriptions: inscriptions.length,
    totalRevenue: payments.reduce((acc, p) => acc + p.amount, 0),
    totalCheckIns: checkIns.length,
  };
}

export async function performCheckIn(ticketCode: string): Promise<CheckIn> {
  await delay();
  const tickets = getTickets();
  const ticket = tickets.find((t) => t.code === ticketCode);
  if (!ticket) throw new Error("Ingresso não encontrado");
  if (ticket.status === "CANCELADO") throw new Error("Ingresso cancelado");
  if (ticket.status === "UTILIZADO") throw new Error("Ingresso já utilizado");

  const checkIns = getCheckIns();
  if (checkIns.some((c) => c.ticketId === ticket.id)) {
    throw new Error("Check-in já realizado");
  }

  const checkIn: CheckIn = {
    id: generateId(),
    ticketId: ticket.id,
    checkedAt: new Date().toISOString(),
  };

  const ticketIndex = tickets.findIndex((t) => t.id === ticket.id);
  tickets[ticketIndex] = { ...ticket, status: "UTILIZADO" };

  saveTickets(tickets);
  saveCheckIns([...checkIns, checkIn]);
  return checkIn;
}

export async function fetchMonthlyRevenue(): Promise<
  Array<{ month: string; revenue: number }>
> {
  await delay();
  const payments = getPayments().filter((p) => p.status === "PAGO");
  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  return months.map((month, index) => {
    const revenue = payments
      .filter((p) => new Date(p.paidAt ?? p.createdAt).getMonth() === index)
      .reduce((acc, p) => acc + p.amount, 0);
    return { month, revenue };
  });
}

export async function fetchEventsByCategory(): Promise<
  Array<{ name: string; value: number }>
> {
  await delay();
  const events = getEvents();
  const categories = [
    "FESTA",
    "SHOW",
    "ESPORTIVO",
    "ACADEMICO",
    "RECEPCAO",
  ] as const;

  return categories.map((cat) => ({
    name: cat.charAt(0) + cat.slice(1).toLowerCase(),
    value: events.filter((e) => e.category === cat).length,
  }));
}
