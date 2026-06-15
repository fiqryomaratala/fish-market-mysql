import { RefreshCcw, ShoppingBag } from 'lucide-react'
import { CheckoutButton } from '@/components/checkout/CheckoutButton'
import type { CartItem } from '@/types/cart'

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

type OrderSummaryProps = {
  items: CartItem[]
  totalItems: number
  subtotal: number
  shippingFee: number
  isSubmitting: boolean
  isRefreshing: boolean
  submitError?: string | null
  onRetry: () => void
}

export function OrderSummary({
  items,
  totalItems,
  subtotal,
  shippingFee,
  isSubmitting,
  isRefreshing,
  submitError,
  onRetry,
}: OrderSummaryProps) {
  const grandTotal = subtotal + shippingFee

  return (
    <aside className="space-y-6 xl:sticky xl:top-28 xl:self-start">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
              Order Summary
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Ringkasan Pesanan</h2>
          </div>
          {isRefreshing ? (
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
              Syncing
            </span>
          ) : null}
        </div>

        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="flex gap-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4"
            >
              <img
                src={item.image_url}
                alt={item.name}
                className="size-20 rounded-xl object-cover shadow-md shadow-slate-200"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{item.name}</p>
                <p className="mt-1 text-xs text-slate-500">Qty {item.quantity}</p>
                <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                  <span className="text-slate-500">{currencyFormatter.format(item.price)}</span>
                  <span className="font-semibold text-slate-900">
                    {currencyFormatter.format(item.subtotal)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Total Item</span>
            <span className="font-semibold text-slate-900">{totalItems}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-900">
              {currencyFormatter.format(subtotal)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Shipping Fee</span>
            <span className="font-semibold text-slate-900">
              {currencyFormatter.format(shippingFee)}
            </span>
          </div>
          <div className="border-t border-dashed border-slate-200 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">Grand Total</span>
              <span className="text-xl font-semibold text-slate-900">
                {currencyFormatter.format(grandTotal)}
              </span>
            </div>
          </div>
        </div>

        {submitError ? (
          <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <p className="font-semibold">Checkout gagal</p>
            <p className="mt-1 leading-6">{submitError}</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2 font-semibold text-rose-600 transition hover:bg-rose-100"
            >
              <RefreshCcw className="size-4" />
              Retry
            </button>
          </div>
        ) : null}

        <div className="mt-6 space-y-3">
          <CheckoutButton disabled={items.length === 0 || isSubmitting} isLoading={isSubmitting} />
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            <ShoppingBag className="size-4 text-blue-600" />
            <span>Produk diambil langsung dari cart backend aktif Anda.</span>
          </div>
        </div>
      </section>
    </aside>
  )
}
