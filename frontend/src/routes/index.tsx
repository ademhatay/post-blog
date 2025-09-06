import HomeScreen from '@/features/HomeScreen'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return <HomeScreen />
}
