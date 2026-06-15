import { RotateCcw } from 'lucide-react'
import { OrderSearch } from '@/components/orders/OrderSearch'
import { SortDropdown } from '@/components/marketplace/SortDropdown'

export type OrderFilterStatus =
  | 'All'
  | 'Pending'
  | 'Paid'
  | 'Processing'
  | 'Shipping'
  | 'Completed'
  | 'Cancelled'

export type OrderSortOption = 'Newest' | 'Oldest' | 'Highest Total' | 'Lowest Total'

type OrderFilterProps = {
  search: string
  status: OrderFilterStatus
  sort: OrderSortOption
  onSearchChange: (value: string) => void
  onStatusChange: (value: OrderFilterStatus) => void
  onSortChange: (value: OrderSortOption) => void
  onReset: () => void
}

const statusOptions: OrderFilterStatus[] = [
  'All',
  'Pending',
  'Paid',
  'Processing',
  'Shipping',
  'Completed',
  'Cancelled',
]

const sortOptions: OrderSortOption[] = ['Newest', 'Oldest', 'Highest Total', 'Lowest Total']

export function OrderFilter({
  search,
  status,
  sort,
  onSearchChange,
  onStatusChange,
  onSortChange,
  onReset,
}: OrderFilterProps) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white/95 p-5 shadow-lg shadow-slate-200/70 backdrop-blur md:p-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_auto]">
        <OrderSearch value={search} onChange={onSearchChange} />

        <SortDropdown
          label="Status"
          value={status}
          options={statusOptions}
          placeholder="All"
          onChange={(value) => onStatusChange(value as OrderFilterStatus)}
        />

        <SortDropdown
          label="Sort"
          value={sort}
          options={sortOptions}
          placeholder="Newest"
          onChange={(value) => onSortChange(value as OrderSortOption)}
        />

        <button
          type="button"
          onClick={onReset}
          className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
        >
          <RotateCcw className="size-4" />
          Reset Filter
        </button>
      </div>
    </section>
  )
}
