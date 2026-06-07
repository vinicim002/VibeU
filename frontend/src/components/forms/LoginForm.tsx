import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'
import { loginSchema, type LoginFormData } from '@/validations/auth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'
import { DEMO_CREDENTIALS } from '@/constants/seedData'

import type { SessionUser } from '@/types'

interface LoginFormProps {
  onSuccess?: (user: SessionUser) => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login, isLoading } = useAuth()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const session = await login(data.email, data.password)
      toast.success('Login realizado com sucesso!')
      onSuccess?.(session)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao fazer login')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="E-mail"
        type="email"
        placeholder="seu@email.edu"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Senha"
        type="password"
        placeholder="••••••"
        error={errors.password?.message}
        {...register('password')}
      />

      <div className="flex items-center justify-between text-sm">
        <Link to={ROUTES.FORGOT_PASSWORD} className="text-text-muted hover:text-accent">
          Esqueceu a senha?
        </Link>
      </div>

      <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
        Entrar
      </Button>

      <div className="rounded-xl border border-white/5 bg-white/5 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
          Contas demo (localStorage)
        </p>
        <div className="flex flex-wrap gap-2">
          {DEMO_CREDENTIALS.map((cred) => (
            <button
              key={cred.email}
              type="button"
              onClick={() => {
                setValue('email', cred.email)
                setValue('password', cred.password)
              }}
              className="rounded-full border border-white/10 px-3 py-1 text-xs text-text-muted transition hover:border-primary hover:text-white"
            >
              {cred.role}
            </button>
          ))}
        </div>
      </div>
    </form>
  )
}
