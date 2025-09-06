import { useAuth } from '@/features/auth/AuthContext'
import Input from '@/components/ui/input/input'
import Button from '@/components/ui/button/button'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useMutation } from '@tanstack/react-query'
import { http } from '@/lib/http'
import { ENDPOINTS } from '@/lib/api'

const ProfileScreen = () => {
  const { user } = useAuth()

  type FormValues = { newPassword: string; confirm: string }
  const schema: yup.ObjectSchema<FormValues> = yup
    .object({
      newPassword: yup.string().required('Yeni şifre zorunludur').min(4, 'En az 4 karakter'),
      confirm: yup
        .string()
        .oneOf([yup.ref('newPassword')], 'Şifreler eşleşmiyor')
        .required('Tekrar şifre zorunludur'),
    })
    .required()

  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onTouched',
  })

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!user?.id) throw new Error('Kullanıcı bulunamadı')
      return http.patch(ENDPOINTS.USERS.UPDATE(Number(user.id)), {
        password: values.newPassword,
      })
    },
  })

  return (
    <div className="max-w-xl">
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Profil</h2>
      <p className="text-gray-600" style={{ marginBottom: 16 }}>
        Hesap bilgileriniz
      </p>

      <div className="rounded-xl border p-4" style={{ borderColor: '#e5e7eb', marginBottom: 20 }}>
        <div className="text-sm text-gray-500">E-posta</div>
        <div className="text-[15px]">{user?.email ?? '-'}</div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit((v) => mutation.mutateAsync(v))}>
        <Input
          type="password"
          label="Yeni Şifre"
          passwordToggle
          error={formState.errors.newPassword?.message}
          {...register('newPassword')}
        />
        <Input
          type="password"
          label="Yeni Şifre (Tekrar)"
          passwordToggle
          error={formState.errors.confirm?.message}
          {...register('confirm')}
        />

        <Button type="submit" variant="primary" radius="rounded" loading={mutation.isPending}>
          Şifreyi Güncelle
        </Button>
        {mutation.isSuccess ? (
          <div className="text-sm" style={{ color: '#15803d' }}>Şifre güncellendi</div>
        ) : null}
        {mutation.isError ? (
          <div className="text-sm" style={{ color: '#991b1b' }}>
            {(mutation.error as Error).message || 'Güncelleme başarısız'}
          </div>
        ) : null}
      </form>
    </div>
  )
}

export default ProfileScreen
