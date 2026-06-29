import { ShoppingBag } from 'lucide-react'
import { FALLBACK_PLACEHOLDER_IMAGE } from '@/services/product.service'
import type { TopSellingProductData } from '@/types/dashboard'
import { formatCurrency, formatNumber } from '@/utils/format'

type TopSellingProductProps = {
  product: TopSellingProductData | null | undefined
}

function resolveImageUrl(imageUrl: string) {
  if (!imageUrl) {
    return FALLBACK_PLACEHOLDER_IMAGE
  }

  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl
  }

  const baseUrl = import.meta.env.VITE_API_URL

  if (!baseUrl) {
    return imageUrl
  }

  try {
    return new URL(imageUrl, new URL(baseUrl).origin).toString()
  } catch {
    return imageUrl
  }
}

export function TopSellingProduct({ product }: TopSellingProductProps) {
  if (!product) {
    return (
      <section className="admin-dashboard-panel rounded-xl border border-white/60 bg-white/72 p-6 shadow-lg shadow-slate-200/45 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <ShoppingBag className="size-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">
              Produk Terlaris
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Belum Ada Data Penjualan</h2>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="admin-dashboard-panel overflow-hidden rounded-xl border border-white/60 bg-white/72 shadow-lg shadow-slate-200/45 backdrop-blur-xl">
      <div className="bg-blue-600 p-6 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
          Produk Terlaris
        </p>
        <h2 className="mt-2 text-2xl font-semibold">Produk Terlaris</h2>
      </div>

      <div className="p-6">
        <div className="admin-dashboard-subpanel overflow-hidden rounded-xl bg-slate-100">
          <img
            src={resolveImageUrl(product.image_url)}
            alt={product.product_name}
            className="h-48 w-full object-cover"
          />
        </div>

        <div className="mt-5">
          <h3 className="text-xl font-semibold text-slate-900">{product.product_name}</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="admin-dashboard-subpanel rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Terjual</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {formatNumber(product.sold)}
              </p>
            </div>
            <div className="admin-dashboard-subpanel rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Pendapatan</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {formatCurrency(product.revenue)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
