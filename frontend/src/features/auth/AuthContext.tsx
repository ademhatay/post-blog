import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { http, setAuthToken, clearAuthToken, storage } from '@/lib/http'
import { ENDPOINTS } from '@/lib/api'

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

  useEffect(() => {
    const init = async () => {
      try {
        if (!storage.accessToken) return
        const me = await http.get(ENDPOINTS.USERS.ME)
        const role: UserRole = (me.data?.role as UserRole) || 'user'
        setUser({ id: me.data?.id, email: me.data?.email, name: me.data?.name, role })
      } catch {
        clearAuthToken()
        setUser(null)
      }
    }
    void init()
  }, [])

  const login = useCallback(async ({ email, password }: { email: string; password: string }) => {
    const res = await http.post(ENDPOINTS.AUTH.LOGIN, { email, password })
    const { accessToken } = res.data || {}
    if (!accessToken) throw new Error('Giriş başarısız')
    setAuthToken(accessToken)
    const me = await http.get(ENDPOINTS.USERS.ME)
    const role: UserRole = (me.data?.role as UserRole) || (/admin/i.test(email) ? 'admin' : 'user')
    setUser({ id: me.data?.id, email: me.data?.email ?? email, name: me.data?.name, role })
  }, [])

  const register = useCallback(async ({ email, name, password }: { name?: string; email: string; password: string }) => {
    try {
      await http.post(ENDPOINTS.USERS.SIGNUP, { email, name, password })
      await login({ email, password })
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Kayıt yapılamadı'
      throw new Error(message)
    }
  }, [login])

  const logout = useCallback(() => {
    setUser(null)
    clearAuthToken()
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
