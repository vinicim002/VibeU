import { Spinner } from './Spinner'

export function LoadingState({ message = 'Carregando...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <Spinner size="lg" />
      <p className="text-sm text-text-muted">{message}</p>
    </div>
  )
}
