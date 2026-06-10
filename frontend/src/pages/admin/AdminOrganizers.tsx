import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import {
  createOrganizer,
  deleteOrganizer,
  fetchOrganizers,
  updateOrganizer,
  updateOrganizerStatus,
} from '@/api'
import type { EntityStatus } from '@/types'
import { AdminSection } from '@/components/admin/AdminSection'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingState } from '@/components/ui/LoadingState'

interface AdminOrganizersProps {
  embedded?: boolean
}

export function AdminOrganizers({ embedded = false }: AdminOrganizersProps) {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    bio: '',
  })

  const { data: organizers, isLoading } = useQuery({
    queryKey: ['admin-organizers'],
    queryFn: () => fetchOrganizers(),
  })

  const resetForm = () => {
    setForm({ name: '', email: '', password: '', phone: '', bio: '' })
    setEditingId(null)
    setShowForm(false)
  }

  const createMutation = useMutation({
    mutationFn: () =>
      createOrganizer({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
        bio: form.bio || undefined,
      }),
    onSuccess: () => {
      toast.success('Organizador criado!')
      queryClient.invalidateQueries({ queryKey: ['admin-organizers'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      resetForm()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const updateMutation = useMutation({
    mutationFn: () =>
      updateOrganizer(editingId!, {
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        bio: form.bio || undefined,
      }),
    onSuccess: () => {
      toast.success('Organizador atualizado!')
      queryClient.invalidateQueries({ queryKey: ['admin-organizers'] })
      resetForm()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: EntityStatus }) =>
      updateOrganizerStatus(id, status),
    onSuccess: () => {
      toast.success('Status atualizado!')
      queryClient.invalidateQueries({ queryKey: ['admin-organizers'] })
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteOrganizer,
    onSuccess: () => {
      toast.success('Organizador excluído!')
      queryClient.invalidateQueries({ queryKey: ['admin-organizers'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const handleDelete = (org: NonNullable<typeof organizers>[0]) => {
    if (
      window.confirm(
        `Excluir organizador ${org.name}? Só é possível se não houver eventos vinculados.`,
      )
    ) {
      deleteMutation.mutate(org.id)
    }
  }

  if (isLoading) return <LoadingState />

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      updateMutation.mutate()
    } else {
      createMutation.mutate()
    }
  }

  const startEdit = (org: NonNullable<typeof organizers>[0]) => {
    setEditingId(org.id)
    setForm({
      name: org.name,
      email: org.email,
      password: '',
      phone: org.phone ?? '',
      bio: org.bio ?? '',
    })
    setShowForm(true)
  }

  const content = (
    <>
      {showForm ? (
        <form
          onSubmit={handleSubmit}
          className="mb-4 space-y-4 rounded-2xl border border-border/10 bg-surface/5 p-4 sm:p-5"
        >
          <h4 className="text-sm font-medium text-foreground">
            {editingId ? 'Editar organizador' : 'Cadastrar organizador'}
          </h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Nome"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="E-mail"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            {!editingId ? (
              <Input
                label="Senha"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            ) : null}
            <Input
              label="Telefone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-text-muted">Bio</label>
            <textarea
              rows={2}
              className="w-full rounded-xl border border-border/10 bg-bg-gray px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" size="sm" isLoading={createMutation.isPending || updateMutation.isPending}>
              {editingId ? 'Salvar' : 'Criar'}
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={resetForm}>
              Cancelar
            </Button>
          </div>
        </form>
      ) : null}

      {organizers?.length === 0 ? (
        <Card className="p-8 text-center" hover={false}>
          <p className="text-sm text-text-muted">Nenhum organizador cadastrado.</p>
        </Card>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {organizers?.map((org) => (
            <Card key={org.id} className="p-4 sm:p-5" hover={false}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-heading text-sm font-bold uppercase text-foreground">
                      {org.name}
                    </h4>
                    <Badge variant={org.status === 'ATIVO' ? 'success' : 'danger'}>{org.status}</Badge>
                  </div>
                  <p className="mt-1 break-all text-xs text-text-muted sm:text-sm">{org.email}</p>
                  {org.phone ? (
                    <p className="mt-0.5 text-xs text-text-muted">{org.phone}</p>
                  ) : null}
                </div>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
                  <Button size="sm" variant="secondary" onClick={() => startEdit(org)}>
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      statusMutation.mutate({
                        id: org.id,
                        status: org.status === 'ATIVO' ? 'INATIVO' : 'ATIVO',
                      })
                    }
                  >
                    {org.status === 'ATIVO' ? 'Desativar' : 'Ativar'}
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    className="col-span-2 sm:col-span-1"
                    onClick={() => handleDelete(org)}
                    isLoading={deleteMutation.isPending}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )

  if (embedded) {
    return (
      <AdminSection
        title="Organizadores"
        description="Gerencie quem cria eventos na plataforma."
        action={
          !showForm ? (
            <Button
              size="sm"
              variant="accent"
              onClick={() => {
                resetForm()
                setShowForm(true)
              }}
            >
              + Novo
            </Button>
          ) : null
        }
      >
        {content}
      </AdminSection>
    )
  }

  return (
    <Card className="p-4 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-heading text-sm font-bold uppercase text-foreground">Organizadores</h3>
        {!showForm ? (
          <Button
            size="sm"
            variant="accent"
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
          >
            + Novo organizador
          </Button>
        ) : null}
      </div>
      {content}
    </Card>
  )
}
