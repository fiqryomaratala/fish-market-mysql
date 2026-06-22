import { Plus, RefreshCcw, Search } from 'lucide-react'
import type { HarvestStatus } from '@/types/harvest'

type SearchFilterProps = {
  search: string
  status: HarvestStatus | 'All'
  fishType: string
  dateFilter: string
  fishTypes: string[]
  isRefreshing?: boolean
  canManage?: boolean
  onSearchChange: (value: string) => void
  onStatusChange: (value: HarvestStatus | 'All') => void
  onFishTypeChange: (value: string) => void
  onDateFilterChange: (value: string) => void
  onRefresh: () => void
  onAdd: () => void
}

export function SearchFilter({
  search,
  status,
  fishType,
  dateFilter,
  fishTypes,
  isRefreshing,
  canManage = true,
  onSearchChange,
  onStatusChange,
  onFishTypeChange,
  onDateFilterChange,
  onRefresh,
  onAdd,
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
              placeholder="Cari kode panen, batch, atau jenis ikan"
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            />
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-200 hover:text-cyan-700"
            >
              <RefreshCcw className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Muat Ulang
            </button>

            <button
              type="button"
              onClick={onAdd}
              disabled={!canManage}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus className="size-4" />
              Tambah Panen
            </button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <select
            value={status}
            onChange={(event) => onStatusChange(event.target.value as HarvestStatus | 'All')}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          >
            <option value="All">Semua status</option>
            <option value="Planned">Planned</option>
            <option value="Harvested">Harvested</option>
            <option value="Transferred To Inventory">Transferred To Inventory</option>
          </select>

          <select
            value={fishType}
            onChange={(event) => onFishTypeChange(event.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          >
            <option value="All">Semua jenis ikan</option>
            {fishTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(event) => onDateFilterChange(event.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          />
        </div>
      </div>
    </section>
  )
}
