// Komponen Top Selling Chart untuk Analytics Dashboard
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { TopSellingFish } from '@/types/analytics'
import { formatNumber, formatCompactCurrency } from '@/utils/format'

type TopSellingChartProps = {
  data: TopSellingFish[]
}

export function TopSellingChart({ data }: TopSellingChartProps) {
  const sortedData = [...data].sort((a, b) => b.total_sold - a.total_sold).slice(0, 7)
  const maxSold = Math.max(...sortedData.map(item => item.total_sold), 1)

  const getBarColor = (value: number, max: number) => {
    const ratio = value / max
    if (ratio > 0.7) return '#0891b2'
    if (ratio > 0.4) return '#0ea5e9'
    return '#38bdf8'
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600">
            Top Selling Fish
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">Produk terlaris</h3>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
          {formatNumber(data.reduce((total, item) => total + item.total_sold, 0))} total terjual
        </div>
      </div>

      <div className="mt-6 h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={(value) => formatNumber(Number(value))}
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="fish_type"
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={120}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '16px',
                border: '1px solid #cbd5e1',
                boxShadow: '0 14px 34px rgba(15, 23, 42, 0.08)',
              }}
              formatter={(value, name) => {
                if (name === 'total_sold') return [formatNumber(Number(value)), 'Total Terjual']
                if (name === 'total_revenue') return [formatCompactCurrency(Number(value)), 'Total Revenue']
                return [`${formatNumber(Number(value))}%`, 'Persentase']
              }}
              labelFormatter={(value) => value}
            />
            <Bar dataKey="total_sold" radius={[0, 10, 10, 0]}>
              {sortedData.map((item, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getBarColor(item.total_sold, maxSold)} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {sortedData.map((item) => {
          const barColor = getBarColor(item.total_sold, maxSold)
          
          return (
            <div 
              key={item.fish_type} 
              className="rounded-xl border border-slate-200 bg-slate-50 p-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full" style={{ backgroundColor: barColor }}></div>
                  <span className="text-sm font-semibold text-slate-900">{item.fish_type}</span>
                </div>
                <span className="text-sm font-medium text-slate-700">{item.percentage.toFixed(1)}%</span>
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Terjual:</span>
                  <span className="font-medium text-slate-900">{formatNumber(item.total_sold)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Revenue:</span>
                  <span className="font-medium text-slate-900">{formatCompactCurrency(item.total_revenue)}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
