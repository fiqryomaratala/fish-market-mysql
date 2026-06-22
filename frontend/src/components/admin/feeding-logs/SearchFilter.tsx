import { Plus, RefreshCcw, Search } from 'lucide-react'
import type { FeedingLog } from '@/types/feeding-log'

type SearchFilterProps = {
  search: string
  batchFilter: string
  feedFilter: string
  dateFilter: string
  batchOptions: Array<Pick<FeedingLog, 'fish_batch_id' | 'batch_code'>>
  feedOptions: string[]
  isRefreshing?: boolean
  canManage?: boolean
  onSearchChange: (value: string) => void
  onBatchFilterChange: (value: string) => void
  onFeedFilterChange: (value: string) => void
  onDateFilterChange: (value: string) => void
  onRefresh: () => void
  onAdd: () => void
}

export function SearchFilter({
  search,
  batchFilter,
  feedFilter,
  dateFilter,
  batchOptions,
  feedOptions,
  isRefreshing,
  canManage = true,
  onSearchChange,
  onBatchFilterChange,
  onFeedFilterChange,
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
              placeholder="Cari kode batch, jenis ikan, atau nama pakan"
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
              Refresh
            </button>

            <button
              type="button"
              onClick={onAdd}
              disabled={!canManage}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus className="size-4" />
              Add Feeding Log
            </button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <select
            value={batchFilter}
            onChange={(event) => onBatchFilterChange(event.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          >
            <option value="All">Semua batch</option>
            {batchOptions.map((item) => (
              <option key={item.fish_batch_id} value={String(item.fish_batch_id)}>
                {item.batch_code}
              </option>
            ))}
          </select>

          <select
            value={feedFilter}
            onChange={(event) => onFeedFilterChange(event.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          >
            <option value="All">Semua pakan</option>
            {feedOptions.map((item) => (
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
