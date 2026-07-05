import { Activity, Database, Loader2, RefreshCcw, Server, Shield } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useUpdateSystemSettings } from '@/hooks/use-settings'
import type { SettingsData, SystemInfo, SystemSettingsData } from '@/types/settings'

type SystemSettingsProps = {
  settings?: SettingsData
  systemInfo?: SystemInfo
}

type ToggleRowProps = {
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function ToggleRow({ title, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
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

export function SystemSettings({ settings, systemInfo }: SystemSettingsProps) {
  const updateSystemSettingsMutation = useUpdateSystemSettings()
  const initialState = useMemo<SystemSettingsData>(
    () => ({
      maintenance_mode: Boolean(settings?.maintenance_mode),
      auto_refresh_dashboard: Boolean(settings?.auto_refresh_dashboard),
      enable_activity_logs: Boolean(settings?.enable_activity_logs),
      enable_audit_trail: Boolean(settings?.enable_audit_trail),
    }),
    [settings],
  )
  const [draftFormData, setDraftFormData] = useState<SystemSettingsData | null>(null)
  const formData = draftFormData ?? initialState

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialState)

  const handleToggle = (key: keyof SystemSettingsData, value: boolean) => {
    setDraftFormData((current) => ({
      ...(current ?? initialState),
      [key]: value,
    }))
  }

  const handleReset = () => {
    setDraftFormData(null)
  }

  const handleSave = () => {
    updateSystemSettingsMutation.mutate(formData, {
      onSuccess: () => {
        setDraftFormData(null)
      },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Pengaturan Sistem</h2>
        <p className="mt-1 text-sm text-slate-500">
          Konfigurasi inti sistem dan perilaku dashboard admin.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ToggleRow
          title="Mode Maintenance"
          description="Batasi akses sementara saat ada pemeliharaan sistem."
          checked={formData.maintenance_mode}
          onChange={(value) => handleToggle('maintenance_mode', value)}
        />
        <ToggleRow
          title="Auto Refresh Dashboard"
          description="Perbarui data dashboard secara otomatis di latar belakang."
          checked={formData.auto_refresh_dashboard}
          onChange={(value) => handleToggle('auto_refresh_dashboard', value)}
        />
        <ToggleRow
          title="Aktifkan Activity Logs"
          description="Simpan jejak aktivitas penting dari pengguna dan modul aplikasi."
          checked={formData.enable_activity_logs}
          onChange={(value) => handleToggle('enable_activity_logs', value)}
        />
        <ToggleRow
          title="Aktifkan Audit Trail"
          description="Catat perubahan sensitif untuk kebutuhan audit dan keamanan."
          checked={formData.enable_audit_trail}
          onChange={(value) => handleToggle('enable_audit_trail', value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center gap-3">
            <Server className="size-5 text-cyan-600" />
            <p className="text-sm font-semibold text-slate-900">Environment</p>
          </div>
          <p className="mt-3 text-sm text-slate-600">{systemInfo?.environment ?? '-'}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center gap-3">
            <Database className="size-5 text-emerald-600" />
            <p className="text-sm font-semibold text-slate-900">Database</p>
          </div>
          <p className="mt-3 text-sm text-slate-600">{systemInfo?.database_status ?? '-'}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center gap-3">
            <Shield className="size-5 text-amber-600" />
            <p className="text-sm font-semibold text-slate-900">Versi Aplikasi</p>
          </div>
          <p className="mt-3 text-sm text-slate-600">{systemInfo?.application_version ?? '-'}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">Aksi Sistem</h3>
        <p className="mt-1 text-sm text-slate-500">
          Shortcut untuk tindakan operasional yang sering dipakai.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button
            type="button"
            className="flex flex-col items-center justify-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center transition hover:bg-emerald-100"
          >
            <Database className="size-6 text-emerald-600" />
            <div>
              <p className="text-sm font-medium text-emerald-800">Backup Database</p>
              <p className="mt-1 text-xs text-emerald-600">Buat backup manual</p>
            </div>
          </button>

          <button
            type="button"
            className="flex flex-col items-center justify-center gap-3 rounded-xl border border-cyan-200 bg-cyan-50 p-5 text-center transition hover:bg-cyan-100"
          >
            <RefreshCcw className="size-6 text-cyan-600" />
            <div>
              <p className="text-sm font-medium text-cyan-800">Clear Cache</p>
              <p className="mt-1 text-xs text-cyan-600">Bersihkan cache aplikasi</p>
            </div>
          </button>

          <button
            type="button"
            className="flex flex-col items-center justify-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5 text-center transition hover:bg-amber-100"
          >
            <Activity className="size-6 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-800">View Logs</p>
              <p className="mt-1 text-xs text-amber-600">Lihat log sistem</p>
            </div>
          </button>

          <button
            type="button"
            className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-5 text-center transition hover:bg-slate-100"
          >
            <Server className="size-6 text-slate-600" />
            <div>
              <p className="text-sm font-medium text-slate-800">Server Status</p>
              <p className="mt-1 text-xs text-slate-600">Status server dan health</p>
            </div>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
        <p className="text-sm text-slate-600">
          <span className="font-medium">Tips:</span> Simpan pengaturan sistem secara berkala.
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
            disabled={!hasChanges || updateSystemSettingsMutation.isPending}
            className="rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {updateSystemSettingsMutation.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Menyimpan...
              </span>
            ) : (
              'Simpan Pengaturan Sistem'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
