import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { SessionUser } from '@/types'
import * as api from '@/api'

interface AuthContextValue {
  user: SessionUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<SessionUser>
  register: (data: { name: string; email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: { name: string; phone?: string; bio?: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() => api.getSession())
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const session = await api.login(email, password)
      setUser(session)
      return session
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(
    async (data: { name: string; email: string; password: string }) => {
      setIsLoading(true)
      try {
        const session = await api.register(data)
        setUser(session)
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await api.logout()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateProfile = useCallback(
    async (data: { name: string; phone?: string; bio?: string }) => {
      if (!user) throw new Error('Não autenticado')
      setIsLoading(true)
      try {
        const session = await api.updateProfile(user.id, data)
        setUser(session)
      } finally {
        setIsLoading(false)
      }
    },
    [user],
  )

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout, updateProfile }),
    [user, isLoading, login, register, logout, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
