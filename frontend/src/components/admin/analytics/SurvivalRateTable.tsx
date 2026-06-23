// Komponen Survival Rate Table untuk Analytics Dashboard
import type { SurvivalRateAnalytics } from '@/types/analytics'
import { formatNumber } from '@/utils/format'

type SurvivalRateTableProps = {
  data: SurvivalRateAnalytics[]
}

export function SurvivalRateTable({ data }: SurvivalRateTableProps) {
  const sortedData = [...data].sort((a, b) => b.survival_rate - a.survival_rate).slice(0, 10)
  
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600">
            Survival Rate Analytics
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">Analisis tingkat kelangsungan hidup</h3>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
          {formatNumber(data.length)} batch
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                Batch Code
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                Jenis Ikan
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                Survival Rate
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                Berat Panen
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                Kolam
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sortedData.map((item) => {
              const survivalPercentage = (item.survival_rate * 100).toFixed(1)
              const statusColor = item.survival_rate >= 0.8 ? 'bg-emerald-100 text-emerald-800' :
                                 item.survival_rate >= 0.6 ? 'bg-amber-100 text-amber-800' :
                                 'bg-red-100 text-red-800'
              const statusText = item.survival_rate >= 0.8 ? 'Excellent' :
                                 item.survival_rate >= 0.6 ? 'Good' :
                                 'Poor'
              
              return (
                <tr key={item.batch_id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="font-medium text-slate-900">{item.batch_code}</div>
                    <div className="text-xs text-slate-500">ID: {item.batch_id}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{item.fish_type}</div>
                    <div className="text-xs text-slate-500">
                      {formatNumber(item.initial_quantity)} → {formatNumber(item.current_quantity)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-slate-200">
                        <div 
                          className="h-2 rounded-full"
                          style={{ 
                            width: `${survivalPercentage}%`,
                            backgroundColor: item.survival_rate >= 0.8 ? '#10b981' :
                                            item.survival_rate >= 0.6 ? '#f59e0b' :
                                            '#ef4444'
                          }}
                        ></div>
                      </div>
                      <span className="font-medium text-slate-900">{survivalPercentage}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{formatNumber(item.harvest_weight)} kg</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{item.pond_name}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusColor}`}>
                      {statusText}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="mt-6 flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-slate-100 p-4 text-slate-400">
            <svg className="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">Tidak ada data</h3>
          <p className="mt-2 text-sm text-slate-600">Belum ada data survival rate yang tersedia.</p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-slate-600">
            Menampilkan <strong>{sortedData.length}</strong> dari <strong>{data.length}</strong> batch dengan survival rate tertinggi
          </p>
          <button className="text-sm font-medium text-cyan-600 hover:text-cyan-700">
            Lihat semua →
          </button>
        </div>
      </div>
    </section>
  )
}