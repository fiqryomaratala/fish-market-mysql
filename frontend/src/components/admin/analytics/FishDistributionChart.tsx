// Komponen Fish Distribution Chart untuk Analytics Dashboard
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { FishTypeDistribution } from '@/types/analytics'
import { formatNumber } from '@/utils/format'

type FishDistributionChartProps = {
  data: FishTypeDistribution[]
}

const FISH_TYPE_COLORS = {
  'Nila': '#0891b2',
  'Lele': '#0ea5e9',
  'Patin': '#38bdf8',
  'Gurame': '#7dd3fc',
  'Bandeng': '#22d3ee',
  'Bawal': '#bae6fd',
  'Other': '#94a3b8',
}

export function FishDistributionChart({ data }: FishDistributionChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600">
            Fish Type Distribution
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">Distribusi jenis ikan</h3>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
          {formatNumber(total)} total
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${formatNumber(entry.value)}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={FISH_TYPE_COLORS[entry.name as keyof typeof FISH_TYPE_COLORS] || '#94a3b8'} 
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: '16px',
                  border: '1px solid #cbd5e1',
                  boxShadow: '0 14px 34px rgba(15, 23, 42, 0.08)',
                }}
                formatter={(value) => formatNumber(Number(value))}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-slate-900">Detail Persentase</h4>
          {data.map((item) => {
            const percentage = ((item.value / total) * 100).toFixed(1)
            const color = FISH_TYPE_COLORS[item.name as keyof typeof FISH_TYPE_COLORS] || '#94a3b8'
            
            return (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full" style={{ backgroundColor: color }}></div>
                    <span className="text-sm font-medium text-slate-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{percentage}%</span>
                </div>
                <div className="relative h-2 w-full rounded-full bg-slate-200">
                  <div 
                    className="absolute left-0 top-0 h-2 rounded-full"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: color
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{formatNumber(item.value)} ekor</span>
                  <span>{percentage}% dari total</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <p className="text-sm text-slate-600">
          <strong>Catatan:</strong> Distribusi berdasarkan jumlah ekor ikan per jenis. Data diambil dari batch aktif dan hasil panen.
        </p>
      </div>
    </section>
  )
}
