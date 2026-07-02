import { Calendar, Filter, RefreshCw, Search } from 'lucide-react'
import { useState } from 'react'
import { DropdownSelect } from '@/components/common/DropdownSelect'
import { ORDER_STATUS_OPTIONS } from '@/types/order-management'

interface SearchFilterProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  dateFrom: string
  onDateFromChange: (value: string) => void
  dateTo: string
  onDateToChange: (value: string) => void
  onRefresh: () => void
}

export function SearchFilter({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  onRefresh,
}: SearchFilterProps) {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nomor invoice, nama pelanggan, atau email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Filter className="size-4" />
            Filter
          </button>

          <button
            type="button"
            onClick={onRefresh}
            className="flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            <RefreshCw className="size-4" />
            Refresh
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-700">
              Status
            </label>
            <DropdownSelect
              value={statusFilter}
              onChange={onStatusChange}
              ariaLabel="Filter status pesanan"
              options={[
                { label: 'Semua Status', value: '' },
                ...ORDER_STATUS_OPTIONS.map((status) => ({ label: status, value: status })),
              ]}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-700">
              Dari Tanggal
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => onDateFromChange(e.target.value)}
                className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-700">
              Sampai Tanggal
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => onDateToChange(e.target.value)}
                className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
