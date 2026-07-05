import { useState } from 'react'
import { Settings, AlertCircle, Database, Server, RefreshCw } from 'lucide-react'
import { usePageTitle } from '@/hooks'
import { useSettings } from '@/hooks/use-settings'
import { SettingsSidebar } from '@/components/admin/settings/SettingsSidebar'
import { GeneralSettings } from '@/components/admin/settings/GeneralSettings'
import { ProfileSettings } from '@/components/admin/settings/ProfileSettings'
import { SecuritySettings } from '@/components/admin/settings/SecuritySettings'
import { NotificationSettings } from '@/components/admin/settings/NotificationSettings'
import { SystemSettings } from '@/components/admin/settings/SystemSettings'
import { SummaryCard } from '@/components/admin/settings/SummaryCard'
import { LoadingSkeleton } from '@/components/admin/settings/LoadingSkeleton'
import type { SettingsData } from '@/types/settings'

type MenuType = 'general' | 'profile' | 'security' | 'notifications' | 'system'

export function SettingsPage() {
  usePageTitle('Pengaturan')
  const [activeMenu, setActiveMenu] = useState<MenuType>('general')

  const settingsQuery = useSettings()

  if (settingsQuery.isLoading) {
    return <LoadingSkeleton />
  }

  if (settingsQuery.isError) {
    return (
      <div className="space-y-6">
        <section className="admin-page-hero rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600">
            Pengaturan
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Pengaturan</h1>
          <p className="mt-2 text-sm text-slate-500">
            Kelola semua konfigurasi aplikasi dan sistem di satu tempat
          </p>
        </section>

        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-red-200 bg-white p-10 text-center shadow-lg">
          <div className="rounded-full bg-red-100 p-5">
            <AlertCircle className="size-10 text-red-500" />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-slate-900">Gagal memuat pengaturan</h2>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            Terjadi kendala saat mengambil data pengaturan dari backend.
          </p>
          <button
            type="button"
            onClick={() => settingsQuery.refetch()}
            className="mt-6 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  const settingsData = settingsQuery.data?.settings || []
  const profileData = settingsQuery.data?.profile
  const systemInfo = settingsQuery.data?.system_info

  // Parse settings array to object
  const parsedSettings = settingsData.reduce<Record<string, string | number | boolean>>((acc, setting) => {
    const { key, value } = setting
    
    // Try to parse boolean values
    if (value === 'true' || value === 'false') {
      acc[key] = value === 'true'
    }
    // Try to parse numeric values
    else if (!isNaN(Number(value)) && value.trim() !== '') {
      acc[key] = Number(value)
    }
    // Keep as string
    else {
      acc[key] = value
    }
    
    return acc
  }, {})

  const renderContent = () => {
    switch (activeMenu) {
      case 'general':
        return <GeneralSettings settings={parsedSettings as SettingsData} />
      case 'profile':
        return <ProfileSettings profile={profileData} />
      case 'security':
        return <SecuritySettings />
      case 'notifications':
        return <NotificationSettings settings={parsedSettings as SettingsData} />
      case 'system':
        return <SystemSettings settings={parsedSettings as SettingsData} systemInfo={systemInfo} />
      default:
        return <GeneralSettings settings={parsedSettings as SettingsData} />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <section className="admin-page-hero rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600">
          Pengaturan
        </p>
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Pengaturan</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Kelola semua konfigurasi aplikasi, profil, keamanan, notifikasi, dan sistem dalam satu panel terpusat.
            </p>
          </div>
          <div className="rounded-xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm text-cyan-700">
            Mode pengaturan: <span className="font-semibold capitalize">{activeMenu}</span>
          </div>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Versi Aplikasi"
          value={systemInfo?.application_version || 'v1.0.0'}
          description="Versi aplikasi saat ini"
          icon={Settings}
          tone="primary"
        />
        <SummaryCard
          title="Environment"
          value={systemInfo?.environment ? systemInfo.environment.toUpperCase() : 'DEV'}
          description="Environment aplikasi"
          icon={Server}
          tone="success"
        />
        <SummaryCard
          title="Status Database"
          value={systemInfo?.database_status === 'connected' ? 'Connected' : 'Disconnected'}
          description="Status koneksi database"
          icon={Database}
          tone={systemInfo?.database_status === 'connected' ? 'success' : 'danger'}
        />
        <SummaryCard
          title="Backup Terakhir"
          value={systemInfo?.last_backup_date ? systemInfo.last_backup_date : 'Belum ada'}
          description="Backup database terakhir"
          icon={RefreshCw}
          tone="info"
        />
      </section>

      {/* Main Settings Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <SettingsSidebar
            activeMenu={activeMenu}
            onMenuChange={(menuId) => setActiveMenu(menuId as MenuType)}
          />
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="max-w-2xl">
            <h3 className="text-sm font-semibold text-slate-900">Tips & Informasi</h3>
            <p className="mt-1 text-sm text-slate-500">
              • Simpan pengaturan setelah setiap perubahan untuk menghindari kehilangan data<br />
              • Gunakan mode maintenance hanya saat benar-benar diperlukan<br />
              • Pastikan backup berjalan secara teratur<br />
              • Review pengaturan keamanan secara berkala
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs text-slate-600">
              <span className="font-semibold">Kebutuhan bantuan?</span><br />
              Hubungi tim IT untuk konfigurasi lanjutan
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
