import { CalendarClock, Clock3, Mail, ShieldCheck } from 'lucide-react'
import type { UserProfile } from '@/types/profile'

type AccountInfoCardProps = {
  profile: UserProfile
  lastLogin: string
}

function formatDateTime(dateString: string) {
  if (!dateString) {
    return '-'
  }

  const date = new Date(dateString)

  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function formatRole(role: string) {
  if (!role) {
    return 'Pelanggan'
  }

  return role.charAt(0).toUpperCase() + role.slice(1)
}

export function AccountInfoCard({ profile, lastLogin }: AccountInfoCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-100/80">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">
          Informasi Akun
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Status akun customer</h2>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <AccountItem icon={Mail} label="Email" value={profile.email || '-'} />
        <AccountItem icon={ShieldCheck} label="Peran" value={formatRole(profile.role)} />
        <AccountItem icon={CalendarClock} label="Bergabung Sejak" value={formatDateTime(profile.created_at)} />
        <AccountItem icon={Clock3} label="Login Terakhir" value={lastLogin} />
      </div>
    </section>
  )
}

type AccountItemProps = {
  icon: typeof Mail
  label: string
  value: string
}

function AccountItem({ icon: Icon, label, value }: AccountItemProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 transition duration-200 hover:border-sky-200 hover:bg-sky-50/40">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-white p-2 shadow-sm">
          <Icon className="size-4 text-sky-600" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-700">{label}</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">{value}</p>
        </div>
      </div>
    </div>
  )
}
