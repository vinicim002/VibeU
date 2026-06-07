import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { createEvent } from '@/api/mockApi'
import { useAuth } from '@/contexts/AuthContext'
import { EventForm } from '@/components/forms/EventForm'
import { ROUTES } from '@/constants/routes'
import type { EventFormData } from '@/validations/auth'
import type { EventCategory } from '@/types'

export function CreateEventPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: (data: EventFormData) =>
      createEvent(user!.id, {
        ...data,
        category: data.category as EventCategory,
        endTime: data.endTime,
      }),
    onSuccess: () => {
      toast.success('Evento criado como rascunho!')
      navigate(ROUTES.ORGANIZER_DASHBOARD)
    },
    onError: (e: Error) => toast.error(e.message),
  })

  return (
    <div className="max-w-2xl">
      <h2 className="font-heading text-2xl font-bold uppercase text-white">
        Novo evento
      </h2>
      <p className="mt-2 text-sm text-text-muted">
        O evento será criado como rascunho. Publique quando estiver pronto.
      </p>
      <div className="mt-8">
        <EventForm
          onSubmit={async (data) => {
            await mutation.mutateAsync(data)
          }}
          isLoading={mutation.isPending}
          submitLabel="Criar evento"
        />
      </div>
    </div>
  )
}
