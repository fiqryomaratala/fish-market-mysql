// Komponen Inventory Analytics Table untuk Analytics Dashboard
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import type { InventoryAnalytics } from '@/types/analytics'
import { formatNumber } from '@/utils/format'

type InventoryAnalyticsTableProps = {
  data: InventoryAnalytics[]
}

export function InventoryAnalyticsTable({ data }: InventoryAnalyticsTableProps) {
  const sortedData = [...data].sort((a, b) => {
    // Urutkan berdasarkan status: out_of_stock → low → adequate
    const statusOrder = { out_of_stock: 0, low: 1, adequate: 2 }
    return statusOrder[a.status] - statusOrder[b.status] || b.current_stock - a.current_stock
  }).slice(0, 15)
  
  const getStatusIcon = (status: InventoryAnalytics['status']) => {
    switch (status) {
      case 'out_of_stock':
        return <XCircle className="size-5 text-red-500" />
      case 'low':
        return <AlertTriangle className="size-5 text-amber-500" />
      case 'adequate':
        return <CheckCircle className="size-5 text-emerald-500" />
    }
  }
  
  const getStatusText = (status: InventoryAnalytics['status']) => {
    switch (status) {
      case 'out_of_stock':
        return 'Habis'
      case 'low':
        return 'Stok Rendah'
      case 'adequate':
        return 'Cukup'
    }
  }
  
  const getStatusColor = (status: InventoryAnalytics['status']) => {
    switch (status) {
      case 'out_of_stock':
        return 'bg-red-100 text-red-800'
      case 'low':
        return 'bg-amber-100 text-amber-800'
      case 'adequate':
        return 'bg-emerald-100 text-emerald-800'
    }
  }
  
  const getStockPercentage = (item: InventoryAnalytics) => {
    if (item.minimum_stock <= 0) return 100
    const percentage = (item.current_stock / item.minimum_stock) * 100
    return Math.min(percentage, 100)
  }
  
  const getStockBarColor = (item: InventoryAnalytics) => {
    const percentage = getStockPercentage(item)
    if (percentage <= 0) return '#ef4444'
    if (percentage <= 50) return '#f59e0b'
    if (percentage <= 80) return '#84cc16'
    return '#10b981'
  }
  
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600">
            Inventory Analytics
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">Analisis inventaris produk</h3>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
          {formatNumber(data.length)} produk
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                Produk
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                Jenis Ikan
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                Stok Saat Ini
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                Stok Minimum
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                Persentase
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                Terakhir Diperbarui
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sortedData.map((item) => {
              const percentage = getStockPercentage(item)
              const barColor = getStockBarColor(item)
              
              return (
                <tr key={item.product_id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="font-medium text-slate-900">{item.product_name}</div>
                    <div className="text-xs text-slate-500">ID: {item.product_id}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{item.fish_type}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{formatNumber(item.current_stock)} {item.unit}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{formatNumber(item.minimum_stock)} {item.unit}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusText(item.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-900">{percentage.toFixed(1)}%</span>
                        <span className="text-xs text-slate-500">
                          {formatNumber(item.current_stock)}/{formatNumber(item.minimum_stock)}
                        </span>
                      </div>
                      <div className="relative h-2 w-full rounded-full bg-slate-200">
                        <div 
                          className="absolute left-0 top-0 h-2 rounded-full"
                          style={{ 
                            width: `${Math.min(percentage, 100)}%`,
                            backgroundColor: barColor
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-slate-600">
                      {new Date(item.last_updated).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">Tidak ada data</h3>
          <p className="mt-2 text-sm text-slate-600">Belum ada data inventaris yang tersedia.</p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="size-2 rounded-full bg-emerald-500"></div>
              <span className="text-xs text-slate-600">Stok Cukup</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="size-2 rounded-full bg-amber-500"></div>
              <span className="text-xs text-slate-600">Stok Rendah</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="size-2 rounded-full bg-red-500"></div>
              <span className="text-xs text-slate-600">Habis</span>
            </div>
          </div>
          <button className="text-sm font-medium text-cyan-600 hover:text-cyan-700">
            Lihat semua →
          </button>
        </div>
      </div>
    </section>
  )
}