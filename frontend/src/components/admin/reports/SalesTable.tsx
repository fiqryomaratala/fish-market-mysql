import type { SalesReportRow } from '@/types/report'
import { formatCurrency, formatDate } from '@/utils/format'

type SalesTableProps = {
  rows: SalesReportRow[]
}

function getStatusClasses(status: string) {
  const normalized = status.toLowerCase()

  if (normalized === 'completed') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  }

  if (normalized === 'processing' || normalized === 'shipping' || normalized === 'paid') {
    return 'border-cyan-200 bg-cyan-50 text-cyan-700'
  }

  if (normalized === 'cancelled') {
    return 'border-red-200 bg-red-50 text-red-700'
  }

  return 'border-amber-200 bg-amber-50 text-amber-700'
}

export function SalesTable({ rows }: SalesTableProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600">
            Tabel Penjualan
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">Transaksi terbaru</h3>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="pb-3 font-medium">Invoice</th>
              <th className="pb-3 font-medium">Customer</th>
              <th className="pb-3 font-medium">Total</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-100 text-slate-700 last:border-b-0">
                <td className="py-4 font-semibold text-slate-900">{row.invoice}</td>
                <td className="py-4">{row.customer}</td>
                <td className="py-4">{formatCurrency(row.total)}</td>
                <td className="py-4">
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(row.status)}`}>
                    {row.status}
                  </span>
                </td>
                <td className="py-4">{formatDate(row.date, { day: '2-digit', month: 'short', year: 'numeric' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
