import { type ReactNode } from 'react'
import { COLORS } from '@/lib/colors'

type AuthLayoutProps = {
  title: string
  children: ReactNode
}

const AuthLayout = ({ title, children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full flex">
      <div
        className="flex-[2] text-white flex items-center justify-center p-8"
        style={{ backgroundColor: COLORS.main }}
      >
        <h1 className="text-4xl font-semibold tracking-tight text-center">
          {title}
        </h1>
      </div>
      <div className="flex-1 bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  )
}

export default AuthLayout
