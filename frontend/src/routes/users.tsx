import { createFileRoute, useNavigate } from '@tanstack/react-router'
import UsersScreen from '@/features/UsersScreen'
import { useAuth } from '@/features/auth/AuthContext'
import { useEffect } from 'react'
import { useNotice } from '@/features/ui/NoticeContext'

function AdminOnlyUsers() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const { show } = useNotice()
  const isAdmin = isAuthenticated && String(user?.role).toLowerCase() === 'admin'
  useEffect(() => {
    if (!isAdmin) {
      show('warning', 'Bu sayfa yalnızca admin kullanıcılar içindir.', 5000)
      navigate({ to: '/' })
    }
  }, [isAdmin, navigate, show])
  if (!isAdmin) return null
  return <UsersScreen />
}

export const Route = createFileRoute('/users')({
  component: AdminOnlyUsers,
})

