import { AlertTriangle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { InventoryAlertItem } from '@/types/dashboard'
import { formatNumber } from '@/utils/format'

type InventoryAlertCardProps = {
  items: InventoryAlertItem[]
}

export function InventoryAlertCard({ items }: InventoryAlertCardProps) {
  return (
    <section className="rounded-xl border border-amber-100 bg-linear-to-br from-white/80 via-amber-50/70 to-white/80 p-6 shadow-lg shadow-amber-100/40 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-600">
            Peringatan Inventaris
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Stok Hampir Habis</h2>
        </div>
        <span className="flex size-12 items-center justify-center rounded-xl bg-amber-500 text-white">
          <AlertTriangle className="size-5" />
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-white/80 bg-white/75 p-4 transition hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.product}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                  Batch {item.batch_code || '-'}
                </p>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                {formatNumber(item.quantity)} {item.unit}
              </span>
            </div>
          </article>
        ))}
      </div>

      <Link
        to="/admin/inventory"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-amber-600"
      >
        Kelola Inventaris
        <ArrowRight className="size-4" />
      </Link>
    </section>
  )
}
