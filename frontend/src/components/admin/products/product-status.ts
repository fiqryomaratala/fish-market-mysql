import type { ProductStatus } from '@/types/product'

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  available: 'Tersedia',
  out_of_stock: 'Stok Habis',
  hidden: 'Disembunyikan',
}

export const PRODUCT_STATUS_STYLES: Record<ProductStatus, string> = {
  available: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  out_of_stock: 'border-amber-200 bg-amber-50 text-amber-700',
  hidden: 'border-slate-200 bg-slate-100 text-slate-600',
}

export function getProductStatusLabel(status: string) {
  return PRODUCT_STATUS_LABELS[status as ProductStatus] ?? status
}

export function getProductStatusClasses(status: string) {
  return (
    PRODUCT_STATUS_STYLES[status as ProductStatus] ??
    'border-slate-200 bg-slate-100 text-slate-600'
  )
}
