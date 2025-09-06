import { createContext, useContext, useMemo, useState } from 'react'
import type { Post } from './types'

export type EditingPost = {
  id: number | string
  title: string
  body?: string
}

type Ctx = {
  editing: EditingPost | null
  startEdit: (post: Post) => void
  clear: () => void
}

const PostEditorContext = createContext<Ctx | undefined>(undefined)

export function PostEditorProvider({ children }: { children: React.ReactNode }) {
  const [editing, setEditing] = useState<EditingPost | null>(null)

  const value = useMemo<Ctx>(
    () => ({
      editing,
      startEdit: (post) => setEditing({ id: post.id as number | string, title: (post as any).title ?? '', body: (post as any).body ?? '' }),
      clear: () => setEditing(null),
    }),
    [editing],
  )

  return <PostEditorContext.Provider value={value}>{children}</PostEditorContext.Provider>
}

export function usePostEditor() {
  const ctx = useContext(PostEditorContext)
  if (!ctx) throw new Error('usePostEditor must be used within PostEditorProvider')
  return ctx
}

