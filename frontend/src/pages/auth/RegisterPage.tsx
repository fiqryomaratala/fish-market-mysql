import { Link, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertCircle,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  User as UserIcon,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { AuthFormShell } from '@/components/forms/AuthFormShell'
import { getDefaultPathByRole } from '@/config/navigation'
import { useAuth } from '@/hooks/useAuth'

const registerSchema = z
  .object({
    name: z.string().min(1, 'Nama wajib diisi.'),
    email: z.string().min(1, 'Email wajib.').email('Format email tidak valid.'),
    password: z.string().min(8, 'Password minimal 8 karakter.'),
    confirmPassword: z.string().min(8, 'Confirm Password minimal 8 karakter.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Confirm Password harus sama.',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

function getErrorMessage(error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response &&
    typeof error.response.data === 'object' &&
    error.response.data !== null &&
    'message' in error.response.data &&
    typeof error.response.data.message === 'string'
  ) {
    return error.response.data.message
  }

  return 'Registrasi gagal. Silakan cek data Anda lalu coba lagi.'
}

function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      const user = await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      })

      toast.success('Registrasi berhasil. Akun Anda langsung aktif.')
      navigate(getDefaultPathByRole(user.role), { replace: true })
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  })

  return (
    <AuthFormShell
      title="Register"
      description="Buat akun baru dengan validasi yang aman dan alur autentikasi yang langsung terhubung ke backend Gin + JWT."
    >
      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-slate-200">
            Name
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 shadow-lg shadow-slate-950/20 transition focus-within:border-cyan-300">
            <UserIcon className="h-4 w-4 text-cyan-300" />
            <input
              id="name"
              type="text"
              placeholder="Nama lengkap"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              {...register('name')}
            />
          </div>
          {errors.name ? (
            <p className="text-sm text-rose-300">{errors.name.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-200">
            Email
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 shadow-lg shadow-slate-950/20 transition focus-within:border-cyan-300">
            <Mail className="h-4 w-4 text-cyan-300" />
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              {...register('email')}
            />
          </div>
          {errors.email ? (
            <p className="text-sm text-rose-300">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-slate-200">
            Password
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 shadow-lg shadow-slate-950/20 transition focus-within:border-cyan-300">
            <LockKeyhole className="h-4 w-4 text-cyan-300" />
            <input
              id="password"
              type="password"
              placeholder="Minimal 8 karakter"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              {...register('password')}
            />
          </div>
          {errors.password ? (
            <p className="text-sm text-rose-300">{errors.password.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-200">
            Confirm Password
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 shadow-lg shadow-slate-950/20 transition focus-within:border-cyan-300">
            <ShieldCheck className="h-4 w-4 text-cyan-300" />
            <input
              id="confirmPassword"
              type="password"
              placeholder="Ulangi password"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              {...register('confirmPassword')}
            />
          </div>
          {errors.confirmPassword ? (
            <p className="text-sm text-rose-300">{errors.confirmPassword.message}</p>
          ) : null}
        </div>

        {Object.keys(errors).length > 0 ? (
          <div className="flex items-start gap-3 rounded-xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-100 shadow-lg">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Masih ada validasi yang perlu diperbaiki pada form registrasi.</span>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-900/30 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <span>Register</span>
          )}
        </button>

        <p className="text-center text-sm text-slate-400">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-semibold text-cyan-300 hover:text-cyan-200">
            Login
          </Link>
        </p>
      </form>
    </AuthFormShell>
  )
}

export default RegisterPage
