import { CalendarRange, RotateCcw, Search } from 'lucide-react'
import type { QuickFilterKey } from '@/types/report'

type ReportFilterProps = {
  startDate: string
  endDate: string
  activeQuickFilter: QuickFilterKey | null
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  onQuickFilterChange: (value: QuickFilterKey) => void
  onGenerate: () => void
  onReset: () => void
  isSubmitting?: boolean
}

const quickFilters: Array<{ key: QuickFilterKey; label: string }> = [
  { key: 'today', label: 'Today' },
  { key: 'last-7-days', label: 'Last 7 Days' },
  { key: 'last-30-days', label: 'Last 30 Days' },
  { key: 'this-month', label: 'This Month' },
  { key: 'this-year', label: 'This Year' },
]

export function ReportFilter({
  startDate,
  endDate,
  activeQuickFilter,
  onStartDateChange,
  onEndDateChange,
  onQuickFilterChange,
  onGenerate,
  onReset,
  isSubmitting = false,
}: ReportFilterProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600">
              Filter Laporan
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Atur periode laporan</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Gunakan rentang tanggal atau quick filter untuk menghasilkan laporan operasional dan
              bisnis secara lebih cepat.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Endpoint export backend saat ini tersedia untuk laporan panen, produksi, dan pakan.
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto]">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Start Date</span>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 transition focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-100">
              <CalendarRange className="size-4 text-slate-400" />
              <input
                type="date"
                value={startDate}
                onChange={(event) => onStartDateChange(event.target.value)}
                className="w-full bg-transparent text-sm text-slate-700 outline-none"
              />
            </div>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">End Date</span>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 transition focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-100">
              <CalendarRange className="size-4 text-slate-400" />
              <input
                type="date"
                value={endDate}
                onChange={(event) => onEndDateChange(event.target.value)}
                className="w-full bg-transparent text-sm text-slate-700 outline-none"
              />
            </div>
          </label>

          <button
            type="button"
            onClick={onGenerate}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Search className="size-4" />
            Generate Report
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:text-cyan-700"
          >
            <RotateCcw className="size-4" />
            Reset Filter
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          {quickFilters.map((item) => {
            const isActive = item.key === activeQuickFilter

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onQuickFilterChange(item.key)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-100'
                    : 'border border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:border-cyan-200 hover:text-cyan-700'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
