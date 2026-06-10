import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { fetchUserProfile } from '@/api'
import { useAuth } from '@/contexts/AuthContext'
import { profileSchema, type ProfileFormData } from '@/validations/auth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { LoadingState } from '@/components/ui/LoadingState'
import { ErrorState } from '@/components/ui/ErrorState'

export function ProfileForm() {
  const { user, updateProfile, isLoading } = useAuth()
  const queryClient = useQueryClient()

  const {
    data: profile,
    isLoading: profileLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: () => fetchUserProfile(user!.id),
    enabled: Boolean(user?.id),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        phone: profile.phone ?? '',
        bio: profile.bio ?? '',
      })
    }
  }, [profile, reset])

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile({
        name: data.name,
        phone: data.phone || undefined,
        bio: data.bio || undefined,
      })
      queryClient.invalidateQueries({ queryKey: ['user-profile', user?.id] })
      toast.success('Perfil atualizado!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao atualizar perfil')
    }
  }

  if (profileLoading) return <LoadingState message="Carregando perfil..." />

  if (isError) {
    return (
      <ErrorState
        message="Não foi possível carregar seu perfil."
        onRetry={() => refetch()}
      />
    )
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
          className="w-full rounded-xl border border-border/10 bg-surface/5 px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
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
