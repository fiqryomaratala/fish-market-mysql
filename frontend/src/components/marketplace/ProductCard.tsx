import { CalendarDays, MapPin, Package2, ShoppingCart, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '@/types/product'

type ProductCardProps = {
  product: Product
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

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/70 transition duration-300 hover:-translate-y-2 hover:border-blue-200">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <span className="rounded-full border border-blue-200 bg-white/95 px-3 py-1 text-xs font-semibold text-blue-600 shadow-lg shadow-slate-200 backdrop-blur">
            {product.category}
          </span>
          <span className="rounded-full border border-emerald-200 bg-emerald-50/95 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-lg shadow-slate-200">
            Batch {product.batch_code}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
            <p className="mt-1 text-sm font-semibold text-green-700">
              {currencyFormatter.format(product.price)}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-right">
            <div className="flex items-center justify-end gap-1 text-amber-500">
              <Star className="size-4 fill-current" />
              <span className="text-sm font-semibold text-slate-900">
                {product.rating.toFixed(1)}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">{product.sold_count} sold</p>
          </div>
        </div>

        <div className="grid gap-2 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Package2 className="size-4 text-blue-600" />
            <span>Stock {product.stock}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-blue-600" />
            <span>{product.farm_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 text-blue-600" />
            <span>Harvest {dateFormatter.format(new Date(product.harvest_date))}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            to={`/products/${product.id}`}
            className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          >
            View Detail
          </Link>
          <button
            type="button"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
          >
            <ShoppingCart className="size-4" />
            Add To Cart
          </button>
        </div>
      </div>
    </article>
  )
}
