import { STORAGE_KEYS } from '@/constants/routes'
import { getItem, removeItem } from '@/utils/storage'

const API_BASE = import.meta.env.VITE_API_URL ?? ''

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
  errors?: string[]
}

export class ApiError extends Error {
  status: number
  errors: string[]

  constructor(message: string, status: number, errors: string[] = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

function buildUrl(path: string): string {
  const base = API_BASE.replace(/\/$/, '')
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized}`
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  auth = true,
): Promise<T> {
  const headers = new Headers(options.headers)
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }

  if (auth) {
    const token = getItem<string | null>(STORAGE_KEYS.TOKEN, null)
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }

  const response = await fetch(buildUrl(path), { ...options, headers })
  const contentType = response.headers.get('content-type')

  if (response.status === 204) {
    return undefined as T
  }

  if (!contentType?.includes('application/json')) {
    throw new ApiError('Resposta inválida do servidor', response.status)
  }

  const body = (await response.json()) as ApiEnvelope<T>

  if (!response.ok || !body.success) {
    throw new ApiError(body.message ?? 'Erro ao processar solicitação', response.status, body.errors ?? [])
  }

  return body.data
}

export function clearAuthToken(): void {
  removeItem(STORAGE_KEYS.TOKEN)
}
