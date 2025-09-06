import type { LucideIcon } from 'lucide-react'
import { Home, User, FilePlus2, LogOut, Users as UsersIcon } from 'lucide-react'

export type NavItem = {
  label: string
  to: string
  icon: LucideIcon
  tooltip: string
  isLogout?: boolean
}

export function getSidebarItems(params: { isAuthenticated: boolean; role?: 'admin' | 'user' | string }) {
  const items: NavItem[] = [
    { label: 'Anasayfa', to: '/', icon: Home, tooltip: 'Anasayfa' },
  ]
  if (params.isAuthenticated) {
    items.push({ label: 'Gönderi Oluştur', to: '/posts/new', icon: FilePlus2, tooltip: 'Yeni Post' })
    items.push({ label: 'Profil', to: '/profile', icon: User, tooltip: 'Profil' })
  }
  if (params.role === 'ADMIN') {
    items.push({ label: 'Kullanıcılar', to: '/users', icon: UsersIcon, tooltip: 'Tüm Kullanıcılar' })
  }
  if (params.isAuthenticated) {
    items.push({ label: 'Çıkış Yap', to: '/logout', icon: LogOut, tooltip: 'Çıkış Yap', isLogout: true })
  }
  return items
}
