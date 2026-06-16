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

const statusLabelMap: Record<OrderFilterStatus, string> = {
  All: 'Semua',
  Pending: 'Menunggu',
  Paid: 'Dibayar',
  Processing: 'Diproses',
  Shipping: 'Dikirim',
  Completed: 'Selesai',
  Cancelled: 'Dibatalkan',
}

const sortOptions: Array<{ label: string; value: OrderSortOption }> = [
  { label: 'Terbaru', value: 'Newest' },
  { label: 'Terlama', value: 'Oldest' },
  { label: 'Total Tertinggi', value: 'Highest Total' },
  { label: 'Total Terendah', value: 'Lowest Total' },
]

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
    <section className="order-card rounded-[1.75rem] border border-slate-200 bg-white/95 p-5 backdrop-blur md:p-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_auto]">
        <OrderSearch value={search} onChange={onSearchChange} />

        <SortDropdown
          label="Status"
          value={status}
          options={statusOptions.map((option) => ({
            label: statusLabelMap[option],
            value: option,
          }))}
          placeholder="Semua"
          onChange={(value) => onStatusChange(value as OrderFilterStatus)}
        />

        <SortDropdown
          label="Urutkan"
          value={sort}
          options={sortOptions}
          placeholder="Terbaru"
          onChange={(value) => onSortChange(value as OrderSortOption)}
        />

        <div className="flex items-end">
          <button
            type="button"
            onClick={onReset}
            className="order-subcard inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 xl:w-auto"
          >
            <RotateCcw className="size-4" />
            Reset Filter
          </button>
        </div>
      </div>
    </section>
  )
}
