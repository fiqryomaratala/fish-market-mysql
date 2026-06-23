// Komponen Revenue Chart untuk Analytics Dashboard
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { RevenueTrendPoint } from '@/types/analytics'
import { formatDate, formatCompactCurrency } from '@/utils/format'

type RevenueChartProps = {
  data: RevenueTrendPoint[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600">
            Revenue Trend
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">Trend pendapatan</h3>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
          {formatCompactCurrency(data.reduce((total, item) => total + item.revenue, 0))} total
        </div>
      </div>

      <div className="mt-6 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => formatDate(value, { day: '2-digit', month: 'short' })}
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(value) => formatCompactCurrency(Number(value))}
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '16px',
                border: '1px solid #cbd5e1',
                boxShadow: '0 14px 34px rgba(15, 23, 42, 0.08)',
              }}
              labelFormatter={(value) => formatDate(value, { day: '2-digit', month: 'long', year: 'numeric' })}
              formatter={(value) => [formatCompactCurrency(Number(value)), 'Pendapatan']}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#0891b2"
              strokeWidth={3}
              dot={{ fill: '#0891b2', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#0891b2' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
