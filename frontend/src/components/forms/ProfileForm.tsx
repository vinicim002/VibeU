import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'
import { profileSchema, type ProfileFormData } from '@/validations/auth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function ProfileForm() {
  const { user, updateProfile, isLoading } = useAuth()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    if (user) {
      reset({ name: user.name, phone: '', bio: '' })
    }
  }, [user, reset])

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data)
      toast.success('Perfil atualizado!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao atualizar perfil')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Nome"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="Telefone"
        placeholder="(11) 99999-9999"
        error={errors.phone?.message}
        {...register('phone')}
      />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="bio" className="text-xs font-medium uppercase tracking-wider text-text-muted">
          Bio
        </label>
        <textarea
          id="bio"
          rows={3}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-primary"
          {...register('bio')}
        />
        {errors.bio ? <span className="text-xs text-red-400">{errors.bio.message}</span> : null}
      </div>

      <Button type="submit" variant="primary" isLoading={isLoading}>
        Salvar alterações
      </Button>
    </form>
  )
}
