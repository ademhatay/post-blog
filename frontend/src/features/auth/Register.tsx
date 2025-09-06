import { Link } from '@tanstack/react-router'
import AuthLayout from './AuthLayout'
import Button from '@/components/ui/button/button'
import Input from '@/components/ui/input/input'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from './AuthContext'
import { useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'

type RegisterForm = {
  email: string
  password: string
}

const registerSchema: yup.ObjectSchema<RegisterForm> = yup
  .object({
    email: yup.string().required('E-posta zorunludur').email('Geçerli bir e-posta girin'),
    password: yup.string().required('Şifre zorunludur').min(4, 'En az 4 karakter'),
  })
  .required()

const Register = () => {
  return (
    <AuthLayout title="Kayıt Ol">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-1">Kayıt Ol</h2>
        <p className="text-sm text-gray-500">
          Zaten hesabın var mı?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Giriş Yap
          </Link>
        </p>
      </div>

      <RegisterFormComponent />
    </AuthLayout>
  )
}

function RegisterFormComponent() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const mutation = useMutation({
    mutationFn: (values: RegisterForm) => registerUser(values),
    onSuccess: () => navigate({ to: '/' }),
  })
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: yupResolver(registerSchema), mode: 'onTouched' })

  const onSubmit = async (values: RegisterForm) => mutation.mutateAsync(values)

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        id="email"
        type="email"
        label="E-posta"
        placeholder="ornek@mail.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        id="password"
        type="password"
        label="Şifre"
        placeholder="••••••••"
        passwordToggle
        error={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" block radius="rounded" variant="secondary" loading={isSubmitting || mutation.isPending}>
        Kayıt Ol
      </Button>
      {mutation.error ? (
        <p className="text-sm" style={{ color: '#e11d48' }}>
          {(mutation.error as Error).message || 'Kayıt başarısız'}
        </p>
      ) : null}
    </form>
  )
}

export default Register
