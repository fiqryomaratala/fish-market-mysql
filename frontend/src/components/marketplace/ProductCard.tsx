import { Package2 } from 'lucide-react'
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

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate()

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image_url || FALLBACK_PLACEHOLDER_IMAGE}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="space-y-3">
          <div className="min-h-[3.5rem]">
            <h3 className="text-lg font-semibold leading-7 text-slate-900">
              {product.name}
            </h3>
          </div>
          <p className="text-base font-semibold text-blue-700">
            {currencyFormatter.format(product.price)}
          </p>
        </div>

        <div className="mt-4 grid gap-2 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Package2 className="size-4 text-green-600" />
            <span>Stok {product.stock}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/products/${product.id}`)}
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
        >
          Lihat Detail
        </button>
      </div>
    </article>
  )
}
