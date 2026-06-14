import { X } from 'lucide-react'
import { FilterOptions } from '@/components/marketplace/FilterOptions'
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
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Temukan hasil panen terbaik</h2>
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          className="inline-flex rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-blue-200 hover:text-blue-600 lg:hidden"
          aria-label="Tutup filter"
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

        <FilterOptions
          availability={filters.availability}
          harvestStatus={filters.harvestStatus}
          onAvailabilityChange={(availability) => onChange({ ...filters, availability })}
          onHarvestStatusChange={(harvestStatus) =>
            onChange({ ...filters, harvestStatus })
          }
          onReset={onReset}
        />
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
