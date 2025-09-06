import { createContext, useCallback, useContext, useMemo, useState } from 'react'

export type NoticeType = 'info' | 'success' | 'warning' | 'error'

type NoticeState = {
  type: NoticeType
  message: string
} | null

type NoticeContextType = {
  notice: NoticeState
  show: (type: NoticeType, message: string, autoHideMs?: number) => void
  clear: () => void
}

const NoticeContext = createContext<NoticeContextType | undefined>(undefined)

export function NoticeProvider({ children }: { children: React.ReactNode }) {
  const [notice, setNotice] = useState<NoticeState>(null)

  const clear = useCallback(() => setNotice(null), [])
  const show = useCallback((type: NoticeType, message: string, autoHideMs?: number) => {
    setNotice({ type, message })
    if (autoHideMs) {
      window.setTimeout(() => setNotice((n) => (n?.message === message ? null : n)), autoHideMs)
    }
  }, [])

  const value = useMemo(() => ({ notice, show, clear }), [notice, show, clear])
  return <NoticeContext.Provider value={value}>{children}</NoticeContext.Provider>
}

export function useNotice() {
  const ctx = useContext(NoticeContext)
  if (!ctx) throw new Error('useNotice must be used within NoticeProvider')
  return ctx
}

