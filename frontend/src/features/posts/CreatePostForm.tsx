import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Input from '@/components/ui/input/input'
import Button from '@/components/ui/button/button'
import { http } from '@/lib/http'
import { ENDPOINTS } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

type FormValues = {
  title: string
  body?: string
}

const schema: yup.ObjectSchema<FormValues> = yup
  .object({
    title: yup.string().required('Başlık zorunludur').min(2, 'En az 2 karakter'),
    body: yup.string().optional(),
  })
  .required()

export default function CreatePostForm({
  mode = 'create',
  initial,
  postId,
  onCancel,
}: {
  mode?: 'create' | 'edit'
  initial?: Partial<FormValues>
  postId?: number | string
  onCancel?: () => void
}) {
  const qc = useQueryClient()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: yupResolver(schema), mode: 'onTouched', defaultValues: initial })

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (mode === 'edit' && postId != null) {
        return http.patch(ENDPOINTS.POSTS.UPDATE(Number(postId)), values)
      }
      return http.post(ENDPOINTS.POSTS.CREATE_ME, values)
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['posts', 'all'] })
      if (mode === 'edit') {
        reset({ title: '', body: '' })
        onCancel?.()
      } else {
        reset({ title: '', body: '' })
      }
    },
  })

  useEffect(() => {
    if (mode === 'edit') {
      reset({ title: initial?.title ?? '', body: initial?.body ?? '' })
    }
  }, [mode, initial?.title, initial?.body, reset])

  return (
    <form className="space-y-3" onSubmit={handleSubmit((v) => mutation.mutateAsync(v))}>
      <Input
        label="Başlık"
        placeholder="Gönderi başlığı"
        error={errors.title?.message}
        {...register('title')}
      />

      <div>
        <label className="input__label">İçerik</label>
        <textarea
          rows={6}
          className="w-full border rounded-md p-3 resize-none"
          placeholder="İstersen bir şeyler yaz..."
          {...register('body')}
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" variant="primary" radius="rounded" loading={mutation.isPending}>
          {mode === 'edit' ? 'Düzenle' : 'Yayınla'}
        </Button>
        {mode === 'edit' && onCancel ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset({ title: '', body: '' })
              onCancel?.()
            }}
          >
            İptal
          </Button>
        ) : null}
      </div>

      {mutation.isError ? (
        <div className="text-sm" style={{ color: '#991b1b' }}>
          {(mutation.error as Error).message || 'Gönderi oluşturulamadı'}
        </div>
      ) : null}
      {mutation.isSuccess ? (
        <div className="text-sm" style={{ color: '#166534' }}>
          {mode === 'edit' ? 'Gönderi güncellendi' : 'Gönderi oluşturuldu'}
        </div>
      ) : null}
    </form>
  )
}
