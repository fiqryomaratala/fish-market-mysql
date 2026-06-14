import { RotateCcw, X } from 'lucide-react'
import { PriceRangeFilter } from '@/components/marketplace/PriceRangeFilter'

type AvailabilityFilter = 'All' | 'In Stock' | 'Out of Stock'
type HarvestStatusFilter = 'All' | 'Fresh Harvest' | 'Ready Stock' | 'Upcoming Harvest'

export type MarketplaceFilters = {
  minPrice: string
  maxPrice: string
  availability: AvailabilityFilter
  harvestStatus: HarvestStatusFilter
}

type FilterSidebarProps = {
  filters: MarketplaceFilters
  isMobileOpen: boolean
  onChange: (nextFilters: MarketplaceFilters) => void
  onReset: () => void
  onCloseMobile: () => void
}

const availabilityOptions: AvailabilityFilter[] = ['All', 'In Stock', 'Out of Stock']
const harvestStatusOptions: HarvestStatusFilter[] = [
  'All',
  'Fresh Harvest',
  'Ready Stock',
  'Upcoming Harvest',
]

export function FilterSidebar({
  filters,
  isMobileOpen,
  onChange,
  onReset,
  onCloseMobile,
}: FilterSidebarProps) {
  const sidebarContent = (
    <div className="h-full rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-200/80 backdrop-blur">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
            Filter
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Find the best harvest</h2>
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          className="inline-flex rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-blue-200 hover:text-blue-600 lg:hidden"
          aria-label="Close filters"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="space-y-6">
        <PriceRangeFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onChange={({ minPrice, maxPrice }) =>
            onChange({ ...filters, minPrice, maxPrice })
          }
        />

        <section className="space-y-3">
          <div className="text-sm font-medium text-slate-900">Availability</div>
          <div className="space-y-2">
            {availabilityOptions.map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition hover:border-blue-200 hover:bg-blue-50/60"
              >
                <span>{option}</span>
                <input
                  type="radio"
                  name="availability"
                  checked={filters.availability === option}
                  onChange={() => onChange({ ...filters, availability: option })}
                  className="size-4 accent-blue-600"
                />
              </label>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <div className="text-sm font-medium text-slate-900">Harvest Status</div>
          <div className="space-y-2">
            {harvestStatusOptions.map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition hover:border-blue-200 hover:bg-blue-50/60"
              >
                <span>{option}</span>
                <input
                  type="radio"
                  name="harvestStatus"
                  checked={filters.harvestStatus === option}
                  onChange={() => onChange({ ...filters, harvestStatus: option })}
                  className="size-4 accent-blue-600"
                />
              </label>
            ))}
          </div>
        </section>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
        >
          <RotateCcw className="size-4" />
          Reset Filter
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden lg:block lg:w-80">{sidebarContent}</aside>

      {isMobileOpen ? (
        <div className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden">
          <div className="ml-auto h-full w-full max-w-sm p-4">{sidebarContent}</div>
        </div>
      ) : null}
    </>
  )
}
