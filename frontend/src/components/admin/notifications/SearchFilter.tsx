import { BellRing, RefreshCcw, Search } from 'lucide-react'
import type { NotificationStatusFilter, NotificationTypeFilter } from '@/types/notification'
import { getNotificationTypeLabel, NOTIFICATION_TYPES } from '@/types/notification'

type SearchFilterProps = {
  searchValue: string
  typeFilter: NotificationTypeFilter
  statusFilter: NotificationStatusFilter
  isRefreshing: boolean
  isMarkingAll: boolean
  onSearchChange: (value: string) => void
  onTypeChange: (value: NotificationTypeFilter) => void
  onStatusChange: (value: NotificationStatusFilter) => void
  onRefresh: () => void
  onMarkAllAsRead: () => void
}

export function SearchFilter({
  searchValue,
  typeFilter,
  statusFilter,
  isRefreshing,
  isMarkingAll,
  onSearchChange,
  onTypeChange,
  onStatusChange,
  onRefresh,
  onMarkAllAsRead,
}: SearchFilterProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Cari judul atau isi notifikasi..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(event) => onTypeChange(event.target.value as NotificationTypeFilter)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15"
          >
            <option value="all">Semua Tipe</option>
            {NOTIFICATION_TYPES.map((type) => (
              <option key={type} value={type}>
                {getNotificationTypeLabel(type)}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => onStatusChange(event.target.value as NotificationStatusFilter)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15"
          >
            <option value="all">Semua Status</option>
            <option value="read">Sudah Dibaca</option>
            <option value="unread">Belum Dibaca</option>
          </select>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCcw className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onMarkAllAsRead}
            disabled={isMarkingAll}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <BellRing className="size-4" />
            {isMarkingAll ? 'Memproses...' : 'Tandai Semua Dibaca'}
          </button>
        </div>
      </div>
    </section>
  )
}
