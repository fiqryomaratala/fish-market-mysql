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

function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (
    field: 'name' | 'email' | 'password' | 'passwordConfirmation',
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (form.password !== form.passwordConfirmation) {
      setError('Password confirmation does not match.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const user = await register(form)
      navigate(getRedirectPath(user?.role ?? null), { replace: true })
    } catch {
      setError('Registration failed. Please review the form and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthFormShell
      title="Register"
      description="Daftarkan pengguna baru untuk customer flow atau onboarding internal sesuai kebutuhan role."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-200">Name</span>
          <input
            type="text"
            value={form.name}
            onChange={(event) => handleChange('name', event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300"
            placeholder="Your full name"
            required
          />
        </label>
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
            placeholder="Create a password"
            required
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-200">
            Confirm Password
          </span>
          <input
            type="password"
            value={form.passwordConfirmation}
            onChange={(event) =>
              handleChange('passwordConfirmation', event.target.value)
            }
            className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300"
            placeholder="Repeat your password"
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
          {isSubmitting ? 'Creating account...' : 'Register'}
        </button>
      </form>
    </AuthFormShell>
  )
}

export default RegisterPage
