// Komponen Harvest Chart untuk Analytics Dashboard
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { HarvestTrendPoint } from '@/types/analytics'
import { formatDate, formatNumber } from '@/utils/format'

type HarvestChartProps = {
  data: HarvestTrendPoint[]
}

export function HarvestChart({ data }: HarvestChartProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600">
            Harvest Trend
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">Trend panen</h3>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
          {formatNumber(data.reduce((total, item) => total + item.total_weight, 0))} kg total
        </div>
      </div>

      <div className="mt-6 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => formatDate(value, { day: '2-digit', month: 'short' })}
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(value) => `${formatNumber(Number(value))} kg`}
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={82}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '16px',
                border: '1px solid #cbd5e1',
                boxShadow: '0 14px 34px rgba(15, 23, 42, 0.08)',
              }}
              labelFormatter={(value) => formatDate(value, { day: '2-digit', month: 'long', year: 'numeric' })}
              formatter={(value, name) => {
                if (name === 'total_weight') return [`${formatNumber(Number(value))} kg`, 'Berat Total']
                if (name === 'total_harvest') return [formatNumber(Number(value)), 'Jumlah Panen']
                return [`${formatNumber(Number(value))}%`, 'Survival Rate']
              }}
            />
            <Bar dataKey="total_weight" fill="#0891b2" radius={[10, 10, 4, 4]} maxBarSize={34} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}