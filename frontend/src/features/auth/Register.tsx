import { Link } from '@tanstack/react-router'
import AuthLayout from './AuthLayout'
import Button from '@/components/ui/button/button'
import Input from '@/components/ui/input/input'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from './AuthContext'
import { useNavigate } from '@tanstack/react-router'

type RegisterForm = {
  name: string
  email: string
  password: string
}

const registerSchema: yup.ObjectSchema<RegisterForm> = yup
  .object({
    name: yup.string().required('Ad Soyad zorunludur').min(2, 'En az 2 karakter'),
    email: yup.string().required('E-posta zorunludur').email('Geçerli bir e-posta girin'),
    password: yup.string().required('Şifre zorunludur').min(6, 'En az 6 karakter'),
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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: yupResolver(registerSchema), mode: 'onTouched' })

  const onSubmit = async (values: RegisterForm) => {
    await registerUser(values)
    navigate({ to: '/' })
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        id="name"
        type="text"
        label="Ad Soyad"
        placeholder="Adın Soyadın"
        error={errors.name?.message}
        {...register('name')}
      />

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

      <Button type="submit" block radius="rounded" variant="secondary" loading={isSubmitting}>
        Kayıt Ol
      </Button>
    </form>
  )
}

export default Register
