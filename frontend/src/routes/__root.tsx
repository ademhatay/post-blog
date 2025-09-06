import { Outlet, createRootRouteWithContext, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import HomeLayout from '@/features/home/HomeLayout'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

function RootComponent() {
  const state = useRouterState()
  const path = state.location.pathname
  const isAuth = path.startsWith('/login') || path.startsWith('/register')
  const isDevelopment = import.meta.env.NODE_ENV === 'development'
  return (
    <>
      {isAuth ? (
        <Outlet />
      ) : (
        <HomeLayout>
          <Outlet />
        </HomeLayout>
      )}
      {isDevelopment && (
        <TanstackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
      )}
    </>
  )
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
})
