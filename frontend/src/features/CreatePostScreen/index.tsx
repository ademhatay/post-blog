import CreatePostForm from '@/features/posts/CreatePostForm'

const CreatePostScreen = () => {
  return (
    <div className="max-w-xl">
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Gönderi Oluştur</h2>
      <CreatePostForm />
    </div>
  )
}

export default CreatePostScreen
