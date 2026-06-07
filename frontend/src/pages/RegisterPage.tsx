import { Link, useNavigate } from 'react-router-dom'
import { RegisterForm } from '@/components/forms/RegisterForm'
import { ROUTES } from '@/constants/routes'

export function RegisterPage() {
  const navigate = useNavigate()

  return (
    <div>
      <h2 className="font-heading text-3xl font-bold uppercase tracking-wide text-white">
        Criar conta
      </h2>
      <p className="mt-2 text-sm text-text-muted">
        Já tem conta?{' '}
        <Link to={ROUTES.LOGIN} className="text-accent hover:underline">
          Faça login
        </Link>
      </p>
      <div className="mt-8">
        <RegisterForm onSuccess={() => navigate(ROUTES.PARTICIPANT_DASHBOARD)} />
      </div>
    </div>
  )
}
