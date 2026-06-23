import { Clock3, ListFilter, RefreshCcw, Search, TableProperties } from 'lucide-react'
import type { ActivityModuleFilter, ActivityRoleFilter, ActivityViewMode } from '@/types/activity-log'

type SearchFilterProps = {
  search: string
  moduleFilter: ActivityModuleFilter | 'all'
  roleFilter: ActivityRoleFilter | 'all'
  dateFilter: string
  viewMode: ActivityViewMode
  isRefreshing?: boolean
  isRoleFilterAvailable: boolean
  onSearchChange: (value: string) => void
  onModuleFilterChange: (value: ActivityModuleFilter | 'all') => void
  onRoleFilterChange: (value: ActivityRoleFilter | 'all') => void
  onDateFilterChange: (value: string) => void
  onViewModeChange: (value: ActivityViewMode) => void
  onRefresh: () => void
}

const moduleOptions: Array<{ value: ActivityModuleFilter; label: string }> = [
  { value: 'users', label: 'Users' },
  { value: 'products', label: 'Products' },
  { value: 'inventory', label: 'Inventory' },
  { value: 'ponds', label: 'Ponds' },
  { value: 'fish-batches', label: 'Fish Batches' },
  { value: 'feeding-logs', label: 'Feeding Logs' },
  { value: 'harvests', label: 'Harvests' },
  { value: 'orders', label: 'Orders' },
  { value: 'reports', label: 'Reports' },
]

const roleOptions: Array<{ value: ActivityRoleFilter; label: string }> = [
  { value: 'admin', label: 'Admin' },
  { value: 'staff', label: 'Staff' },
  { value: 'customer', label: 'Customer' },
]

export function SearchFilter({
  search,
  moduleFilter,
  roleFilter,
  dateFilter,
  viewMode,
  isRefreshing,
  isRoleFilterAvailable,
  onSearchChange,
  onModuleFilterChange,
  onRoleFilterChange,
  onDateFilterChange,
  onViewModeChange,
  onRefresh,
}: SearchFilterProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/40">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Cari nama user, aksi, atau deskripsi aktivitas"
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            />
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => onViewModeChange('table')}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  viewMode === 'table'
                    ? 'bg-white text-cyan-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TableProperties className="size-4" />
                Table View
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('timeline')}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  viewMode === 'timeline'
                    ? 'bg-white text-cyan-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Clock3 className="size-4" />
                Timeline View
              </button>
            </div>

            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-200 hover:text-cyan-700"
            >
              <RefreshCcw className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
            <ListFilter className="size-4 text-slate-400" />
            <select
              value={moduleFilter}
              onChange={(event) => onModuleFilterChange(event.target.value as ActivityModuleFilter | 'all')}
              className="w-full bg-transparent outline-none"
            >
              <option value="all">Semua modul</option>
              {moduleOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <select
            value={roleFilter}
            onChange={(event) => onRoleFilterChange(event.target.value as ActivityRoleFilter | 'all')}
            disabled={!isRoleFilterAvailable}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          >
            <option value="all">
              {isRoleFilterAvailable ? 'Semua role' : 'Role belum tersedia dari backend'}
            </option>
            {roleOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(event) => onDateFilterChange(event.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          />

          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            Filter role akan aktif otomatis saat respons backend sudah menyertakan `user_role`.
          </div>
        </div>
      </div>
    </section>
  )
}
