import { CalendarDays } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge'
import type { Order } from '@/types/order'

type RecentOrderCardProps = {
  order: Order
}

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function RecentOrderCard({ order }: RecentOrderCardProps) {
  const navigate = useNavigate()

  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-white">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Invoice</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">{order.invoice_number}</h3>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mt-4 flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex items-center gap-2">
          <CalendarDays className="size-4 text-emerald-600" />
          <span>{order.created_at ? dateFormatter.format(new Date(order.created_at)) : '-'}</span>
        </div>
        <p className="font-semibold text-slate-900">{currencyFormatter.format(order.total)}</p>
      </div>

      <button
        type="button"
        onClick={() => navigate(`/orders/${order.id}`)}
        className="mt-4 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
      >
        View Detail
      </button>
    </article>
  )
}
