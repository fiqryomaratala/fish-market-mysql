import { zodResolver } from '@hookform/resolvers/zod'
import {
  BellRing,
  ClipboardList,
  KeyRound,
  RefreshCcw,
  Save,
  ShieldCheck,
  Siren,
  Warehouse,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { ChangePasswordModal } from '@/components/customer/profile/ChangePasswordModal'
import { useAuth, useChangePassword, usePageTitle, useProfile } from '@/hooks'
import type { ChangePasswordPayload } from '@/types/profile'
import { decodeJwt } from '@/utils/jwt'

const notificationPreferencesSchema = z.object({
  harvestAlerts: z.boolean(),
  feedingReminders: z.boolean(),
  inventoryAlerts: z.boolean(),
  systemNotifications: z.boolean(),
})

type NotificationPreferencesFormValues = z.infer<typeof notificationPreferencesSchema>

const NOTIFICATION_PREFERENCES_KEY = 'staff-profile-notification-preferences'
const PASSWORD_CHANGED_AT_KEY = 'staff-profile-password-changed-at'

const defaultNotificationPreferences: NotificationPreferencesFormValues = {
  harvestAlerts: true,
  feedingReminders: true,
  inventoryAlerts: true,
  systemNotifications: true,
}

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

function getStoredNotificationPreferences() {
  if (typeof window === 'undefined') {
    return defaultNotificationPreferences
  }

  try {
    const raw = window.localStorage.getItem(NOTIFICATION_PREFERENCES_KEY)

    if (!raw) {
      return defaultNotificationPreferences
    }

    const parsed = JSON.parse(raw) as Partial<NotificationPreferencesFormValues>

    return {
      harvestAlerts: parsed.harvestAlerts ?? true,
      feedingReminders: parsed.feedingReminders ?? true,
      inventoryAlerts: parsed.inventoryAlerts ?? true,
      systemNotifications: parsed.systemNotifications ?? true,
    }
  } catch {
    return defaultNotificationPreferences
  }
}

function getStoredPasswordChangedAt() {
  if (typeof window === 'undefined') {
    return ''
  }

  return window.localStorage.getItem(PASSWORD_CHANGED_AT_KEY) ?? ''
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

function StaffSettingsPage() {
  usePageTitle('Staff Settings')

  const { token } = useAuth()
  const profileQuery = useProfile()
  const changePasswordMutation = useChangePassword()
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [lastPasswordChange, setLastPasswordChange] = useState(getStoredPasswordChangedAt)
  const notificationPreferencesForm = useForm<NotificationPreferencesFormValues>({
    resolver: zodResolver(notificationPreferencesSchema),
    defaultValues: getStoredNotificationPreferences(),
  })

  useEffect(() => {
    notificationPreferencesForm.reset(getStoredNotificationPreferences())
  }, [notificationPreferencesForm])

  const harvestAlerts = useWatch({
    control: notificationPreferencesForm.control,
    name: 'harvestAlerts',
  })
  const feedingReminders = useWatch({
    control: notificationPreferencesForm.control,
    name: 'feedingReminders',
  })
  const inventoryAlerts = useWatch({
    control: notificationPreferencesForm.control,
    name: 'inventoryAlerts',
  })
  const systemNotifications = useWatch({
    control: notificationPreferencesForm.control,
    name: 'systemNotifications',
  })

  const lastLogin = useMemo(() => {
    const lastLoginFromToken = token ? decodeJwt(token)?.iat : undefined

    return typeof lastLoginFromToken === 'number'
      ? new Date(lastLoginFromToken * 1000).toISOString()
      : ''
  }, [token])

  const handleChangePassword = async (payload: ChangePasswordPayload) => {
    try {
      await changePasswordMutation.mutateAsync(payload)
      const changedAt = new Date().toISOString()
      window.localStorage.setItem(PASSWORD_CHANGED_AT_KEY, changedAt)
      setLastPasswordChange(changedAt)
      setIsPasswordModalOpen(false)
      toast.success('Password staff berhasil diperbarui.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleSaveNotificationPreferences = (
    values: NotificationPreferencesFormValues,
  ) => {
    window.localStorage.setItem(NOTIFICATION_PREFERENCES_KEY, JSON.stringify(values))
    notificationPreferencesForm.reset(values)
    toast.success('Preferensi notifikasi berhasil disimpan.')
  }

  if (profileQuery.isLoading) {
    return <StaffSettingsLoadingSkeleton />
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <section className="flex min-h-[420px] flex-col items-center justify-center rounded-[1.75rem] border border-rose-200 bg-white px-6 py-12 text-center shadow-lg shadow-rose-100/70">
        <div className="rounded-full bg-rose-50 p-5 text-rose-500">
          <RefreshCcw className="size-8" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-slate-900">
          Gagal memuat pengaturan staff
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
          Data pengaturan akun belum bisa diambil dari backend. Coba ulangi beberapa saat lagi.
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
          <div className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.22),_transparent_35%),linear-gradient(135deg,_#0f172a_0%,_#155e75_52%,_#0f766e_100%)] px-6 py-8 text-white sm:px-8 lg:px-10">
            <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-100/90">
                  Staff Settings
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Pengaturan akun staff
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-cyan-50/85 sm:text-base">
                  Kelola preferensi notifikasi kerja dan keamanan akun dari satu halaman
                  pengaturan khusus staff.
                </p>
              </div>

              <div className="grid gap-3 rounded-[1.5rem] border border-white/15 bg-white/10 p-5 backdrop-blur-xl sm:min-w-[280px]">
                <InfoPanelItem label="Staff" value={profileQuery.data.name} />
                <InfoPanelItem
                  label="Last Login"
                  value={lastLogin ? formatDateTime(lastLogin) : 'Belum tersedia'}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_0.9fr]">
          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(148,163,184,0.14)]">
            <SectionHeader
              eyebrow="Notification Preferences"
              title="Atur alert yang ingin diterima"
              description="Disimpan per browser agar staff tetap bisa mengatur fokus notifikasi kerja."
            />

            <form
              onSubmit={notificationPreferencesForm.handleSubmit(
                handleSaveNotificationPreferences,
              )}
              className="mt-6 space-y-4"
            >
              <NotificationToggle
                label="Harvest Alerts"
                description="Peringatan batch yang mendekati jadwal panen."
                icon={Siren}
                checked={Boolean(harvestAlerts)}
                {...notificationPreferencesForm.register('harvestAlerts')}
              />
              <NotificationToggle
                label="Feeding Reminders"
                description="Reminder jadwal pakan dan log yang belum tercatat."
                icon={ClipboardList}
                checked={Boolean(feedingReminders)}
                {...notificationPreferencesForm.register('feedingReminders')}
              />
              <NotificationToggle
                label="Inventory Alerts"
                description="Notifikasi stok pakan, obat, atau alat yang menipis."
                icon={Warehouse}
                checked={Boolean(inventoryAlerts)}
                {...notificationPreferencesForm.register('inventoryAlerts')}
              />
              <NotificationToggle
                label="System Notifications"
                description="Informasi update sistem dan pengumuman portal internal."
                icon={BellRing}
                checked={Boolean(systemNotifications)}
                {...notificationPreferencesForm.register('systemNotifications')}
              />

              <button
                type="submit"
                disabled={!notificationPreferencesForm.formState.isDirty}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:from-sky-700 hover:to-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="size-4" />
                Simpan Preferensi
              </button>
            </form>
          </section>

          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(148,163,184,0.14)]">
            <SectionHeader
              eyebrow="Security"
              title="Kontrol keamanan akun"
              description="Kelola password dan lihat ringkasan akses akun saat ini."
            />

            <div className="mt-6 space-y-4">
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
              >
                <KeyRound className="size-4" />
                Change Password
              </button>

              <SidebarInfoRow
                label="Last Login"
                value={lastLogin ? formatDateTime(lastLogin) : 'Belum tersedia'}
              />
              <SidebarInfoRow
                label="Last Password Change"
                value={lastPasswordChange ? formatDateTime(lastPasswordChange) : 'Belum tercatat'}
              />
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Tips keamanan</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Gunakan password yang unik, perbarui secara berkala, dan hindari
                      memakai ulang password lama untuk akun operasional.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        isSubmitting={changePasswordMutation.isPending}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={(values) => void handleChangePassword(values)}
      />
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
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-600">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-xl font-semibold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  )
}

type InfoPanelItemProps = {
  label: string
  value: string
}

function InfoPanelItem({ label, value }: InfoPanelItemProps) {
  return (
    <div className="rounded-2xl border border-white/12 bg-slate-950/15 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/70">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  )
}

type SidebarInfoRowProps = {
  label: string
  value: string
}

function SidebarInfoRow({ label, value }: SidebarInfoRowProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">{value}</p>
    </div>
  )
}

