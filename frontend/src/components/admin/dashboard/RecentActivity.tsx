import type { ActivityLogItem } from '@/types/dashboard'
import { formatRelativeTime } from '@/utils/format'

type RecentActivityProps = {
  items: ActivityLogItem[]
}

const moduleLabelMap: Record<string, string> = {
  dashboard: 'Dashboard',
  product: 'Produk',
  products: 'Produk',
  order: 'Pesanan',
  orders: 'Pesanan',
  inventory: 'Inventaris',
  harvest: 'Panen',
  pond: 'Kolam',
  ponds: 'Kolam',
  user: 'Pengguna',
  users: 'Pengguna',
  report: 'Laporan',
  reports: 'Laporan',
  notification: 'Notifikasi',
  notifications: 'Notifikasi',
  setting: 'Pengaturan',
  settings: 'Pengaturan',
  fish_batch: 'Batch Ikan',
  fish_batches: 'Batch Ikan',
  feeding_log: 'Log Pakan',
  feeding_logs: 'Log Pakan',
  activity_log: 'Log Aktivitas',
  activity_logs: 'Log Aktivitas',
}

function getInitials(value: string) {
  return value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase() ?? '')
    .join('')
}

function formatModuleLabel(module: string) {
  if (!module) {
    return '-'
  }

  return moduleLabelMap[module.toLowerCase()] ?? module
}

export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <section className="admin-dashboard-panel rounded-xl border border-white/60 bg-white/75 p-6 shadow-lg shadow-slate-200/45 backdrop-blur-xl">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
          Aktivitas Terkini
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Aktivitas Terbaru</h2>
      </div>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <article key={item.id} className="admin-dashboard-subpanel flex gap-4 rounded-xl bg-slate-50/90 p-4">
            {item.avatar ? (
              <img
                src={item.avatar}
                alt={item.user || 'User'}
                className="size-11 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                {getInitials(item.user || 'SY')}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-semibold text-slate-900">{item.title}</p>
                <span className="shrink-0 text-xs text-slate-500">
                  {formatRelativeTime(item.created_at)}
                </span>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
              <p className="hidden">
                {item.user} • {item.module}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                {item.user} - {formatModuleLabel(item.module)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
