import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { fetchAtleticas, fetchFaculdades } from '@/api'
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
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      bannerUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80',
      capacity: 100,
      faculdadeIds: [],
      atleticaIds: [],
      rulesText: '',
      lots: [{ name: '1º Lote', price: 0, quantity: 100 }],
      scheduleItems: [],
      ...defaultValues,
    },
  })

  const { fields: lotFields, append: appendLot, remove: removeLot } = useFieldArray({
    control,
    name: 'lots',
  })

  const { fields: scheduleFields, append: appendSchedule, remove: removeSchedule } =
    useFieldArray({
      control,
      name: 'scheduleItems',
    })

  const selectedFaculdades = watch('faculdadeIds') ?? []
  const selectedAtleticas = watch('atleticaIds') ?? []
  const watchedFaculdadeIds = selectedFaculdades.join(',')

  const { data: faculdades = [] } = useQuery({
    queryKey: ['faculdades'],
    queryFn: fetchFaculdades,
  })

  const { data: atleticas = [] } = useQuery({
    queryKey: ['atleticas-form', watchedFaculdadeIds],
    queryFn: () =>
      fetchAtleticas(selectedFaculdades.length === 1 ? selectedFaculdades[0] : undefined),
  })

  const filteredAtleticas =
    selectedFaculdades.length > 0
      ? atleticas.filter((a) => selectedFaculdades.includes(a.faculdadeId))
      : atleticas

  const toggleFaculdade = (id: string) => {
    const next = selectedFaculdades.includes(id)
      ? selectedFaculdades.filter((f) => f !== id)
      : [...selectedFaculdades, id]
    setValue('faculdadeIds', next, { shouldValidate: true })
    const validAtleticas = selectedAtleticas.filter((atlId) =>
      filteredAtleticas.some((a) => a.id === atlId),
    )
    if (validAtleticas.length !== selectedAtleticas.length) {
      setValue('atleticaIds', validAtleticas, { shouldValidate: true })
    }
  }

  const toggleAtletica = (id: string) => {
    const next = selectedAtleticas.includes(id)
      ? selectedAtleticas.filter((a) => a !== id)
      : [...selectedAtleticas, id]
    setValue('atleticaIds', next, { shouldValidate: true })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <section className="space-y-5">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
          Informações básicas
        </h3>
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
          label="Capacidade total"
          type="number"
          error={errors.capacity?.message}
          {...register('capacity', { valueAsNumber: true })}
        />
      </section>

      <section className="space-y-4">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
          Faculdades participantes
        </h3>
        {errors.faculdadeIds ? (
          <span className="text-xs text-red-400">{errors.faculdadeIds.message}</span>
        ) : null}
        <div className="grid gap-2 sm:grid-cols-2">
          {faculdades.map((f) => (
            <label
              key={f.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                selectedFaculdades.includes(f.id)
                  ? 'border-primary bg-primary/10'
                  : 'border-border/10 bg-surface/5 hover:border-border/20'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedFaculdades.includes(f.id)}
                onChange={() => toggleFaculdade(f.id)}
                className="accent-primary"
              />
              <img src={f.logo} alt="" className="h-8 w-8 rounded-full" />
              <span className="text-sm font-medium text-foreground">{f.sigla}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
          Atléticas organizadoras
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {filteredAtleticas.map((a) => (
            <label
              key={a.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                selectedAtleticas.includes(a.id)
                  ? 'border-accent bg-accent/10'
                  : 'border-border/10 bg-surface/5 hover:border-border/20'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedAtleticas.includes(a.id)}
                onChange={() => toggleAtletica(a.id)}
                className="accent-accent"
              />
              <img src={a.logo} alt="" className="h-8 w-8 rounded-full" />
              <span className="text-sm font-medium text-foreground">{a.sigla}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
            Lotes de ingresso
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => appendLot({ name: `${lotFields.length + 1}º Lote`, price: 0, quantity: 50 })}
          >
            + Lote
          </Button>
        </div>
        {lotFields.map((field, index) => (
          <div key={field.id} className="rounded-xl border border-border/10 bg-surface/5 p-4">
            <input type="hidden" {...register(`lots.${index}.id`)} />
            <div className="grid gap-3 sm:grid-cols-3">
              <Input
                label="Nome"
                error={errors.lots?.[index]?.name?.message}
                {...register(`lots.${index}.name`)}
              />
              <Input
                label="Preço (R$)"
                type="number"
                min="0"
                step="0.01"
                error={errors.lots?.[index]?.price?.message}
                {...register(`lots.${index}.price`, { valueAsNumber: true })}
              />
              <Input
                label="Quantidade"
                type="number"
                min="1"
                error={errors.lots?.[index]?.quantity?.message}
                {...register(`lots.${index}.quantity`, { valueAsNumber: true })}
              />
            </div>
            {lotFields.length > 1 ? (
              <button
                type="button"
                onClick={() => removeLot(index)}
                className="mt-3 text-xs text-red-400 hover:text-red-300"
              >
                Remover lote
              </button>
            ) : null}
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
            Cronograma
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => appendSchedule({ time: '20:00', title: '', description: '' })}
          >
            + Horário
          </Button>
        </div>
        {scheduleFields.length === 0 ? (
          <p className="text-sm text-text-muted">Nenhum horário adicionado.</p>
        ) : null}
        {scheduleFields.map((field, index) => (
          <div key={field.id} className="rounded-xl border border-border/10 bg-surface/5 p-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <Input label="Horário" type="time" {...register(`scheduleItems.${index}.time`)} />
              <Input label="Atividade" {...register(`scheduleItems.${index}.title`)} />
              <Input label="Descrição" {...register(`scheduleItems.${index}.description`)} />
            </div>
            <button
              type="button"
              onClick={() => removeSchedule(index)}
              className="mt-3 text-xs text-red-400 hover:text-red-300"
            >
              Remover
            </button>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
          Regras do evento
        </h3>
        <textarea
          rows={4}
          placeholder="Uma regra por linha..."
          className="w-full rounded-xl border border-border/10 bg-surface/5 px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
          {...register('rulesText')}
        />
      </section>

      <Button type="submit" variant="primary" isLoading={isLoading}>
        {submitLabel}
      </Button>
    </form>
  )
}
