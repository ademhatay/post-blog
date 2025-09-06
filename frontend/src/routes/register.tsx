import Register from '@/features/auth/Register'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/features/auth/AuthContext'

function GuardedRegister() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  if (isAuthenticated) {
    navigate({ to: '/' })
    return null
  }
  return <Register />
}

export const Route = createFileRoute('/register')({
  component: GuardedRegister,
})
