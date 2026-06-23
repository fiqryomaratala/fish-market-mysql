import { AlertTriangle } from 'lucide-react'
import type { Inventory } from '@/types/inventory'
import { formatNumber } from '@/utils/format'

type LowStockAlertProps = {
  items: Inventory[]
  onOpenAdjust: (inventory: Inventory) => void
  canAdjust?: boolean
  actionLabel?: string
}

export function LowStockAlert({
  items,
  onOpenAdjust,
  canAdjust = true,
  actionLabel = 'Sesuaikan Stok',
}: LowStockAlertProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <section className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-lg shadow-amber-100/50">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-3">
          <div className="rounded-xl bg-white p-3 text-amber-600">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Peringatan stok menipis</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Ada {items.length} item yang stoknya sudah menyentuh batas minimum.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {items.slice(0, 4).map((item) => (
          <article key={item.id} className="rounded-xl border border-amber-200 bg-white px-4 py-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-slate-900">{item.name}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {item.sku} • {item.category}
                </p>
              </div>
              <div className="text-sm text-slate-600">
                <span className="font-semibold text-amber-700">{formatNumber(item.stock)}</span> / min{' '}
                {formatNumber(item.minimum_stock)}
              </div>
            </div>
            {canAdjust ? (
              <button
                type="button"
                onClick={() => onOpenAdjust(item)}
                className="mt-3 rounded-xl border border-amber-200 px-3 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-50"
              >
                {actionLabel}
              </button>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}
