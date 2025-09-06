import { type Post } from '@/features/posts/types'
import { COLORS } from '@/lib/colors'
import { useAuth } from '@/features/auth/AuthContext'
import { usePostEditor } from '@/features/posts/PostEditorContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { http } from '@/lib/http'
import { ENDPOINTS } from '@/lib/api'

export default function PostCard({ post }: { post: Post }) {
  const { user, isAuthenticated } = useAuth()
  const qc = useQueryClient()
  const isAdmin = isAuthenticated && String(user?.role).toLowerCase() === 'admin'
  const isOwner = isAuthenticated && (Number(user?.id) === Number(post.user?.id ?? post.userId))
  const canDelete = isAdmin || isOwner
  const canEdit = canDelete
  const { startEdit } = usePostEditor()

  const delMutation = useMutation({
    mutationFn: async () => http.delete(ENDPOINTS.POSTS.DELETE(Number(post.id))),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['posts', 'all'] })
    },
  })

  const handleDelete = () => {
    const ok = window.confirm('Bu gönderiyi silmek istediğinize emin misiniz?')
    if (!ok) return
    delMutation.mutate()
  }

  return (
    <article className="p-4 bg-white rounded-xl border" style={{ borderColor: COLORS.ui.border }}>
      <div className="mb-2 flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-gray-900 mb-1">{post.title}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{post.user?.email || `User ID: ${post.userId}`}</span>
            {post.user?.role && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">{post.user.role}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {canEdit ? (
            <button
              className="text-blue-600 text-sm hover:underline"
              onClick={() => startEdit(post)}
              title={isAdmin ? 'Admin olarak düzenle' : 'Gönderiyi düzenle'}
            >
              Düzenle
            </button>
          ) : null}
          {canDelete ? (
            <button
              className="text-red-600 text-sm hover:underline disabled:opacity-60"
              onClick={handleDelete}
              disabled={delMutation.isPending}
              title={isAdmin ? 'Admin olarak sil' : 'Gönderiyi sil'}
            >
              Sil
            </button>
          ) : null}
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed">{post.body}</p>
      {delMutation.isError ? (
        <div className="mt-2 text-sm" style={{ color: '#991b1b' }}>
          {(delMutation.error as Error).message || 'Silinemedi'}
        </div>
      ) : null}
    </article>
  )
}
