import { Mail, MapPin, Phone, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { User } from '@/types/auth'

type ProfileCardProps = {
  user: User
  phone: string
  address: string
}

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function ProfileCard({ user, phone, address }: ProfileCardProps) {
  const navigate = useNavigate()

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
        Profile Summary
      </p>
      <div className="mt-5 flex items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-sky-400 to-emerald-300 text-xl font-bold text-slate-950">
          {getInitials(user.name)}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{user.name}</h2>
          <p className="text-sm text-slate-500">{user.role}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 size-4 text-blue-600" />
          <div>
            <p className="text-sm font-semibold text-slate-700">Email</p>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Phone className="mt-0.5 size-4 text-emerald-600" />
          <div>
            <p className="text-sm font-semibold text-slate-700">Phone</p>
            <p className="text-sm text-slate-500">{phone}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 size-4 text-cyan-600" />
          <div>
            <p className="text-sm font-semibold text-slate-700">Address</p>
            <p className="text-sm leading-6 text-slate-500">{address}</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate('/customer/profile')}
        className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
      >
        <UserRound className="size-4" />
        Edit Profile
      </button>
    </section>
  )
}
