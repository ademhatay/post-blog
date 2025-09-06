import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { http } from '@/lib/http'
import { ENDPOINTS } from '@/lib/api'
import { useAuth } from '@/features/auth/AuthContext'

type UserRow = {
  id: number | string
  email: string
  role?: string
  name?: string
}

export default function UsersScreen() {
  const qc = useQueryClient()
  const { user } = useAuth()
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['users', 'list'],
    queryFn: async (): Promise<UserRow[]> => {
      const res = await http.get(ENDPOINTS.USERS.LIST)
      const arr = Array.isArray(res.data) ? res.data : res.data?.items ?? []
      return arr as UserRow[]
    },
    staleTime: 30_000,
  })

  const delMutation = useMutation({
    mutationFn: async (id: number | string) => {
      return http.delete(ENDPOINTS.USERS.DELETE(Number(id)))
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['users', 'list'] })
      await qc.invalidateQueries({ queryKey: ['posts', 'all'] })
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 rounded-md animate-pulse" style={{ background: '#f3f4f6' }} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-3 rounded-md" style={{ background: '#fee2e2', color: '#991b1b' }}>
        {(error as Error).message || 'Kullanıcılar yüklenemedi'}
        <button className="ml-2 underline" onClick={() => refetch()} disabled={isFetching}>
          Tekrar dene
        </button>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return <div className="text-gray-500">Kullanıcı bulunamadı</div>
  }

  return (
    <div className="max-w-2xl">
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Kullanıcılar</h2>
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: '#e5e7eb' }}>
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-sm text-gray-600">ID</th>
              <th className="p-3 text-sm text-gray-600">E-posta</th>
              <th className="p-3 text-sm text-gray-600">Rol</th>
            </tr>
          </thead>
          <tbody>
            {data.map((u) => (
              <tr key={u.id} className="border-t" style={{ borderColor: '#e5e7eb' }}>
                <td className="p-3 text-sm text-gray-800">{u.id}</td>
                <td className="p-3 text-sm text-gray-800">{u.email}</td>
                <td className="p-3 text-sm text-gray-500">{u.role ?? '-'}</td>
                <td className="p-3 text-sm text-right">
                  {user?.id !== u.id && (
                    <button
                      className="text-red-600 hover:underline disabled:opacity-60"
                      onClick={() => {
                        const ok = window.confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')
                        if (!ok) return
                        delMutation.mutate(u.id)
                      }}
                      disabled={delMutation.isPending}
                    >
                      Sil
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {delMutation.isError ? (
        <div className="mt-3 text-sm" style={{ color: '#991b1b' }}>
          {(delMutation.error as Error).message || 'Silme işlemi başarısız'}
        </div>
      ) : null}
      {delMutation.isSuccess ? (
        <div className="mt-3 text-sm" style={{ color: '#166534' }}>Kullanıcı silindi</div>
      ) : null}
    </div>
  )
}
