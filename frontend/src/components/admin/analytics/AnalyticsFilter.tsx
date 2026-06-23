// Komponen Analytics Filter
import { Calendar, ChevronDown, X } from 'lucide-react'
import type { DateFilterKey } from '@/types/analytics'

type AnalyticsFilterProps = {
  startDate: string
  endDate: string
  activeFilter: DateFilterKey | null
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  onFilterChange: (filter: DateFilterKey) => void
  onReset: () => void
  isSubmitting?: boolean
}

const filterOptions = [
  { key: 'today', label: 'Hari Ini' },
  { key: 'last-7-days', label: '7 Hari Terakhir' },
  { key: 'last-30-days', label: '30 Hari Terakhir' },
  { key: 'this-month', label: 'Bulan Ini' },
  { key: 'this-year', label: 'Tahun Ini' },
  { key: 'custom', label: 'Rentang Kustom' },
] as const

export function AnalyticsFilter({
  startDate,
  endDate,
  activeFilter,
  onStartDateChange,
  onEndDateChange,
  onFilterChange,
  onReset,
  isSubmitting = false,
}: AnalyticsFilterProps) {
  const isCustomRange = activeFilter === 'custom' || (!activeFilter && (startDate || endDate))

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-600">
            Analytics Dashboard Filter
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">
            Filter periode analitik
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Pilih periode waktu untuk melihat trend dan metrik operasional bisnis budidaya ikan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <X className="size-4" />
            Reset Filter
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('today')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              activeFilter === 'today'
                ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            Hari Ini
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1 space-y-4">
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-700">Filter Cepat</p>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => onFilterChange(option.key)}
                  disabled={isSubmitting}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    activeFilter === option.key
                      ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                      : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  } ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {isCustomRange && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="start-date" className="mb-2 block text-sm font-semibold text-slate-700">
                  Tanggal Mulai
                </label>
                <div className="relative">
                  <input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => onStartDateChange(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 pr-10 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                    disabled={isSubmitting}
                  />
                  <Calendar className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
              <div>
                <label htmlFor="end-date" className="mb-2 block text-sm font-semibold text-slate-700">
                  Tanggal Akhir
                </label>
                <div className="relative">
                  <input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => onEndDateChange(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 pr-10 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                    disabled={isSubmitting}
                  />
                  <Calendar className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-slate-700">Actions</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                if (startDate || endDate) {
                  onFilterChange('custom')
                }
              }}
              disabled={isSubmitting || (!startDate && !endDate)}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition ${
                isSubmitting || (!startDate && !endDate)
                  ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                  : 'bg-cyan-600 text-white hover:-translate-y-0.5 hover:bg-cyan-700 hover:shadow-lg'
              }`}
            >
              {isSubmitting ? 'Loading...' : 'Apply Filter'}
              <ChevronDown className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}