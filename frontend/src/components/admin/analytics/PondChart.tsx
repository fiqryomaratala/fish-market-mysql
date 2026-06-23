// Komponen Pond Chart untuk Analytics Dashboard
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
import type { PondProductivityData } from '@/types/analytics'
import { formatNumber } from '@/utils/format'

type PondChartProps = {
  data: PondProductivityData[]
}

export function PondChart({ data }: PondChartProps) {
  const sortedData = [...data].sort((a, b) => b.total_harvest_weight - a.total_harvest_weight)
  const top5Data = sortedData.slice(0, 5)

  const getBarColor = (index: number) => {
    const colors = ['#0891b2', '#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd']
    return colors[index % colors.length]
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600">
            Pond Productivity
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">Produktivitas kolam</h3>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
          {formatNumber(data.length)} kolam
        </div>
      </div>

      <div className="mt-6 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={top5Data}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={(value) => `${formatNumber(Number(value))} kg`}
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="pond_name"
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={100}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '16px',
                border: '1px solid #cbd5e1',
                boxShadow: '0 14px 34px rgba(15, 23, 42, 0.08)',
              }}
              formatter={(value, name) => {
                if (name === 'total_harvest_weight') return [`${formatNumber(Number(value))} kg`, 'Berat Panen']
                if (name === 'total_batches') return [formatNumber(Number(value)), 'Total Batch']
                if (name === 'completed_batches') return [formatNumber(Number(value)), 'Batch Selesai']
                return [`${formatNumber(Number(value))}%`, 'Survival Rate']
              }}
              labelFormatter={() => ''}
            />
            <Bar dataKey="total_harvest_weight" radius={[0, 10, 10, 0]}>
              {top5Data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {top5Data.map((item, index) => (
          <div
            key={item.pond_id}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-1.5 text-sm"
          >
            <div
              className="size-3 rounded-full"
              style={{ backgroundColor: getBarColor(index) }}
            ></div>
            <span className="font-medium text-slate-700">{item.pond_name}</span>
            <span className="text-slate-500">({formatNumber(item.total_harvest_weight)} kg)</span>
          </div>
        ))}
      </div>
    </section>
  )
}