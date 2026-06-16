import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Eye, EyeOff, LoaderCircle, LogIn, Mail, LockKeyhole } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { AuthFormShell } from '@/components/forms/AuthFormShell'
import { getDefaultPathByRole } from '@/config/navigation'
import { useAuth } from '@/hooks/useAuth'

const REMEMBER_EMAIL_KEY = 'remembered_email'

const loginSchema = z.object({
  email: z.string().min(1, 'Email wajib.').email('Format email tidak valid.'),
  password: z.string().min(8, 'Password minimal 8 karakter.'),
  rememberMe: z.boolean(),
})

type LoginFormValues = z.infer<typeof loginSchema>

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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
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
      navigate(redirectTo ?? getDefaultPathByRole(user.role), { replace: true })
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
          <label
            htmlFor="email"
            className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
          >
            Email
          </label>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm shadow-slate-200/70 transition duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus-within:border-blue-200 focus-within:ring-4 focus-within:ring-blue-100">
            <Mail className="h-4 w-4 text-blue-500/70" />
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="autofill-safe w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              {...register('email')}
            />
          </div>
          {errors.email ? (
            <p className="text-sm text-rose-500">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
          >
            Password
          </label>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm shadow-slate-200/70 transition duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus-within:border-blue-200 focus-within:ring-4 focus-within:ring-blue-100">
            <LockKeyhole className="h-4 w-4 text-blue-500/70" />
            <input
              id="password"
              type={isPasswordVisible ? 'text' : 'password'}
              placeholder="Masukkan password Anda"
              className="autofill-safe w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible((current) => !current)}
              className="inline-flex items-center justify-center text-slate-400 transition hover:text-blue-600"
              aria-label={isPasswordVisible ? 'Sembunyikan password' : 'Tampilkan password'}
              aria-pressed={isPasswordVisible}
            >
              {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password ? (
            <p className="text-sm text-rose-500">{errors.password.message}</p>
          ) : null}
        </div>

        <label className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-600 shadow-sm shadow-slate-200/60 transition hover:border-blue-200">
          <span className="font-medium text-slate-700">Remember Me</span>
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 bg-white text-blue-600"
            {...register('rememberMe')}
          />
        </label>

        {Object.keys(errors).length > 0 ? (
          <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm shadow-rose-100/80">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Periksa kembali form login Anda sebelum melanjutkan.</span>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
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

        <p className="text-center text-sm text-slate-500">
          Belum punya akun?{' '}
          <Link to="/register" className="font-semibold text-blue-600 transition hover:text-blue-700">
            Register
          </Link>
        </p>
      </form>
    </AuthFormShell>
  )
}

export default LoginPage
