import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import {
  createAtletica,
  createFaculdade,
  deleteAtletica,
  deleteFaculdade,
  fetchAllAtleticasAdmin,
  fetchAllFaculdadesAdmin,
  updateAtletica,
  updateAtleticaFeatured,
  updateAtleticaStatus,
  updateFaculdade,
  updateFaculdadeFeatured,
  updateFaculdadeStatus,
} from '@/api'
import type { Atletica, EntityStatus, Faculdade } from '@/types'
import { AdminSection } from '@/components/admin/AdminSection'
import { AdminTabs } from '@/components/admin/AdminTabs'
import { AdminToggleChip } from '@/components/admin/AdminToggleChip'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { LoadingState } from '@/components/ui/LoadingState'

const emptyFacForm = {
  nome: '',
  sigla: '',
  cidade: '',
  estado: '',
  logo: '',
  status: 'ATIVO' as EntityStatus,
}

const emptyAtlForm = {
  nome: '',
  sigla: '',
  descricao: '',
  logo: '',
  faculdadeId: '',
  status: 'ATIVO' as EntityStatus,
}

interface AdminInstitutionsProps {
  embedded?: boolean
}

export function AdminInstitutions({ embedded = false }: AdminInstitutionsProps) {
  const queryClient = useQueryClient()
  const [instTab, setInstTab] = useState<'faculdades' | 'atleticas'>('faculdades')
  const [facFormOpen, setFacFormOpen] = useState(false)
  const [atlFormOpen, setAtlFormOpen] = useState(false)
  const [editingFacId, setEditingFacId] = useState<string | null>(null)
  const [editingAtlId, setEditingAtlId] = useState<string | null>(null)
  const [facForm, setFacForm] = useState(emptyFacForm)
  const [atlForm, setAtlForm] = useState(emptyAtlForm)

  const { data: faculdades, isLoading: facLoading } = useQuery({
    queryKey: ['admin-faculdades'],
    queryFn: fetchAllFaculdadesAdmin,
  })

  const { data: atleticas, isLoading: atlLoading } = useQuery({
    queryKey: ['admin-atleticas'],
    queryFn: fetchAllAtleticasAdmin,
  })

  const invalidateInstitutions = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-faculdades'] })
    queryClient.invalidateQueries({ queryKey: ['admin-atleticas'] })
    queryClient.invalidateQueries({ queryKey: ['faculdades'] })
    queryClient.invalidateQueries({ queryKey: ['atleticas-all'] })
    queryClient.invalidateQueries({ queryKey: ['faculdades-stats'] })
    queryClient.invalidateQueries({ queryKey: ['atleticas-stats'] })
    queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
    queryClient.invalidateQueries({ queryKey: ['admin-chart-events-faculdade'] })
    queryClient.invalidateQueries({ queryKey: ['admin-chart-events-atletica'] })
  }

  const resetFacForm = () => {
    setFacForm(emptyFacForm)
    setEditingFacId(null)
    setFacFormOpen(false)
  }

  const resetAtlForm = () => {
    setAtlForm(emptyAtlForm)
    setEditingAtlId(null)
    setAtlFormOpen(false)
  }

  const facSaveMutation = useMutation({
    mutationFn: () =>
      editingFacId
        ? updateFaculdade(editingFacId, { ...facForm, logo: facForm.logo || undefined })
        : createFaculdade({ ...facForm, logo: facForm.logo || undefined }),
    onSuccess: () => {
      toast.success(editingFacId ? 'Faculdade atualizada' : 'Faculdade criada')
      invalidateInstitutions()
      resetFacForm()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const atlSaveMutation = useMutation({
    mutationFn: () =>
      editingAtlId
        ? updateAtletica(editingAtlId, {
            ...atlForm,
            descricao: atlForm.descricao || undefined,
            logo: atlForm.logo || undefined,
          })
        : createAtletica({
            ...atlForm,
            descricao: atlForm.descricao || undefined,
            logo: atlForm.logo || undefined,
          }),
    onSuccess: () => {
      toast.success(editingAtlId ? 'Atlética atualizada' : 'Atlética criada')
      invalidateInstitutions()
      resetAtlForm()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const deleteFacMutation = useMutation({
    mutationFn: deleteFaculdade,
    onSuccess: () => {
      toast.success('Faculdade excluída')
      invalidateInstitutions()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const deleteAtlMutation = useMutation({
    mutationFn: deleteAtletica,
    onSuccess: () => {
      toast.success('Atlética excluída')
      invalidateInstitutions()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const toggleFacStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: EntityStatus }) =>
      updateFaculdadeStatus(id, status),
    onSuccess: () => {
      invalidateInstitutions()
      toast.success('Status atualizado')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const toggleAtlStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: EntityStatus }) =>
      updateAtleticaStatus(id, status),
    onSuccess: () => {
      invalidateInstitutions()
      toast.success('Status atualizado')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const toggleFacFeatured = useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      updateFaculdadeFeatured(id, featured),
    onSuccess: () => {
      invalidateInstitutions()
      toast.success('Destaque atualizado')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const toggleAtlFeatured = useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      updateAtleticaFeatured(id, featured),
    onSuccess: () => {
      invalidateInstitutions()
      toast.success('Destaque atualizado')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  if (facLoading || atlLoading) return <LoadingState />

  const startEditFac = (f: Faculdade) => {
    setInstTab('faculdades')
    setEditingFacId(f.id)
    setFacForm({
      nome: f.nome,
      sigla: f.sigla,
      cidade: f.cidade,
      estado: f.estado,
      logo: f.logo ?? '',
      status: f.status,
    })
    setFacFormOpen(true)
  }

  const startEditAtl = (a: Atletica) => {
    setInstTab('atleticas')
    setEditingAtlId(a.id)
    setAtlForm({
      nome: a.nome,
      sigla: a.sigla,
      descricao: a.descricao ?? '',
      logo: a.logo ?? '',
      faculdadeId: a.faculdadeId,
      status: a.status,
    })
    setAtlFormOpen(true)
  }

  const handleDeleteFac = (f: Faculdade) => {
    if (window.confirm(`Excluir faculdade ${f.sigla}?`)) {
      deleteFacMutation.mutate(f.id)
    }
  }

  const handleDeleteAtl = (a: Atletica) => {
    if (window.confirm(`Excluir atlética ${a.nome}?`)) {
      deleteAtlMutation.mutate(a.id)
    }
  }

  const facFormBlock = facFormOpen ? (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        facSaveMutation.mutate()
      }}
      className="mb-4 space-y-3 rounded-2xl border border-border/10 bg-surface/5 p-4"
    >
      <h4 className="text-sm font-medium text-foreground">
        {editingFacId ? 'Editar faculdade' : 'Nova faculdade'}
      </h4>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Nome" value={facForm.nome} onChange={(e) => setFacForm({ ...facForm, nome: e.target.value })} required />
        <Input label="Sigla" value={facForm.sigla} onChange={(e) => setFacForm({ ...facForm, sigla: e.target.value })} required />
        <Input label="Cidade" value={facForm.cidade} onChange={(e) => setFacForm({ ...facForm, cidade: e.target.value })} required />
        <Input
          label="Estado"
          value={facForm.estado}
          maxLength={2}
          onChange={(e) => setFacForm({ ...facForm, estado: e.target.value.toUpperCase() })}
          required
        />
        <Input
          label="Logo (URL)"
          value={facForm.logo}
          onChange={(e) => setFacForm({ ...facForm, logo: e.target.value })}
          className="sm:col-span-2"
        />
        <Select
          label="Status"
          value={facForm.status}
          onChange={(e) => setFacForm({ ...facForm, status: e.target.value as EntityStatus })}
          options={[
            { value: 'ATIVO', label: 'Ativo' },
            { value: 'INATIVO', label: 'Inativo' },
          ]}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" size="sm" isLoading={facSaveMutation.isPending}>
          {editingFacId ? 'Salvar' : 'Criar'}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={resetFacForm}>
          Cancelar
        </Button>
      </div>
    </form>
  ) : null

  const atlFormBlock = atlFormOpen ? (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        atlSaveMutation.mutate()
      }}
      className="mb-4 space-y-3 rounded-2xl border border-border/10 bg-surface/5 p-4"
    >
      <h4 className="text-sm font-medium text-foreground">
        {editingAtlId ? 'Editar atlética' : 'Nova atlética'}
      </h4>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Nome" value={atlForm.nome} onChange={(e) => setAtlForm({ ...atlForm, nome: e.target.value })} required />
        <Input label="Sigla" value={atlForm.sigla} onChange={(e) => setAtlForm({ ...atlForm, sigla: e.target.value })} required />
        <Select
          label="Faculdade"
          value={atlForm.faculdadeId}
          onChange={(e) => setAtlForm({ ...atlForm, faculdadeId: e.target.value })}
          options={[
            { value: '', label: 'Selecione...' },
            ...(faculdades?.map((f) => ({ value: f.id, label: f.sigla })) ?? []),
          ]}
          required
        />
        <Input label="Logo (URL)" value={atlForm.logo} onChange={(e) => setAtlForm({ ...atlForm, logo: e.target.value })} />
        <Select
          label="Status"
          value={atlForm.status}
          onChange={(e) => setAtlForm({ ...atlForm, status: e.target.value as EntityStatus })}
          options={[
            { value: 'ATIVO', label: 'Ativo' },
            { value: 'INATIVO', label: 'Inativo' },
          ]}
        />
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-xs font-medium uppercase tracking-wider text-text-muted">Descrição</label>
          <textarea
            rows={2}
            className="w-full rounded-xl border border-border/10 bg-bg-gray px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
            value={atlForm.descricao}
            onChange={(e) => setAtlForm({ ...atlForm, descricao: e.target.value })}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" size="sm" isLoading={atlSaveMutation.isPending}>
          {editingAtlId ? 'Salvar' : 'Criar'}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={resetAtlForm}>
          Cancelar
        </Button>
      </div>
    </form>
  ) : null

  const facList = (
    <div className="space-y-3">
      {faculdades?.length === 0 ? (
        <Card className="p-6 text-center" hover={false}>
          <p className="text-sm text-text-muted">Nenhuma faculdade cadastrada.</p>
        </Card>
      ) : (
        faculdades?.map((f) => (
          <Card key={f.id} className="p-4" hover={false}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                {f.logo ? (
                  <img src={f.logo} alt="" className="h-10 w-10 shrink-0 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-xs font-bold text-primary">
                    {f.sigla.slice(0, 2)}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-heading text-sm font-bold uppercase text-foreground">{f.sigla}</p>
                    <Badge variant={f.status === 'ATIVO' ? 'success' : 'danger'}>{f.status}</Badge>
                  </div>
                  <p className="truncate text-xs text-text-muted sm:text-sm">{f.nome}</p>
                  <p className="text-xs text-text-muted">{f.cidade}/{f.estado}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:max-w-[280px] sm:justify-end">
                <AdminToggleChip
                  active={f.featured}
                  activeLabel="Em alta"
                  inactiveLabel="Destacar"
                  onClick={() => toggleFacFeatured.mutate({ id: f.id, featured: !f.featured })}
                  activeClass="border-accent-yellow/40 bg-accent-yellow/15 text-accent-yellow"
                />
                <Button size="sm" variant="secondary" onClick={() => startEditFac(f)}>
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    toggleFacStatus.mutate({
                      id: f.id,
                      status: f.status === 'ATIVO' ? 'INATIVO' : 'ATIVO',
                    })
                  }
                >
                  {f.status === 'ATIVO' ? 'Desativar' : 'Ativar'}
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDeleteFac(f)}>
                  Excluir
                </Button>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  )

  const atlList = (
    <div className="space-y-3">
      {atleticas?.length === 0 ? (
        <Card className="p-6 text-center" hover={false}>
          <p className="text-sm text-text-muted">Nenhuma atlética cadastrada.</p>
        </Card>
      ) : (
        atleticas?.map((a) => (
          <Card key={a.id} className="p-4" hover={false}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                {a.logo ? (
                  <img src={a.logo} alt="" className="h-10 w-10 shrink-0 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/20 text-xs font-bold text-accent">
                    {a.sigla.slice(0, 2)}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-heading text-sm font-bold uppercase text-foreground">{a.sigla}</p>
                    <Badge variant={a.status === 'ATIVO' ? 'success' : 'danger'}>{a.status}</Badge>
                  </div>
                  <p className="truncate text-xs text-text-muted sm:text-sm">{a.nome}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:max-w-[280px] sm:justify-end">
                <AdminToggleChip
                  active={a.featured}
                  activeLabel="Destaque"
                  inactiveLabel="Destacar"
                  onClick={() => toggleAtlFeatured.mutate({ id: a.id, featured: !a.featured })}
                />
                <Button size="sm" variant="secondary" onClick={() => startEditAtl(a)}>
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    toggleAtlStatus.mutate({
                      id: a.id,
                      status: a.status === 'ATIVO' ? 'INATIVO' : 'ATIVO',
                    })
                  }
                >
                  {a.status === 'ATIVO' ? 'Desativar' : 'Ativar'}
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDeleteAtl(a)}>
                  Excluir
                </Button>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  )

  const inner = (
    <>
      <div className="mb-4 lg:hidden">
        <AdminTabs
          tabs={[
            { id: 'faculdades', label: 'Faculdades', count: faculdades?.length },
            { id: 'atleticas', label: 'Atléticas', count: atleticas?.length },
          ]}
          active={instTab}
          onChange={(id) => setInstTab(id as 'faculdades' | 'atleticas')}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className={instTab === 'atleticas' ? 'hidden xl:block' : ''}>
          <div className="mb-3 hidden items-center justify-between gap-3 xl:flex">
            <h3 className="font-heading text-sm font-bold uppercase text-foreground">Faculdades</h3>
            {!facFormOpen ? (
              <Button
                size="sm"
                variant="accent"
                onClick={() => {
                  resetFacForm()
                  setFacFormOpen(true)
                }}
              >
                + Nova
              </Button>
            ) : null}
          </div>
          {instTab === 'faculdades' && !facFormOpen ? (
            <div className="mb-3 flex justify-end xl:hidden">
              <Button
                size="sm"
                variant="accent"
                onClick={() => {
                  resetFacForm()
                  setFacFormOpen(true)
                }}
              >
                + Nova faculdade
              </Button>
            </div>
          ) : null}
          {facFormBlock}
          {facList}
        </div>

        <div className={instTab === 'faculdades' ? 'hidden xl:block' : ''}>
          <div className="mb-3 hidden items-center justify-between gap-3 xl:flex">
            <h3 className="font-heading text-sm font-bold uppercase text-foreground">Atléticas</h3>
            {!atlFormOpen ? (
              <Button
                size="sm"
                variant="accent"
                onClick={() => {
                  resetAtlForm()
                  setAtlFormOpen(true)
                }}
              >
                + Nova
              </Button>
            ) : null}
          </div>
          {instTab === 'atleticas' && !atlFormOpen ? (
            <div className="mb-3 flex justify-end xl:hidden">
              <Button
                size="sm"
                variant="accent"
                onClick={() => {
                  resetAtlForm()
                  setAtlFormOpen(true)
                }}
              >
                + Nova atlética
              </Button>
            </div>
          ) : null}
          {atlFormBlock}
          {atlList}
        </div>
      </div>
    </>
  )

  if (embedded) {
    return (
      <AdminSection
        title="Instituições"
        description="Faculdades e atléticas exibidas na plataforma."
      >
        {inner}
      </AdminSection>
    )
  }

  return (
    <Card className="p-4 sm:p-6">
      <h3 className="mb-4 font-heading text-sm font-bold uppercase text-foreground">Instituições</h3>
      {inner}
    </Card>
  )
}
