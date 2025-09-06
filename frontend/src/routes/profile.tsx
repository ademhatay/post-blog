import { createFileRoute, useNavigate } from '@tanstack/react-router'
import ProfileScreen from '@/features/ProfileScreen'
import { useAuth } from '@/features/auth/AuthContext'
import { useEffect } from 'react'
import { useNotice } from '@/features/ui/NoticeContext'

function ProtectedProfile() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { show } = useNotice()
  useEffect(() => {
    if (!isAuthenticated) {
      show('warning', 'Profil sayfasını görebilmek için giriş yapmanız gerekir.', 5000)
      navigate({ to: '/' })
    }
  }, [isAuthenticated, navigate, show])
  if (!isAuthenticated) return null
  return <ProfileScreen />
}

export const Route = createFileRoute('/profile')({
  component: ProtectedProfile,
})
