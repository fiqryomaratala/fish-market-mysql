import { ArrowLeft, Calendar, CreditCard, MapPin, Package } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useOrderDetail } from '@/hooks/useCheckout'

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function OrderDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, error, refetch } = useOrderDetail(id)

  if (isLoading) {
    return (
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70">
        <div className="h-8 w-48 animate-pulse rounded-full bg-slate-200" />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[1.75rem] border border-red-200 bg-white px-6 py-12 text-center shadow-lg shadow-red-100/70">
        <h1 className="text-2xl font-semibold text-slate-900">Detail order belum tersedia.</h1>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-6 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate('/orders')}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
      >
        <ArrowLeft className="size-4" />
        Back to Orders
      </button>

      <section className="rounded-[1.75rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.18),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.14),_transparent_26%),linear-gradient(135deg,_#ffffff_0%,_#f8fafc_54%,_#ecfeff_100%)] p-6 shadow-2xl shadow-slate-200/70">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">
          Order Detail
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">{data.invoice_number}</h1>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Calendar className="size-4 text-blue-600" />
            Order Date
          </div>
          <p className="mt-2 text-sm text-slate-500">
            {data.created_at ? dateFormatter.format(new Date(data.created_at)) : '-'}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <CreditCard className="size-4 text-emerald-600" />
            Payment Status
          </div>
          <p className="mt-2 text-sm text-slate-500">{data.payment_status}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Package className="size-4 text-sky-600" />
            Total Item
          </div>
          <p className="mt-2 text-sm text-slate-500">{data.items.length} item</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
          <p className="text-sm font-semibold text-slate-700">Total Price</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {currencyFormatter.format(data.total_price)}
          </p>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
            <MapPin className="size-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Shipping Address</p>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              {data.shipping_address || '-'}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default OrderDetailPage
