import { Calendar, CreditCard, MapPin, Package } from 'lucide-react'
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge'
import type { Order } from '@/types/order'

type OrderCardProps = {
  order: Order
  onViewDetail: (orderId: number) => void
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

export function OrderCard({ order, onViewDetail }: OrderCardProps) {
  return (
    <article className="order-card group rounded-xl border border-slate-200 bg-white p-5 transition duration-300 hover:border-emerald-200 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
            Nomor Invoice
          </p>
          <h3 className="mt-2 truncate text-xl font-semibold text-slate-900">
            {order.invoice_number}
          </h3>
        </div>

        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="order-subcard rounded-xl border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Calendar className="size-4 text-blue-600" />
            Tanggal Pesanan
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {order.created_at ? dateFormatter.format(new Date(order.created_at)) : '-'}
          </p>
        </div>

        <div className="order-subcard rounded-xl border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <CreditCard className="size-4 text-emerald-600" />
            Metode Pembayaran
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-500">{order.payment_method}</p>
        </div>

        <div className="order-subcard rounded-xl border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Package className="size-4 text-sky-600" />
            Total Item
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-500">{order.total_item} item</p>
        </div>

        <div className="order-subcard rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-700">Total Harga</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {currencyFormatter.format(order.total)}
          </p>
        </div>
      </div>

      <div className="order-subcard mt-4 rounded-xl border border-slate-100 bg-[linear-gradient(135deg,_rgba(239,246,255,0.9),_rgba(236,253,245,0.9))] p-4">
        <div className="flex items-start gap-3">
          <div className="order-subcard rounded-lg border border-slate-100 bg-white p-2 text-emerald-600">
            <MapPin className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800">{order.shipping_name}</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">{order.shipping_address}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={() => onViewDetail(order.id)}
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-emerald-600"
        >
          Lihat Detail
        </button>
      </div>
    </article>
  )
}
