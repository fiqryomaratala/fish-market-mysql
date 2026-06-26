import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  BellRing,
  Boxes,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Mail,
  MapPin,
  Phone,
  RefreshCcw,
  ShieldCheck,
  TrendingUp,
  UserSquare2,
  Users,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { ProfileAvatarUpload } from '@/components/customer/profile/ProfileAvatarUpload'
import {
  useAuth,
  useDashboardActivityLog,
  useDashboardSummary,
  useNotifications,
  usePageTitle,
  useProfile,
  useUpdateProfile,
  useUploadProfilePhoto,
} from '@/hooks'
import type { UpdateProfilePayload, UserProfile } from '@/types/profile'
import { decodeJwt } from '@/utils/jwt'
import { formatDate, formatNumber, toTitleCase } from '@/utils/format'

const editProfileSchema = z.object({
  name: z.string().trim().min(1, 'Nama wajib diisi'),
  phone: z.string().trim().min(1, 'Nomor telepon wajib diisi'),
  address: z.string().trim().min(1, 'Alamat wajib diisi'),
})

type EditProfileFormValues = z.infer<typeof editProfileSchema>

function getErrorMessage(error: unknown) {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response

    if (typeof response?.data?.message === 'string' && response.data.message) {
      return response.data.message
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Terjadi kesalahan. Silakan coba lagi.'
}

function buildAdminId(id: number) {
  return `ADM-${String(id).padStart(4, '0')}`
}

function getStatusLabel() {
  return 'Active'
}

function formatDateTime(value: string) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function AdminProfilePage() {
  usePageTitle('Admin Profile')

  const { user, token, refreshUser } = useAuth()
  const profileQuery = useProfile()
  const dashboardSummaryQuery = useDashboardSummary()
  const activityQuery = useDashboardActivityLog()
  const notificationsQuery = useNotifications({ page: 1, limit: 5 })
  const updateProfileMutation = useUpdateProfile()
  const uploadProfilePhotoMutation = useUploadProfilePhoto()
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  const profile = profileQuery.data
  const currentPhotoUrl = photoUrl ?? profile?.avatar ?? user?.avatar ?? ''

  const adminInsights = useMemo(() => {
    const summary = dashboardSummaryQuery.data?.summary
    const unreadNotifications =
      notificationsQuery.data?.items.filter((item) => !item.is_read).length ?? 0
    const lastLoginFromToken = token ? decodeJwt(token)?.iat : undefined

    return {
      adminId: buildAdminId(profile?.id ?? user?.id ?? 0),
      position: 'Platform Administrator',
      managedModules: 6,
      unreadNotifications,
      totalRevenue: summary?.total_revenue ?? 0,
      totalOrders: summary?.total_orders ?? 0,
      totalProducts: summary?.total_products ?? 0,
      totalCustomers: summary?.total_customers ?? 0,
      totalBatches: summary?.total_batches ?? 0,
      totalPonds: summary?.total_ponds ?? 0,
      recentActivities: activityQuery.data?.length ?? 0,
      lastLogin:
        typeof lastLoginFromToken === 'number'
          ? new Date(lastLoginFromToken * 1000).toISOString()
          : '',
    }
  }, [activityQuery.data, dashboardSummaryQuery.data?.summary, notificationsQuery.data?.items, profile?.id, token, user?.id])

  const handleUpdateProfile = async (values: UpdateProfilePayload) => {
    try {
      await updateProfileMutation.mutateAsync(values)
      await refreshUser()
      setIsEditingProfile(false)
      toast.success('Profil admin berhasil diperbarui.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handlePhotoUpload = async (file: File) => {
    try {
      const result = await uploadProfilePhotoMutation.mutateAsync(file)
      setPhotoUrl(result.photo_url)
      await refreshUser()
      toast.success('Foto profil admin berhasil diperbarui.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  if (profileQuery.isLoading) {
    return <AdminProfileLoadingSkeleton />
  }

  if (profileQuery.isError || !profile) {
    return (
      <section className="flex min-h-[420px] flex-col items-center justify-center rounded-[1.75rem] border border-rose-200 bg-white px-6 py-12 text-center shadow-lg shadow-rose-100/70">
        <div className="rounded-full bg-rose-50 p-5 text-rose-500">
          <RefreshCcw className="size-8" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-slate-900">Gagal memuat profil admin</h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
          Data profil admin belum bisa diambil dari backend. Coba ulangi beberapa saat lagi.
        </p>
        <button
          type="button"
          onClick={() => void profileQuery.refetch()}
          className="mt-6 rounded-xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
        >
          Coba Lagi
        </button>
      </section>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(14,116,144,0.14)]">
          <div className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.24),_transparent_30%),linear-gradient(135deg,_#0f172a_0%,_#0f766e_46%,_#155e75_100%)] px-6 py-8 text-white sm:px-8 lg:px-10">
            <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.7fr)_340px]">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                <ProfileAvatarUpload
                  name={profile.name || 'Admin'}
                  photoUrl={currentPhotoUrl}
                  isUploading={uploadProfilePhotoMutation.isPending}
                  onUpload={handlePhotoUpload}
                />

                <div className="min-w-0">
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-100/90">
                    Admin Control Center
                  </p>
                  <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    {profile.name}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-cyan-50/85 sm:text-base">
                    Ringkasan identitas admin dan kendali operasional lintas modul dalam satu
                    dashboard profil.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <HeroChip icon={ShieldCheck} label={adminInsights.position} />
                    <HeroChip icon={CheckCircle2} label={getStatusLabel()} />
                    <HeroChip
                      icon={CalendarDays}
                      label={`Join ${formatDate(profile.created_at, {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-3 rounded-[1.5rem] border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
                <InfoPanelItem label="Admin ID" value={adminInsights.adminId} />
                <InfoPanelItem label="Role" value={toTitleCase(profile.role)} />
                <InfoPanelItem
                  label="Last Login"
                  value={adminInsights.lastLogin ? formatDateTime(adminInsights.lastLogin) : '-'}
                />
                <InfoPanelItem
                  label="Unread Alerts"
                  value={formatNumber(adminInsights.unreadNotifications)}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_380px]">
          <div className="space-y-6">
            <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(148,163,184,0.14)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <SectionHeader
                  eyebrow="Personal Information"
                  title="Identitas administrator"
                  description="Data akun utama untuk komunikasi dan identitas admin sistem."
                />

                <button
                  type="button"
                  onClick={() => setIsEditingProfile((current) => !current)}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-cyan-200 hover:text-cyan-700"
                >
                  {isEditingProfile ? 'Tutup Edit' : 'Edit Profil'}
                </button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <DetailCard icon={UserSquare2} label="Name" value={profile.name} tone="sky" />
                <DetailCard icon={Mail} label="Email" value={profile.email} tone="emerald" />
                <DetailCard icon={Phone} label="Phone" value={profile.phone || '-'} tone="amber" />
                <DetailCard icon={MapPin} label="Address" value={profile.address || '-'} tone="slate" />
                <DetailCard
                  icon={ShieldCheck}
                  label="Role"
                  value={toTitleCase(profile.role)}
                  tone="sky"
                />
                <DetailCard
                  icon={CheckCircle2}
                  label="Status"
                  value={getStatusLabel()}
                  tone="emerald"
                />
                <div className="md:col-span-2">
                  <DetailCard
                    icon={CalendarDays}
                    label="Join Date"
                    value={formatDate(profile.created_at, {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                    tone="amber"
                  />
                </div>
              </div>
            </section>

            {isEditingProfile ? (
              <AdminEditProfileForm
                profile={profile}
                isSubmitting={updateProfileMutation.isPending}
                onCancel={() => setIsEditingProfile(false)}
                onSubmit={(values) => void handleUpdateProfile(values)}
              />
            ) : null}

            <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(148,163,184,0.14)]">
              <SectionHeader
                eyebrow="Admin Summary"
                title="Ringkasan kendali sistem"
                description="Snapshot metrik utama yang berada dalam pengawasan administrator."
              />

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <MetricCard
                  icon={TrendingUp}
                  label="Total Revenue"
                  value={formatNumber(adminInsights.totalRevenue)}
                  description="Pendapatan total dari dashboard summary."
                  tone="sky"
                />
                <MetricCard
                  icon={ClipboardList}
                  label="Total Orders"
                  value={formatNumber(adminInsights.totalOrders)}
                  description="Jumlah order lintas sistem."
                  tone="emerald"
                />
                <MetricCard
                  icon={Boxes}
                  label="Total Products"
                  value={formatNumber(adminInsights.totalProducts)}
                  description="Produk yang dikelola saat ini."
                  tone="amber"
                />
                <MetricCard
                  icon={Users}
                  label="Total Customers"
                  value={formatNumber(adminInsights.totalCustomers)}
                  description="Pelanggan aktif dalam ekosistem."
                  tone="slate"
                />
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(148,163,184,0.14)]">
              <SectionHeader
                eyebrow="Access Scope"
                title="Cakupan pengawasan admin"
                description="Ringkasan area operasional yang berada di bawah kendali akun admin."
              />

              <div className="mt-6 space-y-4">
                <SidebarInfoRow label="Managed Modules" value={`${adminInsights.managedModules} core modules`} />
                <SidebarInfoRow label="Fish Batches" value={formatNumber(adminInsights.totalBatches)} />
                <SidebarInfoRow label="Ponds" value={formatNumber(adminInsights.totalPonds)} />
                <SidebarInfoRow label="Recent Activities" value={formatNumber(adminInsights.recentActivities)} />
                <SidebarInfoRow label="Unread Notifications" value={formatNumber(adminInsights.unreadNotifications)} />
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(148,163,184,0.14)]">
              <SectionHeader
                eyebrow="Recent Signals"
                title="Aktivitas dan notifikasi terbaru"
                description="Ringkasan cepat sinyal penting yang perlu diperhatikan administrator."
              />

              <div className="mt-6 space-y-3">
                {activityQuery.data?.slice(0, 3).map((item) => (
                  <SignalItem
                    key={`activity-${item.id}`}
                    icon={ClipboardList}
                    title={item.title}
                    subtitle={formatDateTime(item.created_at)}
                  />
                ))}
                {notificationsQuery.data?.items.slice(0, 2).map((item) => (
                  <SignalItem
                    key={`notification-${item.id}`}
                    icon={BellRing}
                    title={item.title}
                    subtitle={formatDateTime(item.created_at)}
                  />
                ))}
                {!activityQuery.data?.length && !notificationsQuery.data?.items.length ? (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                    Belum ada aktivitas atau notifikasi terbaru yang dapat ditampilkan.
                  </div>
                ) : null}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

type SectionHeaderProps = {
  eyebrow: string
  title: string
  description: string
}

function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-600">{eyebrow}</p>
      <h2 className="mt-2 text-xl font-semibold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  )
}

function HeroChip({ icon: Icon, label }: { icon: typeof ShieldCheck; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
      <Icon className="size-4" />
      {label}
    </span>
  )
}

function InfoPanelItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/75">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  )
}

function DetailCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof UserSquare2
  label: string
  value: string
  tone: 'sky' | 'emerald' | 'amber' | 'slate'
}) {
  const toneClasses = {
    sky: 'border-sky-100 bg-sky-50/70 text-sky-600',
    emerald: 'border-emerald-100 bg-emerald-50/70 text-emerald-600',
    amber: 'border-amber-100 bg-amber-50/70 text-amber-600',
    slate: 'border-slate-200 bg-slate-50/80 text-slate-600',
  }

  return (
    <article className="rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60">
      <div className="flex items-start gap-3">
        <div className={`rounded-2xl border p-2.5 ${toneClasses[tone]}`}>
          <Icon className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-700">{label}</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">{value}</p>
        </div>
      </div>
    </article>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
  description,
  tone,
}: {
  icon: typeof TrendingUp
  label: string
  value: string
  description: string
  tone: 'sky' | 'emerald' | 'amber' | 'slate'
}) {
  const toneClasses = {
    sky: 'border-sky-100 bg-sky-50/70 text-sky-600',
    emerald: 'border-emerald-100 bg-emerald-50/70 text-emerald-600',
    amber: 'border-amber-100 bg-amber-50/70 text-amber-600',
    slate: 'border-slate-200 bg-slate-50/80 text-slate-600',
  }

  return (
    <article className="rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-700">{label}</p>
          <p className="mt-3 text-2xl font-semibold text-slate-950">{value}</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
        </div>
        <div className={`rounded-2xl border p-2.5 ${toneClasses[tone]}`}>
          <Icon className="size-4" />
        </div>
      </div>
    </article>
  )
}

function SidebarInfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.1rem] border border-slate-200 bg-slate-50/80 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">{value}</p>
    </div>
  )
}

function SignalItem({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof BellRing
  title: string
  subtitle: string
}) {
  return (
    <div className="rounded-[1.1rem] border border-slate-200 bg-slate-50/80 px-4 py-3">
      <div className="flex items-start gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-2 text-cyan-600">
          <Icon className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800">{title}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}

function AdminEditProfileForm({
  profile,
  isSubmitting,
  onCancel,
  onSubmit,
}: {
  profile: UserProfile
  isSubmitting: boolean
  onCancel: () => void
  onSubmit: (values: UpdateProfilePayload) => void
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: profile.name,
      phone: profile.phone,
      address: profile.address,
    },
  })

  useEffect(() => {
    reset({
      name: profile.name,
      phone: profile.phone,
      address: profile.address,
    })
  }, [profile, reset])

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values))}
      className="rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-cyan-50/80 via-white to-emerald-50/60 p-6 shadow-[0_18px_45px_rgba(148,163,184,0.14)]"
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-600">Edit Profile</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-950">Perbarui identitas admin</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Ubah nama, nomor telepon, dan alamat untuk kebutuhan administrasi akun.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <FormField
          label="Nama"
          error={errors.name?.message}
          input={
            <input
              {...register('name')}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            />
          }
        />
        <FormField
          label="Nomor Telepon"
          error={errors.phone?.message}
          input={
            <input
              {...register('phone')}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />
          }
        />
        <FormField
          label="Alamat"
          className="md:col-span-2"
          error={errors.address?.message}
          input={
            <textarea
              {...register('address')}
              rows={4}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            />
          }
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-600 to-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:from-sky-700 hover:to-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Batal
        </button>
      </div>
    </form>
  )
}

function FormField({
  label,
  input,
  error,
  className,
}: {
  label: string
  input: ReactNode
  error?: string
  className?: string
}) {
  return (
    <label className={className}>
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      {input}
      {error ? <p className="mt-2 text-sm text-rose-500">{error}</p> : null}
    </label>
  )
}

function AdminProfileLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-64 animate-pulse rounded-[2rem] bg-slate-100" />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_380px]">
        <div className="space-y-6">
          <div className="h-72 animate-pulse rounded-[1.5rem] bg-slate-100" />
          <div className="h-80 animate-pulse rounded-[1.5rem] bg-slate-100" />
        </div>
        <div className="space-y-6">
          <div className="h-64 animate-pulse rounded-[1.5rem] bg-slate-100" />
          <div className="h-56 animate-pulse rounded-[1.5rem] bg-slate-100" />
          <div className="h-72 animate-pulse rounded-[1.5rem] bg-slate-100" />
        </div>
      </div>
    </div>
  )
}

export default AdminProfilePage
