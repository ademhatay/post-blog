import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import './styles.css'
import { AuthProvider } from './features/auth/AuthContext'
import { NoticeProvider } from './features/ui/NoticeContext'
import { PostEditorProvider } from './features/posts/PostEditorContext'

// Create a new router instance

const TanStackQueryProviderContext = TanStackQueryProvider.getContext()
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
      <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
        <AuthProvider>
          <NoticeProvider>
            <PostEditorProvider>
              <RouterProvider router={router} />
            </PostEditorProvider>
          </NoticeProvider>
        </AuthProvider>
      </TanStackQueryProvider.Provider>
  )
}
