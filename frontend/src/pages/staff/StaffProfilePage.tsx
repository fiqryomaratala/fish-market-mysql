import { useMemo, useState } from 'react'
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Fish,
  Mail,
  MapPin,
  Phone,
  RefreshCcw,
  ShieldCheck,
  UserSquare2,
  Warehouse,
} from 'lucide-react'
import { toast } from 'sonner'
import { ProfileAvatarUpload } from '@/components/customer/profile/ProfileAvatarUpload'
import {
  useAuth,
  useFeedingLogs,
  useFishBatches,
  useHarvests,
  useInventoryMovements,
  usePageTitle,
  usePonds,
  useProfile,
  useStaffDashboard,
  useUploadProfilePhoto,
} from '@/hooks'
import { decodeJwt } from '@/utils/jwt'
import { formatDate, formatNumber, toTitleCase } from '@/utils/format'

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

function normalizeName(value: string) {
  return value.trim().toLowerCase()
}

function buildEmployeeId(id: number) {
  return `EMP-${String(id).padStart(4, '0')}`
}

function getPositionLabel(role: string | null | undefined) {
  if (role === 'admin') {
    return 'Operations Supervisor'
  }

  if (role === 'staff') {
    return 'Aquaculture Operations Staff'
  }

  return 'Portal Member'
}

function getStatusLabel() {
  return 'Active'
}

function getShiftLabel(values: string[]) {
  if (values.some((value) => value.includes('T06:') || value.includes('T07:') || value.includes('T08:') || value.includes('T09:') || value.includes('T10:') || value.includes('T11:'))) {
    return 'Morning Shift'
  }

  if (values.some((value) => value.includes('T12:') || value.includes('T13:') || value.includes('T14:') || value.includes('T15:') || value.includes('T16:'))) {
    return 'Day Shift'
  }

  if (values.some((value) => value.includes('T17:') || value.includes('T18:') || value.includes('T19:'))) {
    return 'Evening Shift'
  }

  return 'Rotational Shift'
}

function isToday(value: string) {
  if (!value) {
    return false
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return false
  }

  const now = new Date()
  return date.toDateString() === now.toDateString()
}

