import { ListFilter, Plus, RefreshCcw } from 'lucide-react'
import {
  PRODUCT_CATEGORIES,
  PRODUCT_SORT_OPTIONS,
  PRODUCT_STATUS_OPTIONS,
  type ProductSortOption,
} from '@/types/product'

type FilterBarProps = {
  category: string
  status: string
  sort: ProductSortOption
  isRefreshing?: boolean
  onCategoryChange: (value: string) => void
  onStatusChange: (value: string) => void
  onSortChange: (value: ProductSortOption) => void
  onRefresh: () => void
  onAdd: () => void
}

const sortLabelMap: Record<ProductSortOption, string> = {
  newest: 'Newest',
  oldest: 'Oldest',
  highest_price: 'Highest Price',
  lowest_price: 'Lowest Price',
  stock: 'Stock',
}

const statusLabelMap: Record<string, string> = {
  available: 'Available',
  out_of_stock: 'Out of Stock',
  hidden: 'Hidden',
}

export function FilterBar({
  category,
  status,
  sort,
  isRefreshing,
  onCategoryChange,
  onStatusChange,
  onSortChange,
  onRefresh,
  onAdd,
}: FilterBarProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3 xl:flex-row xl:items-center xl:justify-end">
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row xl:flex-initial">
        <div className="relative min-w-0 sm:w-[168px]">
          <ListFilter className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <select
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-8 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          >
            <option value="All">All Categories</option>
            {PRODUCT_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 sm:w-[168px]"
        >
          <option value="All">All Status</option>
          {PRODUCT_STATUS_OPTIONS.map((item) => (
            <option key={item} value={item}>
              {statusLabelMap[item]}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value as ProductSortOption)}
          className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 sm:w-[160px]"
        >
          {PRODUCT_SORT_OPTIONS.map((item) => (
            <option key={item} value={item}>
              {sortLabelMap[item]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row xl:shrink-0">
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:text-cyan-700 sm:px-5"
        >
          <RefreshCcw className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:from-cyan-700 hover:to-emerald-700 sm:min-w-[152px]"
        >
          <Plus className="size-4" />
          Add Product
        </button>
      </div>
    </div>
  )
}
