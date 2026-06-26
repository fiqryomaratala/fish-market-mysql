import { Plus, RefreshCcw, Search } from 'lucide-react'
import { DropdownSelect } from '@/components/common/DropdownSelect'
import {
  FISH_BATCH_STATUS_OPTIONS,
  FISH_TYPE_OPTIONS,
  getFishBatchStatusLabel,
  type FishBatchStatus,
} from '@/types/fish-batch'

type SearchFilterProps = {
  search: string
  status: FishBatchStatus | 'All'
  fishType: string
  isRefreshing?: boolean
  canManage?: boolean
  onSearchChange: (value: string) => void
  onStatusChange: (value: FishBatchStatus | 'All') => void
  onFishTypeChange: (value: string) => void
  onRefresh: () => void
  onAdd: () => void
}

export function SearchFilter({
  search,
  status,
  fishType,
  isRefreshing,
  canManage = true,
  onSearchChange,
  onStatusChange,
  onFishTypeChange,
  onRefresh,
  onAdd,
}: SearchFilterProps) {
  const statusOptions = [
    { label: 'Semua status', value: 'All' },
    ...FISH_BATCH_STATUS_OPTIONS.map((item) => ({
      value: item,
      label: getFishBatchStatusLabel(item),
    })),
  ]
  const fishTypeOptions = [
    { label: 'Semua jenis ikan', value: 'All' },
    ...FISH_TYPE_OPTIONS.map((item) => ({ label: item, value: item })),
  ]

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/40">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Cari kode batch, jenis ikan, atau nama kolam"
            className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          />
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <DropdownSelect
            value={status}
            options={statusOptions}
            onChange={(value) => onStatusChange(value as FishBatchStatus | 'All')}
            ariaLabel="Filter status batch"
            className="min-w-[220px]"
          />

          <DropdownSelect
            value={fishType}
            options={fishTypeOptions}
            onChange={onFishTypeChange}
            ariaLabel="Filter jenis ikan"
            className="min-w-[220px]"
          />

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
            Tambah Batch
          </button>
        </div>
      </div>
    </div>
  )
}
