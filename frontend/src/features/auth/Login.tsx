import { Link } from '@tanstack/react-router'
import AuthLayout from './AuthLayout'
import Button from '@/components/ui/button/button'
import Input from '@/components/ui/input/input'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from './AuthContext'
import { useNavigate } from '@tanstack/react-router'

type LoginFormValues = {
  email: string
  password: string
}

const loginSchema: yup.ObjectSchema<LoginFormValues> = yup
  .object({
    email: yup.string().required('E-posta zorunludur').email('Geçerli bir e-posta girin'),
    password: yup.string().required('Şifre zorunludur').min(6, 'En az 6 karakter'),
  })
  .required()

const Login = () => {
  return (
    <AuthLayout title="Giriş Yap">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-1">Giriş Yap</h2>
        <p className="text-sm text-gray-500">
          Hesabın yok mu?{' '}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Kayıt Ol
          </Link>
        </p>
      </div>

      <LoginFormComponent />
    </AuthLayout>
  )
}

function LoginFormComponent() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: yupResolver(loginSchema), mode: 'onTouched' })

  const onSubmit = async (values: LoginFormValues) => {
    await login(values)
    navigate({ to: '/' })
  }

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

      <Button type="submit" block radius="rounded" variant="primary" loading={isSubmitting}>
        Giriş Yap
      </Button>
    </form>
  )
}

export default Login
