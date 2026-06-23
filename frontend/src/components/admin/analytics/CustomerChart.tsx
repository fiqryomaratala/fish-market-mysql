// Komponen Customer Chart untuk Analytics Dashboard
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { CustomerGrowthPoint } from '@/types/analytics'
import { formatDate, formatNumber } from '@/utils/format'

type CustomerChartProps = {
  data: CustomerGrowthPoint[]
}

export function CustomerChart({ data }: CustomerChartProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600">
            Customer Growth
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">Pertumbuhan pelanggan</h3>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
          +{formatNumber(data[data.length - 1]?.new_customers || 0)} pelanggan baru
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
              tickFormatter={(value) => formatNumber(Number(value))}
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '16px',
                border: '1px solid #cbd5e1',
                boxShadow: '0 14px 34px rgba(15, 23, 42, 0.08)',
              }}
              labelFormatter={(value) => formatDate(value, { day: '2-digit', month: 'long', year: 'numeric' })}
              formatter={(value, name) => {
                if (name === 'new_customers') return [formatNumber(Number(value)), 'Pelanggan Baru']
                if (name === 'total_customers') return [formatNumber(Number(value)), 'Total Pelanggan']
                return [formatNumber(Number(value)), 'Aktif']
              }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '12px',
              }}
              formatter={(value) => {
                if (value === 'new_customers') return 'Pelanggan Baru'
                if (value === 'total_customers') return 'Total Pelanggan'
                return 'Aktif'
              }}
            />
            <Line
              type="monotone"
              dataKey="new_customers"
              stroke="#0891b2"
              strokeWidth={3}
              dot={{ fill: '#0891b2', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#0891b2' }}
              strokeDasharray="3 3"
            />
            <Line
              type="monotone"
              dataKey="total_customers"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#10b981' }}
            />
            <Line
              type="monotone"
              dataKey="active_customers"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#f59e0b' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}