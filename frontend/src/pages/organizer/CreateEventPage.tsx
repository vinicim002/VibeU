import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { createEvent } from '@/api'
import { useAuth } from '@/contexts/AuthContext'
import { EventForm } from '@/components/forms/EventForm'
import { ROUTES } from '@/constants/routes'
import { formDataToEventInput } from '@/utils/eventForm'
import type { EventFormData } from '@/validations/auth'

export function CreateEventPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: (data: EventFormData) => createEvent(user!.id, formDataToEventInput(data)),
    onSuccess: () => {
      toast.success('Evento criado como rascunho!')
      navigate(ROUTES.ORGANIZER_DASHBOARD)
    },
    onError: (e: Error) => toast.error(e.message),
  })

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h2 className="font-heading text-xl font-bold uppercase text-foreground sm:text-2xl">
        Novo evento
      </h2>
      <p className="mt-2 text-sm text-text-muted">
        Preencha os dados, associe faculdades e atléticas, configure lotes e publique quando estiver pronto.
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
