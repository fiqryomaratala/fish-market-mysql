import { BellRing, RefreshCcw, Search } from 'lucide-react'
import { DropdownSelect } from '@/components/common/DropdownSelect'
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
  const typeOptions = [
    { label: 'Semua Tipe', value: 'all' },
    ...NOTIFICATION_TYPES.map((type) => ({
      value: type,
      label: getNotificationTypeLabel(type),
    })),
  ]
  const statusOptions = [
    { label: 'Semua Status', value: 'all' },
    { label: 'Sudah Dibaca', value: 'read' },
    { label: 'Belum Dibaca', value: 'unread' },
  ]

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

          <DropdownSelect
            value={typeFilter}
            options={typeOptions}
            onChange={(value) => onTypeChange(value as NotificationTypeFilter)}
            ariaLabel="Filter tipe notifikasi"
            className="xl:min-w-[220px]"
          />

          <DropdownSelect
            value={statusFilter}
            options={statusOptions}
            onChange={(value) => onStatusChange(value as NotificationStatusFilter)}
            ariaLabel="Filter status notifikasi"
            className="xl:min-w-[220px]"
          />

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
