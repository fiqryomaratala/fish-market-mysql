import {
  getInventoryStatusClasses,
  getInventoryStatusLabel,
} from '@/types/inventory'
import type { InventoryReportRow } from '@/types/report'
import { formatNumber } from '@/utils/format'

type InventoryTableProps = {
  rows: InventoryReportRow[]
}

export function InventoryTable({ rows }: InventoryTableProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600">
          Tabel Inventaris
        </p>
        <h3 className="mt-2 text-2xl font-semibold text-slate-900">Status stok item</h3>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="pb-3 font-medium">SKU</th>
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">Stock</th>
              <th className="pb-3 font-medium">Minimum Stock</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-100 text-slate-700 last:border-b-0">
                <td className="py-4 font-semibold text-slate-900">{row.sku}</td>
                <td className="py-4">{row.name}</td>
                <td className="py-4">{row.category}</td>
                <td className="py-4">{formatNumber(row.stock)}</td>
                <td className="py-4">{formatNumber(row.minimum_stock)}</td>
                <td className="py-4">
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getInventoryStatusClasses(row.status)}`}>
                    {getInventoryStatusLabel(row.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