type NotificationToggleProps = ReturnType<
  typeof useForm<NotificationPreferencesFormValues>
>['register'] extends (...args: never[]) => infer T
  ? T & {
      label: string
      description: string
      icon: typeof BellRing
      checked: boolean
    }
  : never

function NotificationToggle({
  label,
  description,
  icon: Icon,
  checked,
  ...inputProps
}: NotificationToggleProps) {
  return (
    <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4 transition hover:border-cyan-200 hover:bg-cyan-50/50">
      <input {...inputProps} type="checkbox" className="sr-only" />
      <div
        className={`mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-2xl ${
          checked ? 'bg-sky-100 text-sky-700' : 'bg-slate-200 text-slate-500'
        }`}
      >
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">{label}</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
          </div>
          <span
            className={`inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition ${
              checked ? 'bg-sky-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`size-5 rounded-full bg-white shadow-sm transition ${
                checked ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </span>
        </div>
      </div>
    </label>
  )
}

function StaffSettingsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-64 animate-pulse rounded-[2rem] bg-slate-200" />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_0.9fr]">
        <div className="h-[34rem] animate-pulse rounded-[1.5rem] bg-slate-200" />
        <div className="h-[34rem] animate-pulse rounded-[1.5rem] bg-slate-200" />
      </div>
    </div>
  )
}

export default StaffSettingsPage
