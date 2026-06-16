import { BadgeCheck, CalendarDays, Mail, MapPin, Phone, ShieldCheck, UserRound } from 'lucide-react'
import type { UserProfile } from '@/types/profile'

type ProfileCardProps = {
  profile: UserProfile
  onEdit: () => void
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function formatRole(role: string) {
  if (!role) {
    return 'Pelanggan'
  }

  return role.charAt(0).toUpperCase() + role.slice(1)
}

function formatMemberSince(dateString: string) {
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
  }).format(date)
}

export function ProfileCard({ profile, onEdit }: ProfileCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-cyan-100/60 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-100/80 sm:p-7">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.name}
              className="size-20 rounded-3xl border border-cyan-100 object-cover shadow-lg shadow-cyan-100/70"
            />
          ) : (
            <div className="flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 via-cyan-400 to-emerald-400 text-2xl font-bold text-white shadow-lg shadow-cyan-100/70">
              {getInitials(profile.name || 'FM')}
            </div>
          )}

          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">
              Informasi Profil
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
              {profile.name || '-'}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                <BadgeCheck className="size-4" />
                {formatRole(profile.role)}
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                <CalendarDays className="size-4 text-cyan-600" />
                Bergabung sejak {formatMemberSince(profile.created_at)}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-200 transition duration-200 hover:-translate-y-0.5 hover:from-sky-700 hover:to-emerald-600"
        >
          <UserRound className="size-4" />
          Edit Profil
        </button>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <InfoItem icon={Mail} label="Email" value={profile.email || '-'} colorClassName="text-sky-600" />
        <InfoItem icon={Phone} label="Telepon" value={profile.phone || '-'} colorClassName="text-emerald-600" />
        <InfoItem
          icon={MapPin}
          label="Alamat"
          value={profile.address || '-'}
          colorClassName="text-cyan-600"
        />
        <InfoItem
          icon={ShieldCheck}
          label="Peran"
          value={formatRole(profile.role)}
          colorClassName="text-sky-600"
        />
      </div>
    </section>
  )
}

type InfoItemProps = {
  icon: typeof Mail
  label: string
  value: string
  colorClassName: string
}

function InfoItem({ icon: Icon, label, value, colorClassName }: InfoItemProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 transition duration-200 hover:border-cyan-200 hover:bg-cyan-50/40">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-white p-2 shadow-sm">
          <Icon className={`size-4 ${colorClassName}`} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-700">{label}</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">{value}</p>
        </div>
      </div>
    </div>
  )
}
