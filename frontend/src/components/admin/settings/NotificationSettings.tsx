import { Bell, Loader2, Mail, Package, Sprout, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useUpdateNotificationSettings } from '@/hooks/use-settings'
import type { NotificationSettingsData, SettingsData } from '@/types/settings'

type NotificationSettingsProps = {
  settings?: SettingsData
}

type SettingToggleProps = {
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
  icon: React.ComponentType<{ className?: string }>
}

function SettingToggle({ title, description, checked, onChange, icon: Icon }: SettingToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-slate-100 p-3">
          <Icon className="size-5 text-slate-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition ${
          checked ? 'bg-cyan-600' : 'bg-slate-300'
        }`}
        aria-pressed={checked}
      >
        <span
          className={`inline-block size-5 transform rounded-full bg-white transition ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}

export function NotificationSettings({ settings }: NotificationSettingsProps) {
  const updateNotificationSettingsMutation = useUpdateNotificationSettings()
  const initialState = useMemo<NotificationSettingsData>(
    () => ({
      order_notifications: Boolean(settings?.order_notifications),
      inventory_notifications: Boolean(settings?.inventory_notifications),
      harvest_notifications: Boolean(settings?.harvest_notifications),
      user_notifications: Boolean(settings?.user_notifications),
      email_notifications: Boolean(settings?.email_notifications),
    }),
    [settings],
  )

  const [formData, setFormData] = useState<NotificationSettingsData>(initialState)

  useEffect(() => {
    setFormData(initialState)
  }, [initialState])

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialState)

  const handleToggle = (key: keyof NotificationSettingsData, value: boolean) => {
    setFormData((current) => ({
      ...current,
      [key]: value,
    }))
  }

  const handleReset = () => {
    setFormData(initialState)
  }

  const handleSave = () => {
    updateNotificationSettingsMutation.mutate(formData)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Pengaturan Notifikasi</h2>
        <p className="mt-1 text-sm text-slate-500">
          Atur notifikasi yang ingin Anda terima dari sistem.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <SettingToggle
          title="Notifikasi Pesanan"
          description="Dapatkan pemberitahuan saat ada order baru atau perubahan status pesanan."
          checked={formData.order_notifications}
          onChange={(value) => handleToggle('order_notifications', value)}
          icon={Package}
        />
        <SettingToggle
          title="Notifikasi Inventaris"
          description="Pantau stok menipis, stok habis, dan pembaruan inventaris penting."
          checked={formData.inventory_notifications}
          onChange={(value) => handleToggle('inventory_notifications', value)}
          icon={Bell}
        />
        <SettingToggle
          title="Notifikasi Panen"
          description="Dapatkan update jadwal panen dan hasil panen yang tercatat."
          checked={formData.harvest_notifications}
          onChange={(value) => handleToggle('harvest_notifications', value)}
          icon={Sprout}
        />
        <SettingToggle
          title="Notifikasi Pengguna"
          description="Terima informasi aktivitas akun, perubahan role, dan pembaruan user."
          checked={formData.user_notifications}
          onChange={(value) => handleToggle('user_notifications', value)}
          icon={Users}
        />
        <SettingToggle
          title="Email Notifikasi"
          description="Kirim notifikasi penting juga ke email yang terdaftar."
          checked={formData.email_notifications}
          onChange={(value) => handleToggle('email_notifications', value)}
          icon={Mail}
        />
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
        <p className="text-sm text-slate-600">
          <span className="font-medium">Tips:</span> Aktifkan hanya notifikasi yang benar-benar Anda butuhkan.
        </p>
        <div className="flex items-center gap-3">
          {hasChanges ? (
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Reset
            </button>
          ) : null}
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges || updateNotificationSettingsMutation.isPending}
            className="rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {updateNotificationSettingsMutation.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Menyimpan...
              </span>
            ) : (
              'Simpan Pengaturan Notifikasi'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
