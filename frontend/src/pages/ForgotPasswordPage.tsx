import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/validations/auth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'

export function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 800))
    toast.info('Link de recuperação enviado (simulado). Verifique seu e-mail.')
  }

  return (
    <div>
      <h2 className="font-heading text-3xl font-bold uppercase tracking-wide text-white">
        Recuperar senha
      </h2>
      <p className="mt-2 text-sm text-text-muted">
        Informe seu e-mail para receber instruções.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <Input
          label="E-mail"
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
          Enviar link
        </Button>
        <Link to={ROUTES.LOGIN} className="block text-center text-sm text-text-muted hover:text-white">
          Voltar ao login
        </Link>
      </form>
    </div>
  )
}
