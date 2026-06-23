import {
  getFishBatchStatusClasses,
  getFishBatchStatusLabel,
} from '@/types/fish-batch'
import type { FishBatchReportRow } from '@/types/report'
import { formatNumber } from '@/utils/format'

type FishBatchTableProps = {
  rows: FishBatchReportRow[]
}

export function FishBatchTable({ rows }: FishBatchTableProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600">
          Tabel Batch Ikan
        </p>
        <h3 className="mt-2 text-2xl font-semibold text-slate-900">Batch aktif dan historis</h3>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="pb-3 font-medium">Batch Code</th>
              <th className="pb-3 font-medium">Fish Type</th>
              <th className="pb-3 font-medium">Pond</th>
              <th className="pb-3 font-medium">Current Qty</th>
              <th className="pb-3 font-medium">Survival Rate</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-100 text-slate-700 last:border-b-0">
                <td className="py-4 font-semibold text-slate-900">{row.batch_code}</td>
                <td className="py-4">{row.fish_type}</td>
                <td className="py-4">{row.pond}</td>
                <td className="py-4">{formatNumber(row.current_qty)}</td>
                <td className="py-4">{row.survival_rate.toFixed(1)}%</td>
                <td className="py-4">
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getFishBatchStatusClasses(row.status)}`}>
                    {getFishBatchStatusLabel(row.status)}
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
