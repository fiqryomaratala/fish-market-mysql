import { BadgeCheck, CalendarDays, Mail, MapPin, Phone, ShieldCheck, UserRound } from 'lucide-react'
import { ProfileAvatarUpload } from '@/components/customer/profile/ProfileAvatarUpload'
import type { UserProfile } from '@/types/profile'

type ProfileCardProps = {
  profile: UserProfile
  avatarUrl?: string
  isUploadingPhoto: boolean
  onPhotoUpload: (file: File) => Promise<void>
  onEdit: () => void
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

export function ProfileCard({
  profile,
  avatarUrl,
  isUploadingPhoto,
  onPhotoUpload,
  onEdit,
}: ProfileCardProps) {
  return (
    <section className="profile-card rounded-xl border border-slate-200 bg-white p-6 sm:p-7">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <ProfileAvatarUpload
            name={profile.name || 'Fish Market'}
            photoUrl={avatarUrl}
            isUploading={isUploadingPhoto}
            onUpload={onPhotoUpload}
          />

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
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-blue-700"
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
    <div className="profile-subcard rounded-xl border border-slate-100 bg-slate-50/80 p-4 transition duration-200 hover:border-cyan-200 hover:bg-cyan-50/40">
      <div className="flex items-start gap-3">
        <div className="profile-subcard rounded-2xl border border-slate-100 bg-white p-2">
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
