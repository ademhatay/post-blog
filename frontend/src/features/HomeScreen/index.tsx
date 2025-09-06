import PostsList from '@/features/posts/PostsList'
import CreatePostForm from '@/features/posts/CreatePostForm'
import Banner from '@/components/ui/banner/Banner'
import { useAuth } from '@/features/auth/AuthContext'
import { usePostEditor } from '@/features/posts/PostEditorContext'

const HomeScreen = () => {
  const { isAuthenticated } = useAuth()
  const { editing, clear } = usePostEditor()
  return (
    <div className="flex gap-8">
      <div className="flex-1 max-w-2xl">
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Akış</h2>
        <p className="text-gray-500" style={{ marginBottom: 16 }}>Son gönderiler</p>
        <div className="max-h-[600px] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f9fafb' }}>
          <PostsList />
        </div>
      </div>
      <aside className="flex-1 min-w-0">
        {isAuthenticated ? (
          editing ? (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>Gönderiyi Düzenle</h3>
              <CreatePostForm mode="edit" initial={{ title: editing.title, body: editing.body }} postId={editing.id} onCancel={clear} />
            </div>
          ) : (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>Yeni Gönderi</h3>
              <CreatePostForm />
            </div>
          )
        ) : (
          <Banner type="info" message="Paylaşım yapabilmek için giriş yapmanız gerekiyor." />
        )}
      </aside>
    </div>
  )
}

export default HomeScreen
