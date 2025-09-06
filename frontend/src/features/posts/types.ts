export type RawPost = any

export interface Post {
  id: string | number
  userId: number
  title: string
  body: string
  user?: {
    id: number
    email: string
    role: string
  } | null
}