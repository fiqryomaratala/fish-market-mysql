import { useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, LoaderCircle, LogIn, Mail, LockKeyhole } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { AuthFormShell } from '@/components/forms/AuthFormShell'
import { useAuth } from '@/hooks/useAuth'

const REMEMBER_EMAIL_KEY = 'remembered_email'

const loginSchema = z.object({
  email: z.string().min(1, 'Email wajib.').email('Format email tidak valid.'),
  password: z.string().min(8, 'Password minimal 8 karakter.'),
  rememberMe: z.boolean(),
})

type LoginFormValues = z.infer<typeof loginSchema>

function getRedirectPath(role?: string) {
  if (role === 'admin') {
    return '/admin'
  }

  if (role === 'customer') {
    return '/customer'
  }

  return '/'
}

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

  return 'Login gagal. Periksa kembali email dan password Anda.'
}

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const rememberedEmail = useMemo(() => localStorage.getItem(REMEMBER_EMAIL_KEY) ?? '', [])
  const redirectTo =
    typeof location.state === 'object' &&
    location.state !== null &&
    'from' in location.state &&
    typeof location.state.from === 'object' &&
    location.state.from !== null &&
    'pathname' in location.state.from &&
    typeof location.state.from.pathname === 'string'
      ? location.state.from.pathname
      : null

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: rememberedEmail,
      password: '',
      rememberMe: Boolean(rememberedEmail),
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      const user = await login({
        email: values.email,
        password: values.password,
      })

      if (values.rememberMe) {
        localStorage.setItem(REMEMBER_EMAIL_KEY, values.email)
      } else {
        localStorage.removeItem(REMEMBER_EMAIL_KEY)
      }

      toast.success(`Selamat datang kembali, ${user.name}.`)
      navigate(redirectTo ?? getRedirectPath(user.role), { replace: true })
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  })

  return (
    <AuthFormShell
      title="Login"
      description="Masuk untuk mengelola operasional pasar ikan, stok produk, dan akses dashboard sesuai role Anda."
    >
      <form className="space-y-5" onSubmit={onSubmit}>
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
              placeholder="Masukkan password Anda"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              {...register('password')}
            />
          </div>
          {errors.password ? (
            <p className="text-sm text-rose-300">{errors.password.message}</p>
          ) : null}
        </div>

        <label className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
          <span>Remember Me</span>
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-white/20 bg-slate-900 text-cyan-300"
            {...register('rememberMe')}
          />
        </label>

        {Object.keys(errors).length > 0 ? (
          <div className="flex items-start gap-3 rounded-xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-100 shadow-lg">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Periksa kembali form login Anda sebelum melanjutkan.</span>
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
              <span>Logging in...</span>
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </>
          )}
        </button>

        <p className="text-center text-sm text-slate-400">
          Belum punya akun?{' '}
          <Link to="/register" className="font-semibold text-cyan-300 hover:text-cyan-200">
            Register
          </Link>
        </p>
      </form>
    </AuthFormShell>
  )
}

export default LoginPage
