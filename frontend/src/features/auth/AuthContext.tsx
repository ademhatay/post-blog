import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type UserRole = 'admin' | 'user'

export type AuthUser = {
  id?: string | number
  email: string
  name?: string
  role: UserRole
}

type AuthContextType = {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (values: { email: string; password: string }) => Promise<void>
  register: (values: { name?: string; email: string; password: string }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'app-auth-state'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as { user: AuthUser | null }
        if (parsed?.user) setUser(parsed.user)
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user }))
    } catch {}
  }, [user])

  const login = useCallback(async ({ email }: { email: string; password: string }) => {
    const role: UserRole = /admin/i.test(email) ? 'admin' : 'user'
    setUser({ email, role })
  }, [])

  const register = useCallback(async ({ email, name }: { name?: string; email: string; password: string }) => {
    const role: UserRole = 'user'
    setUser({ email, name, role })
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const value = useMemo<AuthContextType>(
    () => ({ user, isAuthenticated: !!user, login, register, logout }),
    [user, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
