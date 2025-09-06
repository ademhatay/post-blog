import { type ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { COLORS } from '@/lib/colors'

type AuthLayoutProps = {
  title: string
  children: ReactNode
}

const AuthLayout = ({ title, children }: AuthLayoutProps) => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen w-full flex">
      <div
        className="flex-[2] text-white flex flex-col items-center justify-center p-8 relative"
        style={{ backgroundColor: COLORS.main }}
      >
        <h1 className="text-4xl font-semibold tracking-tight text-center mb-8">
          {title}
        </h1>
        <button
          onClick={() => navigate({ to: '/' })}
          className="px-6 cursor-pointer py-2 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Misafir Modu
        </button>
      </div>
      <div className="flex-1 bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  )
}

export default AuthLayout
