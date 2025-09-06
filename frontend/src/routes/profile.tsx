import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profile')({
  component: () => (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Profil</h2>
      <p>Profil sayfası</p>
    </div>
  ),
})
