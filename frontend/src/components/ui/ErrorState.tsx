import { Button } from './Button'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  message = 'Algo deu errado. Tente novamente.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 px-8 py-16 text-center">
      <div className="mb-4 text-5xl">⚠️</div>
      <h3 className="font-heading text-xl font-semibold uppercase text-red-400">
        Erro
      </h3>
      <p className="mt-2 max-w-md text-sm text-text-muted">{message}</p>
      {onRetry ? (
        <Button variant="ghost" className="mt-6" onClick={onRetry}>
          Tentar novamente
        </Button>
      ) : null}
    </div>
  )
}
