import { useEffect } from 'react'
import { RotateCcw } from 'lucide-react'
import type { MarketplaceFilters } from '@/components/marketplace/FilterSidebar'

type AvailabilityFilter = MarketplaceFilters['availability']
type HarvestStatusFilter = MarketplaceFilters['harvestStatus']

type FilterOptionsProps = {
  availability: AvailabilityFilter
  harvestStatus: HarvestStatusFilter
  onAvailabilityChange: (value: AvailabilityFilter) => void
  onHarvestStatusChange: (value: HarvestStatusFilter) => void
  onReset: () => void
}

type RadioGroupProps<T extends string> = {
  title: string
  name: string
  value: T
  options: T[]
  onChange: (value: T) => void
}

const availabilityOptions: AvailabilityFilter[] = ['All', 'In Stock', 'Out of Stock']
const harvestStatusOptions: HarvestStatusFilter[] = [
  'All',
  'Fresh Harvest',
  'Ready Stock',
  'Upcoming Harvest',
]
const optionLabels = {
  All: 'Semua',
  'In Stock': 'Tersedia',
  'Out of Stock': 'Stok Habis',
  'Fresh Harvest': 'Panen Segar',
  'Ready Stock': 'Siap Stok',
  'Upcoming Harvest': 'Panen Mendatang',
} as const

function getOptionLabel(option: keyof typeof optionLabels) {
  return optionLabels[option]
}

function RadioGroup<T extends string>({
  title,
  name,
  value,
  options,
  onChange,
}: RadioGroupProps<T>) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <div className="space-y-3">
        {options.map((option) => {
          const isChecked = value === option

          return (
            <label
              key={option}
              className={`flex cursor-pointer items-center gap-3 rounded-3xl border px-5 py-4 text-slate-800 shadow-sm transition-all duration-200 ease-in-out hover:shadow-[0_8px_20px_rgba(15,23,42,0.05)] ${
                isChecked
                  ? 'border-blue-200 bg-blue-50/60 shadow-[0_10px_24px_rgba(59,130,246,0.10)]'
                  : 'border-slate-200 bg-white hover:border-slate-400'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option}
                checked={isChecked}
                onChange={() => onChange(option)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={`flex size-5 shrink-0 items-center justify-center rounded-full border bg-white transition-all duration-200 ease-in-out ${
                  isChecked ? 'border-blue-500' : 'border-slate-300'
                }`}
              >
                <span
                  className={`size-2.5 rounded-full bg-blue-500 transition-all duration-200 ease-in-out ${
                    isChecked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`}
                />
              </span>
              <span
                className={`text-base font-medium transition-colors duration-200 ease-in-out ${
                  isChecked ? 'text-slate-900' : 'text-slate-700'
                }`}
              >
                {getOptionLabel(option as keyof typeof optionLabels)}
              </span>
            </label>
          )
        })}
      </div>
    </section>
  )
}

export function FilterOptions({
  availability,
  harvestStatus,
  onAvailabilityChange,
  onHarvestStatusChange,
  onReset,
}: FilterOptionsProps) {
  useEffect(() => {
    console.log('Filter aktif:', {
      availability: getOptionLabel(availability),
      harvestStatus: getOptionLabel(harvestStatus),
    })
  }, [availability, harvestStatus])

  return (
    <div className="space-y-6">
      <RadioGroup
        title="Ketersediaan"
        name="availability"
        value={availability}
        options={availabilityOptions}
        onChange={onAvailabilityChange}
      />

      <RadioGroup
        title="Status Panen"
        name="harvestStatus"
        value={harvestStatus}
        options={harvestStatusOptions}
        onChange={onHarvestStatusChange}
      />

      <button
        type="button"
        onClick={onReset}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition-all duration-200 ease-in-out hover:border-slate-400 hover:text-slate-900"
      >
        <RotateCcw className="size-4" />
        Atur Ulang Filter
      </button>
    </div>
  )
}
