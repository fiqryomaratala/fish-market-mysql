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
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-950/75 shadow-lg shadow-slate-950/40 transition duration-300 hover:-translate-y-1.5 hover:border-cyan-300/35 hover:shadow-cyan-950/30">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <span className="rounded-full border border-white/15 bg-slate-950/65 px-3 py-1 text-xs font-medium text-cyan-100 backdrop-blur">
            {product.category}
          </span>
          <span className="rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-100">
            Batch {product.batch_code}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-white">{product.name}</h3>
            <p className="mt-1 text-sm text-cyan-100">{currencyFormatter.format(product.price)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right">
            <div className="flex items-center justify-end gap-1 text-amber-300">
              <Star className="size-4 fill-current" />
              <span className="text-sm font-semibold">{product.rating.toFixed(1)}</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">{product.sold_count} sold</p>
          </div>
        </div>

        <div className="grid gap-2 text-sm text-slate-300">
          <div className="flex items-center gap-2">
            <Package2 className="size-4 text-cyan-300" />
            <span>Stock {product.stock}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-cyan-300" />
            <span>{product.farm_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 text-cyan-300" />
            <span>Harvest {dateFormatter.format(new Date(product.harvest_date))}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            to={`/products/${product.id}`}
            className="inline-flex flex-1 items-center justify-center rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-cyan-400/10"
          >
            View Detail
          </Link>
          <button
            type="button"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            <ShoppingCart className="size-4" />
            Add To Cart
          </button>
        </div>
      </div>
    </article>
  )
}
