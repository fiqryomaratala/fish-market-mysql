import type { CustomerReportRow } from '@/types/report'
import { formatCurrency, formatDate, formatNumber } from '@/utils/format'

type CustomerTableProps = {
  rows: CustomerReportRow[]
}

export function CustomerTable({ rows }: CustomerTableProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600">
          Tabel Pelanggan
        </p>
        <h3 className="mt-2 text-2xl font-semibold text-slate-900">Kinerja pelanggan</h3>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="pb-3 font-medium">Customer</th>
              <th className="pb-3 font-medium">Orders</th>
              <th className="pb-3 font-medium">Total Spending</th>
              <th className="pb-3 font-medium">Last Order</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-slate-100 text-slate-700 last:border-b-0">
                <td className="py-4 font-semibold text-slate-900">{row.customer}</td>
                <td className="py-4">{formatNumber(row.orders)}</td>
                <td className="py-4">{formatCurrency(row.total_spending)}</td>
                <td className="py-4">{row.last_order ? formatDate(row.last_order, { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
