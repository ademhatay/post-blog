import CreatePostScreen from '@/features/CreatePostScreen'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/posts/new')({
  component: App,
})

function App() {
  return <CreatePostScreen />
}