import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthFormShell } from '@/components/forms/AuthFormShell'
import { useAuth } from '@/contexts/AuthContext'

function getRedirectPath(role: string | null) {
  if (role === 'admin') {
    return '/admin'
  }

  if (role === 'customer') {
    return '/customer'
  }

  return '/'
}

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field: 'email' | 'password', value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const user = await login(form)
      navigate(getRedirectPath(user?.role ?? null), { replace: true })
    } catch {
      setError('Login failed. Please check your credentials and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthFormShell
      title="Login"
      description="Masuk ke sistem untuk mengelola marketplace, pelanggan, dan operasional budidaya."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-200">Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => handleChange('email', event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300"
            placeholder="you@example.com"
            required
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-200">Password</span>
          <input
            type="password"
            value={form.password}
            onChange={(event) => handleChange('password', event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300"
            placeholder="Enter your password"
            required
          />
        </label>

        {error ? (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </AuthFormShell>
  )
}

export default LoginPage
