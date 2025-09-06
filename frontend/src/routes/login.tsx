import Login from '@/features/auth/Login'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/features/auth/AuthContext'

function GuardedLogin() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  if (isAuthenticated) {
    navigate({ to: '/' })
    return null
  }
  return <Login />
}

export const Route = createFileRoute('/login')({
  component: GuardedLogin,
})