function StaffProfilePage() {
  usePageTitle('Staff Profile')

  const { user, token, refreshUser } = useAuth()
  const profileQuery = useProfile()
  const dashboardQuery = useStaffDashboard()
  const pondsQuery = usePonds({ page: 1, limit: 50 })
  const fishBatchesQuery = useFishBatches({ page: 1, limit: 50 })
  const feedingLogsQuery = useFeedingLogs({ page: 1, limit: 20 })
  const harvestsQuery = useHarvests({ page: 1, limit: 20 })
  const inventoryMovementsQuery = useInventoryMovements()
  const uploadProfilePhotoMutation = useUploadProfilePhoto()
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)

  const profile = profileQuery.data
  const dashboard = dashboardQuery.data
  const feedingItems = feedingLogsQuery.data?.items ?? []
  const harvestItems = harvestsQuery.data?.items ?? []
  const pondItems = pondsQuery.data?.items ?? []
  const fishBatchItems = fishBatchesQuery.data?.items ?? []
  const inventoryMovements = inventoryMovementsQuery.data ?? []
  const currentPhotoUrl = photoUrl ?? profile?.avatar ?? user?.avatar ?? ''
  const currentUserName = normalizeName(user?.name ?? profile?.name ?? '')

  const profileInsights = useMemo(() => {
    const personallyCreatedFeeding = feedingItems.filter(
      (item) => normalizeName(item.created_by) === currentUserName,
    )
    const personallyCreatedHarvests = harvestItems.filter(
      (item) => normalizeName(item.created_by) === currentUserName,
    )

    const assignedPonds = Array.from(
      new Set([
        ...personallyCreatedFeeding.map((item) => item.pond_name).filter(Boolean),
        ...personallyCreatedHarvests.map((item) => item.pond_name).filter(Boolean),
      ]),
    )

    const fallbackPonds = pondItems
      .filter((item) => item.status === 'Active')
      .slice(0, 4)
      .map((item) => item.name)

    const assignedFishBatches = Array.from(
      new Set([
        ...personallyCreatedFeeding.map((item) => item.batch_code).filter(Boolean),
        ...personallyCreatedHarvests.map((item) => item.batch_code).filter(Boolean),
      ]),
    )

    const fallbackFishBatches = fishBatchItems
      .filter((item) => item.status === 'Growing' || item.status === 'Ready To Harvest')
      .slice(0, 4)
      .map((item) => item.batch_code)

    const todayInventoryUpdates = inventoryMovements.filter((item) => isToday(item.date)).length
    const lastLoginFromToken = token ? decodeJwt(token)?.iat : undefined

    return {
      employeeId: buildEmployeeId(profile?.id ?? user?.id ?? 0),
      position: getPositionLabel(user?.role ?? profile?.role),
      assignedPonds: assignedPonds.length > 0 ? assignedPonds : fallbackPonds,
      assignedFishBatches:
        assignedFishBatches.length > 0 ? assignedFishBatches : fallbackFishBatches,
      shift: getShiftLabel(personallyCreatedFeeding.map((item) => item.feeding_time)),
      totalFeedingLogs: feedingLogsQuery.data?.meta.total ?? feedingItems.length,
      totalHarvestRecords: harvestsQuery.data?.meta.total ?? harvestItems.length,
      totalInventoryUpdates: inventoryMovements.length,
      todaysActivities:
        (dashboard?.today_feedings ?? 0) +
        (dashboard?.today_harvests ?? 0) +
        todayInventoryUpdates,
      lastLogin:
        typeof lastLoginFromToken === 'number' ? new Date(lastLoginFromToken * 1000).toISOString() : '',
    }
  }, [
    currentUserName,
    dashboard,
    feedingItems,
    feedingLogsQuery.data?.meta.total,
    fishBatchItems,
    harvestItems,
    harvestsQuery.data?.meta.total,
    inventoryMovements,
    pondItems,
    profile?.id,
    profile?.role,
    token,
    user?.id,
    user?.role,
  ])

  const handlePhotoUpload = async (file: File) => {
    try {
      const result = await uploadProfilePhotoMutation.mutateAsync(file)
      setPhotoUrl(result.photo_url)
      await refreshUser()
      toast.success('Foto profil staff berhasil diperbarui.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  if (profileQuery.isLoading) {
    return <StaffProfileLoadingSkeleton />
  }

  if (profileQuery.isError || !profile) {
    return (
      <section className="flex min-h-[420px] flex-col items-center justify-center rounded-[1.75rem] border border-rose-200 bg-white px-6 py-12 text-center shadow-lg shadow-rose-100/70">
        <div className="rounded-full bg-rose-50 p-5 text-rose-500">
          <RefreshCcw className="size-8" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-slate-900">Gagal memuat profile staff</h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
          Data profil belum bisa diambil dari backend. Coba ulangi beberapa saat lagi.
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
          <div className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.24),_transparent_32%),linear-gradient(135deg,_#0f172a_0%,_#155e75_52%,_#0f766e_100%)] px-6 py-8 text-white sm:px-8 lg:px-10">
            <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.7fr)_340px]">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                <ProfileAvatarUpload
                  name={profile.name || 'Staff'}
                  photoUrl={currentPhotoUrl}
                  isUploading={uploadProfilePhotoMutation.isPending}
                  onUpload={handlePhotoUpload}
                />

                <div className="min-w-0">
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-100/90">
                    Employee Portal
                  </p>
                  <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    {profile.name}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-cyan-50/85 sm:text-base">
                    Ringkasan identitas, assignment operasional, preferensi notifikasi, dan
                    keamanan akun staff dalam satu dashboard.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <HeroChip icon={ShieldCheck} label={profileInsights.position} />
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
                <InfoPanelItem label="Employee ID" value={profileInsights.employeeId} />
                <InfoPanelItem label="Role" value={toTitleCase(profile.role)} />
                <InfoPanelItem label="Shift" value={profileInsights.shift} />
                <InfoPanelItem
                  label="Today's Activities"
                  value={formatNumber(profileInsights.todaysActivities)}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_380px]">
          <div className="space-y-6">
            <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(148,163,184,0.14)]">
              <SectionHeader
                eyebrow="Personal Information"
                title="Identitas staff"
                description="Data akun utama untuk komunikasi dan identifikasi personel."
              />

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <DetailCard icon={UserSquare2} label="Name" value={profile.name} tone="sky" />
                <DetailCard icon={Mail} label="Email" value={profile.email} tone="emerald" />
                <DetailCard
                  icon={Phone}
                  label="Phone"
                  value={profile.phone || '-'}
                  tone="amber"
                />
                <DetailCard
                  icon={MapPin}
                  label="Address"
                  value={profile.address || '-'}
                  tone="slate"
                />
                <DetailCard
                  icon={ShieldCheck}
                  label="Role"
                  value={toTitleCase(profile.role)}
                  tone="sky"
                />
                <DetailCard icon={CheckCircle2} label="Status" value={getStatusLabel()} tone="emerald" />
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

          </div>

          <div className="space-y-6">
            <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(148,163,184,0.14)]">
              <SectionHeader
                eyebrow="Work Information"
                title="Ringkasan assignment kerja"
                description="Assignment operasional yang diturunkan dari data aktivitas dan dashboard."
              />

              <div className="mt-6 space-y-4">
                <SidebarInfoRow label="Employee ID" value={profileInsights.employeeId} />
                <SidebarInfoRow label="Position" value={profileInsights.position} />
                <SidebarInfoRow
                  label="Assigned Ponds"
                  value={
                    profileInsights.assignedPonds.length > 0
                      ? profileInsights.assignedPonds.join(', ')
                      : 'Belum ada pond assignment'
                  }
                />
                <SidebarInfoRow
                  label="Assigned Fish Batches"
                  value={
                    profileInsights.assignedFishBatches.length > 0
                      ? profileInsights.assignedFishBatches.join(', ')
                      : 'Belum ada fish batch assignment'
                  }
                />
                <SidebarInfoRow label="Shift" value={profileInsights.shift} />
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(148,163,184,0.14)]">
              <SectionHeader
                eyebrow="Activity Summary"
                title="Performa operasional"
                description="Rekap cepat untuk aktivitas kerja yang paling sering dipantau."
              />

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <SummaryMetric
                  icon={ClipboardList}
                  label="Total Feeding Logs"
                  value={formatNumber(profileInsights.totalFeedingLogs)}
                  accent="sky"
                />
                <SummaryMetric
                  icon={Fish}
                  label="Total Harvest Records"
                  value={formatNumber(profileInsights.totalHarvestRecords)}
                  accent="emerald"
                />
                <SummaryMetric
                  icon={Warehouse}
                  label="Total Inventory Updates"
                  value={formatNumber(profileInsights.totalInventoryUpdates)}
                  accent="amber"
                />
                <SummaryMetric
                  icon={Activity}
                  label="Today's Activities"
                  value={formatNumber(profileInsights.todaysActivities)}
                  accent="slate"
                />
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

