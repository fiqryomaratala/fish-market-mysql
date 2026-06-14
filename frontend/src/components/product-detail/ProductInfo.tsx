import { BadgeCheck, Package2, Scale, Waves } from 'lucide-react'
import type { Product } from '@/types/product'

type ProductInfoProps = {
  product: Product
  formattedPrice: string
  categoryLabel: string
  stockLabel: string
  statusToneClassName: string
}

export function ProductInfo({
  product,
  formattedPrice,
  categoryLabel,
  stockLabel,
  statusToneClassName,
}: ProductInfoProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70 md:p-7">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
          {categoryLabel}
        </span>
        <span
          className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] ${statusToneClassName}`}
        >
          {product.status}
        </span>
      </div>

      <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
        {product.name}
      </h1>

      <p className="mt-4 text-3xl font-semibold text-green-700 md:text-4xl">{formattedPrice}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-3 text-slate-600">
            <Package2 className="size-4 text-blue-600" />
            <span className="text-sm font-medium">Stock</span>
          </div>
          <p className="mt-3 text-lg font-semibold text-slate-900">{stockLabel}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-3 text-slate-600">
            <Scale className="size-4 text-blue-600" />
            <span className="text-sm font-medium">Weight</span>
          </div>
          <p className="mt-3 text-lg font-semibold text-slate-900">{product.weight || '-'}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-3 text-slate-600">
            <BadgeCheck className="size-4 text-blue-600" />
            <span className="text-sm font-medium">Batch</span>
          </div>
          <p className="mt-3 text-lg font-semibold text-slate-900">{product.batch_code || '-'}</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-[linear-gradient(135deg,_rgba(239,246,255,0.95),_rgba(248,250,252,0.9))] p-5">
        <div className="flex items-center gap-3 text-slate-700">
          <Waves className="size-5 text-blue-600" />
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Product Description
          </p>
        </div>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          {product.description || 'Deskripsi produk belum tersedia.'}
        </p>
      </div>
    </section>
  )
}
