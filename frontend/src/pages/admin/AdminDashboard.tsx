import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  fetchAdminStats,
  fetchAllUsers,
  fetchEvents,
  fetchEventsByCategory,
  fetchMonthlyRevenue,
} from '@/api/mockApi'
import { formatCurrency } from '@/utils/format'
import { Card } from '@/components/ui/Card'
import { LoadingState } from '@/components/ui/LoadingState'
import { Badge } from '@/components/ui/Badge'
import { EVENT_STATUS_LABELS } from '@/constants/routes'

const COLORS = ['#6D28D9', '#3B82F6', '#EC4899', '#E2FF00', '#8B5CF6']

export function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: fetchAdminStats,
  })

  const { data: events } = useQuery({
    queryKey: ['admin-events'],
    queryFn: () => fetchEvents({ allStatuses: true }),
  })

  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: fetchAllUsers,
  })

  const { data: revenue } = useQuery({
    queryKey: ['admin-revenue'],
    queryFn: fetchMonthlyRevenue,
  })

  const { data: byCategory } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: fetchEventsByCategory,
  })

  if (statsLoading || !stats) return <LoadingState />

  const statCards = [
    { label: 'Eventos', value: stats.totalEvents, color: 'text-primary-light' },
    { label: 'Faculdades', value: stats.totalFaculdades, color: 'text-violet-400' },
    { label: 'Atléticas', value: stats.totalAtleticas, color: 'text-cyan-400' },
    { label: 'Usuários', value: stats.totalUsers, color: 'text-secondary' },
    { label: 'Inscrições', value: stats.totalInscriptions, color: 'text-accent' },
    { label: 'Receita', value: formatCurrency(stats.totalRevenue), color: 'text-accent-yellow' },
    { label: 'Ingressos ativos', value: stats.activeTickets, color: 'text-green-400' },
    { label: 'Check-ins hoje', value: stats.checkInsToday, color: 'text-pink-400' },
  ]

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-6" glow>
              <p className="text-xs uppercase tracking-wider text-text-muted">{stat.label}</p>
              <p className={`mt-2 font-display text-4xl ${stat.color}`}>{stat.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-heading text-sm font-bold uppercase text-foreground">
            Receita mensal
          </h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: '#111827', border: '1px solid #ffffff20' }}
                  formatter={(v) => formatCurrency(Number(v))}
                />
                <Bar dataKey="revenue" fill="#6D28D9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-heading text-sm font-bold uppercase text-foreground">
            Eventos por categoria
          </h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byCategory}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {byCategory?.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid #ffffff20' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-heading text-sm font-bold uppercase text-foreground">Todos os eventos</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/10 text-text-muted">
                <th className="pb-3 pr-4">Nome</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Organizador</th>
                <th className="pb-3">Capacidade</th>
              </tr>
            </thead>
            <tbody>
              {events?.map((event) => (
                <tr key={event.id} className="border-b border-border/5">
                  <td className="py-3 pr-4 font-medium text-foreground">{event.name}</td>
                  <td className="py-3 pr-4">
                    <Badge variant={event.status === 'PUBLICADO' ? 'success' : 'default'}>
                      {EVENT_STATUS_LABELS[event.status]}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4 text-text-muted">{event.organizerName}</td>
                  <td className="py-3">{event.capacity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-heading text-sm font-bold uppercase text-foreground">Usuários</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/10 text-text-muted">
                <th className="pb-3 pr-4">Nome</th>
                <th className="pb-3 pr-4">E-mail</th>
                <th className="pb-3">Perfil</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.id} className="border-b border-border/5">
                  <td className="py-3 pr-4 font-medium text-foreground">{user.name}</td>
                  <td className="py-3 pr-4 text-text-muted">{user.email}</td>
                  <td className="py-3">
                    <Badge variant="purple">{user.role}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