type HeroChipProps = {
  icon: typeof ShieldCheck
  label: string
}

function HeroChip({ icon: Icon, label }: HeroChipProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-sm font-semibold text-white/95 backdrop-blur-sm">
      <Icon className="size-4 text-cyan-100" />
      {label}
    </span>
  )
}

type InfoPanelItemProps = {
  label: string
  value: string
}

function InfoPanelItem({ label, value }: InfoPanelItemProps) {
  return (
    <div className="rounded-2xl border border-white/12 bg-slate-950/15 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/70">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  )
}

type DetailCardProps = {
  icon: typeof ShieldCheck
  label: string
  value: string
  tone: 'sky' | 'emerald' | 'amber' | 'slate'
}

function DetailCard({ icon: Icon, label, value, tone }: DetailCardProps) {
  const toneClasses =
    tone === 'sky'
      ? 'from-sky-50 to-cyan-50 text-sky-700'
      : tone === 'emerald'
        ? 'from-emerald-50 to-lime-50 text-emerald-700'
        : tone === 'amber'
          ? 'from-amber-50 to-orange-50 text-amber-700'
          : 'from-slate-100 to-slate-50 text-slate-700'

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <div
          className={`flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br ${toneClasses}`}
        >
          <Icon className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-700">{label}</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">{value}</p>
        </div>
      </div>
    </article>
  )
}

type SidebarInfoRowProps = {
  label: string
  value: string
}

function SidebarInfoRow({ label, value }: SidebarInfoRowProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">{value}</p>
    </div>
  )
}

type SummaryMetricProps = {
  icon: typeof ClipboardList
  label: string
  value: string
  accent: 'sky' | 'emerald' | 'amber' | 'slate'
}

function SummaryMetric({ icon: Icon, label, value, accent }: SummaryMetricProps) {
  const accentClasses =
    accent === 'sky'
      ? 'bg-sky-50 text-sky-700'
      : accent === 'emerald'
        ? 'bg-emerald-50 text-emerald-700'
        : accent === 'amber'
          ? 'bg-amber-50 text-amber-700'
          : 'bg-slate-100 text-slate-700'

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
        </div>
        <div className={`rounded-2xl p-3 ${accentClasses}`}>
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  )
}

function StaffProfileLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-64 animate-pulse rounded-[2rem] bg-slate-200" />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_380px]">
        <div className="space-y-6">
          <div className="h-80 animate-pulse rounded-[1.5rem] bg-slate-200" />
        </div>
        <div className="space-y-6">
          <div className="h-72 animate-pulse rounded-[1.5rem] bg-slate-200" />
          <div className="h-72 animate-pulse rounded-[1.5rem] bg-slate-200" />
        </div>
      </div>
    </div>
  )
}

export default StaffProfilePage
