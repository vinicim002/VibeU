import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import {
  fetchAllAtleticasAdmin,
  fetchAllFaculdadesAdmin,
  updateAtleticaStatus,
  updateFaculdadeStatus,
} from '@/api/mockApi'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { LoadingState } from '@/components/ui/LoadingState'

export function AdminInstitutions() {
  const queryClient = useQueryClient()

  const { data: faculdades, isLoading: facLoading } = useQuery({
    queryKey: ['admin-faculdades'],
    queryFn: fetchAllFaculdadesAdmin,
  })

  const { data: atleticas, isLoading: atlLoading } = useQuery({
    queryKey: ['admin-atleticas'],
    queryFn: fetchAllAtleticasAdmin,
  })

  const toggleFac = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ATIVO' | 'INATIVO' }) =>
      updateFaculdadeStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-faculdades'] })
      queryClient.invalidateQueries({ queryKey: ['faculdades'] })
      toast.success('Status da faculdade atualizado')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const toggleAtl = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ATIVO' | 'INATIVO' }) =>
      updateAtleticaStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-atleticas'] })
      queryClient.invalidateQueries({ queryKey: ['atleticas-all'] })
      toast.success('Status da atlética atualizado')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  if (facLoading || atlLoading) return <LoadingState />

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card className="p-6">
        <h3 className="font-heading text-sm font-bold uppercase text-foreground">Faculdades</h3>
        <div className="mt-4 space-y-3">
          {faculdades?.map((f) => (
            <div
              key={f.id}
              className="flex flex-col gap-3 rounded-xl border border-border/10 bg-surface/5 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                <img src={f.logo} alt="" className="h-8 w-8 shrink-0 rounded-full" />
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{f.sigla}</p>
                  <p className="text-xs text-text-muted">{f.cidade}/{f.estado}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
                <Badge variant={f.status === 'ATIVO' ? 'success' : 'danger'}>{f.status}</Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    toggleFac.mutate({
                      id: f.id,
                      status: f.status === 'ATIVO' ? 'INATIVO' : 'ATIVO',
                    })
                  }
                >
                  {f.status === 'ATIVO' ? 'Desativar' : 'Ativar'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-heading text-sm font-bold uppercase text-foreground">Atléticas</h3>
        <div className="mt-4 space-y-3 max-h-[480px] overflow-y-auto">
          {atleticas?.map((a) => (
            <div
              key={a.id}
              className="flex flex-col gap-3 rounded-xl border border-border/10 bg-surface/5 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img src={a.logo} alt="" className="h-8 w-8 shrink-0 rounded-full" />
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{a.nome}</p>
                  <p className="text-xs text-text-muted">{a.sigla}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
                <Badge variant={a.status === 'ATIVO' ? 'success' : 'danger'}>{a.status}</Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    toggleAtl.mutate({
                      id: a.id,
                      status: a.status === 'ATIVO' ? 'INATIVO' : 'ATIVO',
                    })
                  }
                >
                  {a.status === 'ATIVO' ? 'Desativar' : 'Ativar'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
