import { CheckCircle2, ReceiptText, RefreshCcw } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
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

function getErrorMessage(error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response &&
    typeof error.response.data === 'object' &&
    error.response.data !== null &&
    'message' in error.response.data &&
    typeof error.response.data.message === 'string'
  ) {
    return error.response.data.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Detail order belum bisa dimuat.'
}

function OrderSuccessPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated, loading } = useAuth()
  const { data, isLoading, error, refetch, isFetching } = useOrderDetail(id)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', {
        replace: true,
        state: {
          from: {
            pathname: `/orders/success/${id ?? ''}`,
          },
        },
      })
    }
  }, [id, isAuthenticated, loading, navigate])

  if (loading || isLoading) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center rounded-[2rem] border border-slate-200 bg-white px-6 py-12 text-center shadow-xl shadow-slate-200/70">
        <div className="rounded-full bg-blue-50 p-5 text-blue-600">
          <RefreshCcw className="size-8 animate-spin" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold text-slate-900">Memuat detail order</h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
          Kami sedang mengambil data terbaru dari endpoint order detail.
        </p>
      </section>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (error || !data) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center rounded-[2rem] border border-rose-200 bg-white px-6 py-12 text-center shadow-xl shadow-rose-100/70">
        <div className="rounded-full bg-rose-50 p-5 text-rose-500">
          <ReceiptText className="size-8" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold text-slate-900">Detail order belum tersedia</h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
          {getErrorMessage(error)}
        </p>
        <button
          type="button"
          onClick={() => {
            void refetch()
          }}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5 hover:bg-rose-600"
        >
          <RefreshCcw className={`size-4 ${isFetching ? 'animate-spin' : ''}`} />
          Retry
        </button>
      </section>
    )
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_24%),linear-gradient(135deg,_#ffffff_0%,_#f8fafc_55%,_#ecfeff_100%)] p-6 shadow-2xl shadow-slate-200/70 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-600">
              Order Success
            </p>
            <div className="mt-4 flex items-start gap-4">
              <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-600">
                <CheckCircle2 className="size-8" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-slate-900 md:text-5xl">
                  Pesanan Anda berhasil dibuat.
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500 md:text-base">
                  Order tersimpan di backend dan detailnya diambil dari endpoint `GET /orders/:id`.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-lg shadow-slate-200/60">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Invoice
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{data.invoice_number}</p>
            <p className="mt-2 text-sm text-slate-500">Status: {data.status}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Order ID
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">#{data.id}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Tanggal
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {data.created_at ? dateFormatter.format(new Date(data.created_at)) : '-'}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Payment
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{data.payment_status}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Customer
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{data.customer || '-'}</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
              Shipping Address
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {data.shipping_address || 'Alamat pengiriman tidak tersedia.'}
            </p>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <p className="text-lg font-semibold text-slate-900">Item Pesanan</p>
            </div>
            <div className="divide-y divide-slate-100">
              {data.items.map((item) => (
                <div key={item.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.product}</p>
                    <p className="mt-1 text-sm text-slate-500">Qty {item.quantity}</p>
                  </div>
                  <div className="text-sm text-slate-500 sm:text-right">
                    <p>{currencyFormatter.format(item.price)}</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {currencyFormatter.format(item.subtotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="xl:sticky xl:top-28 xl:self-start">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
              Summary
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Total Pembayaran</h2>
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Total Item</span>
                <span className="font-semibold text-slate-900">{data.items.length}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Grand Total</span>
                <span className="text-2xl font-semibold text-slate-900">
                  {currencyFormatter.format(data.total_price)}
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Kembali Belanja
              </Link>
              <Link
                to="/cart"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
              >
                Lihat Cart
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default OrderSuccessPage
