import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { eventSchema, type EventFormData } from '@/validations/auth'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'

interface EventFormProps {
  defaultValues?: Partial<EventFormData>
  onSubmit: (data: EventFormData) => Promise<void>
  isLoading?: boolean
  submitLabel?: string
}

const categoryOptions = [
  { value: 'FESTA', label: 'Festas Universitárias' },
  { value: 'OPEN_BAR', label: 'Open Bar' },
  { value: 'SHOW', label: 'Shows' },
  { value: 'ATLETICA', label: 'Atléticas' },
  { value: 'JOGOS_UNIVERSITARIOS', label: 'Jogos Universitários' },
  { value: 'RECEPCAO', label: 'Recepção de Calouros' },
  { value: 'WORKSHOP', label: 'Workshops' },
  { value: 'PALESTRA', label: 'Palestras' },
  { value: 'FEIRA_ACADEMICA', label: 'Feiras Acadêmicas' },
  { value: 'CULTURAL', label: 'Eventos Culturais' },
  { value: 'ESPORTIVO', label: 'Esportivo' },
  { value: 'ACADEMICO', label: 'Acadêmico' },
]

export function EventForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = 'Salvar evento',
}: EventFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      bannerUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80',
      capacity: 100,
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input label="Nome do evento" error={errors.name?.message} {...register('name')} />
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium uppercase tracking-wider text-text-muted">
          Descrição
        </label>
        <textarea
          rows={4}
          className="w-full rounded-xl border border-border/10 bg-surface/5 px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
          {...register('description')}
        />
        {errors.description ? (
          <span className="text-xs text-red-400">{errors.description.message}</span>
        ) : null}
      </div>
      <Select
        label="Categoria"
        options={categoryOptions}
        error={errors.category?.message}
        {...register('category')}
      />
      <Input label="URL do banner" error={errors.bannerUrl?.message} {...register('bannerUrl')} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Data" type="date" error={errors.date?.message} {...register('date')} />
        <Input label="Horário início" type="time" error={errors.time?.message} {...register('time')} />
      </div>
      <Input label="Horário fim" type="time" error={errors.endTime?.message} {...register('endTime')} />
      <Input label="Local" error={errors.location?.message} {...register('location')} />
      <Input label="Endereço" error={errors.address?.message} {...register('address')} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Cidade" error={errors.cidade?.message} {...register('cidade')} />
        <Input label="Estado (UF)" error={errors.estado?.message} {...register('estado')} maxLength={2} />
      </div>
      <Input
        label="Capacidade"
        type="number"
        error={errors.capacity?.message}
        {...register('capacity', { valueAsNumber: true })}
      />
      <Button type="submit" variant="primary" isLoading={isLoading}>
        {submitLabel}
      </Button>
    </form>
  )
}
