import { useQuery } from '@tanstack/react-query'
import { http } from '@/lib/http'
import { ENDPOINTS } from '@/lib/api'
import PostCard from './PostCard'
import { type Post } from '@/features/posts/types'

export default function PostsList() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['posts', 'all'],
    queryFn: async (): Promise<Post[]> => {
      const res = await http.get(ENDPOINTS.POSTS.GET_ALL)
      const arr = Array.isArray(res.data) ? res.data : res.data?.items ?? []
      return arr as Post[]
    },
    staleTime: 30_000,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500 text-lg">Yükleniyor...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-4 rounded-md" style={{ background: '#fee2e2' }}>
        <div className="text-sm" style={{ color: '#991b1b' }}>
          {(error as Error).message || 'Gönderiler yüklenemedi'}
        </div>
        <button className="mt-2 text-sm underline" onClick={() => refetch()} disabled={isFetching}>
          Tekrar dene
        </button>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return <div className="text-gray-500">Henüz gönderi yok</div>
  }

  return (
    <div className="space-y-3">
      {data.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  )
}
