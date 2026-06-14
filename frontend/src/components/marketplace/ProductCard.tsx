import { CalendarDays, MapPin, Package2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { FALLBACK_PLACEHOLDER_IMAGE } from '@/services/product.service'
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

function formatHarvestDate(value: string) {
  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return '-'
  }

  return dateFormatter.format(parsed)
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate()

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/70 transition duration-300 hover:-translate-y-2 hover:border-blue-200">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image_url || FALLBACK_PLACEHOLDER_IMAGE}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <span className="rounded-full border border-emerald-200 bg-emerald-50/95 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-lg shadow-slate-200">
            {product.category || 'Tanpa Kategori'}
          </span>
          <span className="rounded-full border border-blue-200 bg-white/95 px-3 py-1 text-xs font-semibold text-blue-600 shadow-lg shadow-slate-200 backdrop-blur">
            {product.batch_code || '-'}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="space-y-4">
          <div className="min-h-[4rem]">
            <h3 className="text-lg font-semibold leading-8 text-slate-900">
              {product.name}
            </h3>
          </div>
          <p className="mt-1 text-sm font-semibold text-green-700">
            {currencyFormatter.format(product.price)}
          </p>
        </div>

        <div className="mt-4 grid gap-2 text-sm text-slate-500">
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

        <button
          type="button"
          onClick={() => navigate(`/products/${product.id}`)}
          className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
        >
          Lihat Detail
        </button>
      </div>
    </article>
  )
}
