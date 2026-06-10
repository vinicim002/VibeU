import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { fetchOrganizerEventById, updateOrganizerEvent } from '@/api'
import { useAuth } from '@/contexts/AuthContext'
import { EventForm } from '@/components/forms/EventForm'
import { LoadingState } from '@/components/ui/LoadingState'
import { ErrorState } from '@/components/ui/ErrorState'
import { ROUTES } from '@/constants/routes'
import { eventToFormData, formDataToEventInput } from '@/utils/eventForm'
import type { EventFormData } from '@/validations/auth'

export function EditEventPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data: event, isPending, isError, refetch } = useQuery({
    queryKey: ['organizer-event', user?.id, id],
    queryFn: () => fetchOrganizerEventById(user!.id, id!),
    enabled: !!user && !!id,
  })

  const mutation = useMutation({
    mutationFn: (data: EventFormData) =>
      updateOrganizerEvent(user!.id, id!, formDataToEventInput(data)),
    onSuccess: () => {
      toast.success('Evento atualizado!')
      navigate(ROUTES.ORGANIZER_DASHBOARD)
    },
    onError: (e: Error) => toast.error(e.message),
  })

  if (isPending) return <LoadingState message="Carregando evento..." />
  if (isError || !event) {
    return (
      <ErrorState
        message="Evento não encontrado ou você não tem permissão para editá-lo."
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h2 className="font-heading text-xl font-bold uppercase text-foreground sm:text-2xl">
        Editar evento
      </h2>
      <p className="mt-2 text-sm text-text-muted">{event.name}</p>
      <div className="mt-8">
        <EventForm
          defaultValues={eventToFormData(event)}
          onSubmit={async (data) => {
            await mutation.mutateAsync(data)
          }}
          isLoading={mutation.isPending}
          submitLabel="Salvar alterações"
        />
      </div>
    </div>
  )
}
