import { useMemo } from 'react'
import { getSidebarItems, type NavItem } from './sidebar.config'
import './home-layout.css'
import logo from '@/logo.svg'
import { useRouterState, useNavigate } from '@tanstack/react-router'
import Button from '@/components/ui/button/button'
import { useAuth } from '@/features/auth/AuthContext'
import Banner from '@/components/ui/banner/Banner'
import { useNotice } from '@/features/ui/NoticeContext'

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const items = useMemo(() => getSidebarItems({ isAuthenticated, role: user?.role }), [isAuthenticated, user?.role])
  const regularItems = useMemo(() => items.filter((i) => !i.isLogout), [items])
  const { notice, clear } = useNotice()

  const getItemClassName = (item: NavItem, index: number) => {
    const classes = ['list']
    if (index === activeIndex && !item.isLogout) classes.push('active')
    if (item.isLogout) classes.push('logout-item')
    return classes.join(' ')
  }


  const routerState = useRouterState()
  const path = routerState.location.pathname
  const activeIndex = useMemo(() => {
    const idx = regularItems.findIndex((item) => (item.to === '/' ? path === '/' : path.startsWith(item.to)))
    return Math.max(0, idx)
  }, [path, regularItems])

  const getCurrentPageName = () => {
    const path = routerState.location.pathname
    const currentItem = items.find((item) =>
      item.to === '/' ? path === '/' : path.startsWith(item.to)
    )
    return currentItem?.label || 'Sayfa Bulunamadı'
  }

  const addRipple = (el: HTMLElement) => {
    const ripple = document.createElement('div')
    ripple.className = 'ripple-effect'
    el.appendChild(ripple)

    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.remove()
      }
    }, 600)
  }

  const handleLogout = async () => {
    const confirmed = window.confirm('Çıkış yapmak istediğinize emin misiniz?')
    if (!confirmed) return
    logout()
    clear()
    navigate({ to: '/' })
  }

  const onItemClick = (_index: number, item: NavItem, e: React.MouseEvent) => {
    e.preventDefault()
    const target = e.currentTarget as HTMLElement
    addRipple(target)

    if (item.isLogout) {
      handleLogout()
      return
    }
    navigate({ to: item.to })
  }

  return (
    <div>
      <aside className="navigation">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <ul className={`active-${activeIndex}`}>
          <div className="curve-bottom"></div>
          {items.map((item, i) => (
            <li
              key={item.label}
              className={getItemClassName(item, i)}
              data-index={i}
            >
              {item.isLogout ? (
                <button className="logout-button" onClick={(e) => onItemClick(i, item, e)}>
                  <span className="icon">
                    <item.icon size={24} />
                  </span>
                  <span className="title">{item.label}</span>
                  <div className="tooltip">{item.tooltip}</div>
                </button>
              ) : (
                <a href="#" onClick={(e) => onItemClick(i, item, e)}>
                  <span className="icon">
                    <item.icon size={24} />
                  </span>
                  <span className="title">{item.label}</span>
                  <div className="tooltip">{item.tooltip}</div>
                </a>
              )}
            </li>
          ))}
        </ul>
      </aside>

      <div className="app-shell">
        <header className="app-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <strong>{getCurrentPageName()}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isAuthenticated && user ? (
              <span style={{ fontSize: 14 }}>{user.email}</span>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/login' })}>
                  Giriş Yap
                </Button>
                <Button variant="primary" size="sm" onClick={() => navigate({ to: '/register' })}>
                  Kayıt Ol
                </Button>
              </>
            )}
          </div>
        </header>

        <main className="app-content">
          {notice ? (
            <div style={{ marginBottom: 12 }}>
              <Banner type={notice.type} message={notice.message} onClose={clear} />
            </div>
          ) : null}
          {children}
        </main>
      </div>
    </div>
  )
}
