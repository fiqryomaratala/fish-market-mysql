import { ArrowRight, CalendarDays, MapPin, Package2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FALLBACK_PLACEHOLDER_IMAGE } from '@/services/product.service'
import type { Product } from '@/types/product'

type RelatedProductsProps = {
  products: Product[]
}

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

function formatHarvestDate(value: string) {
  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return '-'
  }

  return dateFormatter.format(parsed)
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) {
    return null
  }

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-600">
            Related Product
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Pilihan lain yang serupa</h2>
        </div>
        <Link
          to="/products"
          className="hidden items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600 md:inline-flex"
        >
          Lihat semua
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <article
            key={product.id}
            className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/70 transition duration-300 hover:-translate-y-1.5 hover:border-blue-200"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={product.image_url || FALLBACK_PLACEHOLDER_IMAGE}
                alt={product.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute left-4 top-4 rounded-full border border-white/60 bg-white/90 px-3 py-1 text-xs font-semibold text-blue-600 shadow-md">
                {product.category || 'Tanpa Kategori'}
              </div>
            </div>

            <div className="space-y-4 p-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
                <p className="mt-2 text-base font-semibold text-green-700">
                  {currencyFormatter.format(product.price)}
                </p>
              </div>

              <div className="space-y-2 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Package2 className="size-4 text-blue-600" />
                  <span>Stok {product.stock}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-blue-600" />
                  <span>{product.farm_name || '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-blue-600" />
                  <span>Panen {formatHarvestDate(product.harvest_date)}</span>
                </div>
              </div>

              <Link
                to={`/products/${product.id}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
              >
                Lihat Detail
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
