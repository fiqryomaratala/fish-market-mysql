import { RotateCcw, SlidersHorizontal, X } from 'lucide-react'

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
    <div className="h-full rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-cyan-950/10 backdrop-blur">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/80">
            Filter
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">Find the best harvest</h2>
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          className="inline-flex rounded-full border border-white/10 p-2 text-slate-300 transition hover:border-cyan-300/50 hover:text-white lg:hidden"
          aria-label="Close filters"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="space-y-6">
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <SlidersHorizontal className="size-4 text-cyan-300" />
            Price Range
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              min="0"
              value={filters.minPrice}
              onChange={(event) =>
                onChange({ ...filters, minPrice: event.target.value })
              }
              placeholder="Minimum"
              className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60"
            />
            <input
              type="number"
              min="0"
              value={filters.maxPrice}
              onChange={(event) =>
                onChange({ ...filters, maxPrice: event.target.value })
              }
              placeholder="Maximum"
              className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60"
            />
          </div>
        </section>

        <section className="space-y-3">
          <div className="text-sm font-medium text-white">Availability</div>
          <div className="space-y-2">
            {availabilityOptions.map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/8 bg-white/3 px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-300/40"
              >
                <span>{option}</span>
                <input
                  type="radio"
                  name="availability"
                  checked={filters.availability === option}
                  onChange={() => onChange({ ...filters, availability: option })}
                  className="size-4 accent-cyan-400"
                />
              </label>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <div className="text-sm font-medium text-white">Harvest Status</div>
          <div className="space-y-2">
            {harvestStatusOptions.map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/8 bg-white/3 px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-300/40"
              >
                <span>{option}</span>
                <input
                  type="radio"
                  name="harvestStatus"
                  checked={filters.harvestStatus === option}
                  onChange={() => onChange({ ...filters, harvestStatus: option })}
                  className="size-4 accent-cyan-400"
                />
              </label>
            ))}
          </div>
        </section>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/40 hover:bg-cyan-400/15"
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
        <div className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden">
          <div className="ml-auto h-full w-full max-w-sm p-4">{sidebarContent}</div>
        </div>
      ) : null}
    </>
  )
}
