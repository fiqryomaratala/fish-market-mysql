import { Eye, Pencil, Trash2 } from 'lucide-react'
import { FALLBACK_PLACEHOLDER_IMAGE } from '@/services/product.service'
import type { Product } from '@/types/product'
import { formatCurrency, formatDate, formatNumber } from '@/utils/format'
import { ProductStatusBadge } from './ProductStatusBadge'

type ProductRowProps = {
  product: Product
  onView: (product: Product) => void
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export function ProductRow({ product, onView, onEdit, onDelete }: ProductRowProps) {
  return (
    <>
      <div className="grid gap-4 rounded-2xl border border-slate-100 p-4 lg:hidden">
        <div className="flex items-start gap-4">
          <img
            src={product.image_url || FALLBACK_PLACEHOLDER_IMAGE}
            alt={product.name}
            className="h-20 w-20 rounded-2xl border border-slate-200 object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold text-slate-900">{product.name}</p>
            <p className="mt-1 line-clamp-2 text-sm text-slate-500">{product.description || '-'}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {product.category}
              </span>
              <ProductStatusBadge status={product.status} />
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Harga</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">{formatCurrency(product.price)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Stok</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">{formatNumber(product.stock)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Dibuat</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">{formatDate(product.created_at)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onView(product)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-200 hover:text-cyan-700"
          >
            <Eye className="size-4" />
            Lihat
          </button>
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700"
          >
            <Pencil className="size-4" />
            Ubah
          </button>
          <button
            type="button"
            onClick={() => onDelete(product)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:text-red-700"
          >
            <Trash2 className="size-4" />
            Hapus
          </button>
        </div>
      </div>

      <div className="hidden grid-cols-[90px_1.8fr_1fr_1fr_0.8fr_0.9fr_1fr_120px] items-center gap-4 border-t border-slate-100 px-6 py-4 lg:grid">
        <img
          src={product.image_url || FALLBACK_PLACEHOLDER_IMAGE}
          alt={product.name}
          className="h-16 w-20 rounded-2xl border border-slate-200 object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{product.name}</p>
          <p className="mt-1 truncate text-sm text-slate-500">{product.description || '-'}</p>
        </div>
        <p className="text-sm text-slate-600">{product.category}</p>
        <p className="text-sm font-medium text-slate-700">{formatCurrency(product.price)}</p>
        <p className="text-sm text-slate-600">{formatNumber(product.stock)}</p>
        <ProductStatusBadge status={product.status} />
        <p className="text-sm text-slate-600">{formatDate(product.created_at)}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onView(product)}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-cyan-200 hover:text-cyan-700"
          >
            <Eye className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-emerald-200 hover:text-emerald-700"
          >
            <Pencil className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(product)}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-red-200 hover:text-red-700"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </>
  )
}
