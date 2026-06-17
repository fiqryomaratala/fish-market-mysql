import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge'
import type { LatestOrderItem } from '@/types/dashboard'
import { formatCurrency, formatDate } from '@/utils/format'

type LatestOrderTableProps = {
  orders: LatestOrderItem[]
}

export function LatestOrderTable({ orders }: LatestOrderTableProps) {
  return (
    <section className="rounded-xl border border-white/60 bg-white/75 p-6 shadow-lg shadow-slate-200/45 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
            Pesanan Terbaru
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Order Terbaru</h2>
        </div>
        <Link
          to="/admin/orders"
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
        >
          Lihat Semua
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              <th className="px-4">Invoice</th>
              <th className="px-4">Customer</th>
              <th className="px-4">Total</th>
              <th className="px-4">Status</th>
              <th className="px-4">Date</th>
              <th className="px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="rounded-xl bg-slate-50/80 text-sm text-slate-700">
                <td className="rounded-l-xl px-4 py-4 font-semibold text-slate-900">{order.invoice}</td>
                <td className="px-4 py-4">{order.customer}</td>
                <td className="px-4 py-4 font-medium text-slate-900">{formatCurrency(order.total)}</td>
                <td className="px-4 py-4">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-4 py-4">{formatDate(order.date)}</td>
                <td className="rounded-r-xl px-4 py-4">
                  <Link
                    to={`/orders/${order.id}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                  >
                    Lihat Detail
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
