import CreatePostScreen from '@/features/CreatePostScreen'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/features/auth/AuthContext'
import { useEffect } from 'react'
import { useNotice } from '@/features/ui/NoticeContext'

function ProtectedCreatePost() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { show } = useNotice()
  useEffect(() => {
    if (!isAuthenticated) {
      show('warning', 'Yeni gönderi oluşturabilmek için giriş yapmanız gerekir.', 5000)
      navigate({ to: '/' })
    }
  }, [isAuthenticated, navigate, show])
  if (!isAuthenticated) return null
  return <CreatePostScreen />
}

export const Route = createFileRoute('/posts/new')({
  component: ProtectedCreatePost,
})
