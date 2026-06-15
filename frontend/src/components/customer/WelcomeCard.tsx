import { CalendarDays, Mail, ShieldCheck, UserRound } from 'lucide-react'
import type { User } from '@/types/auth'

type WelcomeCardProps = {
  user: User
}

function getGreeting() {
  const hour = new Date().getHours()

  if (hour < 12) {
    return 'Good Morning'
  }

  if (hour < 18) {
    return 'Good Afternoon'
  }

  return 'Good Evening'
}

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'long',
})

export function WelcomeCard({ user }: WelcomeCardProps) {
  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.14),_transparent_24%),linear-gradient(135deg,_#ffffff_0%,_#f8fafc_55%,_#ecfeff_100%)] p-6 shadow-2xl shadow-slate-200/70 md:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">
        {getGreeting()}
      </p>
      <h1 className="mt-4 text-3xl font-semibold text-slate-900 md:text-4xl">
        Selamat datang kembali, {user.name}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 md:text-base">
        Dashboard ini merangkum aktivitas pesanan, notifikasi terbaru, dan akses cepat ke area utama Fish Marketplace.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <UserRound className="size-4 text-blue-600" />
            Nama Customer
          </div>
          <p className="mt-2 text-sm text-slate-500">{user.name}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Mail className="size-4 text-emerald-600" />
            Email
          </div>
          <p className="mt-2 text-sm text-slate-500">{user.email}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <ShieldCheck className="size-4 text-sky-600" />
            Role
          </div>
          <p className="mt-2 text-sm text-slate-500">{user.role}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <CalendarDays className="size-4 text-cyan-600" />
            Member Since
          </div>
          <p className="mt-2 text-sm text-slate-500">
            {user.created_at ? dateFormatter.format(new Date(user.created_at)) : '-'}
          </p>
        </div>
      </div>
    </section>
  )
}
