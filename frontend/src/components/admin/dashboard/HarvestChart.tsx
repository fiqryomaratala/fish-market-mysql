import { useEffect, useRef, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { HarvestChartPoint } from '@/types/dashboard'
import { formatNumber } from '@/utils/format'

type HarvestChartProps = {
  data: HarvestChartPoint[]
}

export function HarvestChart({ data }: HarvestChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [chartSize, setChartSize] = useState({ width: 0, height: 260 })

  useEffect(() => {
    const element = containerRef.current

    if (!element) {
      return
    }

    const updateSize = () => {
      const width = element.clientWidth
      const height = element.clientHeight

      if (width > 0 && height > 0) {
        setChartSize({ width, height })
      }
    }

    updateSize()

    const observer = new ResizeObserver(updateSize)
    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section className="admin-dashboard-panel min-w-0 rounded-xl border border-white/60 bg-white/72 p-6 shadow-lg shadow-slate-200/45 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">
            Tren Panen
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Panen Per Bulan</h2>
        </div>
        <div className="admin-dashboard-subpanel rounded-xl border border-emerald-100 bg-emerald-50/80 px-4 py-2 text-right">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-700">
            Total
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {formatNumber(data.reduce((total, item) => total + item.total_weight, 0))} kg
          </p>
        </div>
      </div>

      <div ref={containerRef} className="mt-6 h-[260px] min-h-[260px] min-w-0 w-full">
        {chartSize.width > 0 && chartSize.height > 0 ? (
          <BarChart width={chartSize.width} height={chartSize.height} data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dcfce7" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(value) => `${formatNumber(Number(value))} kg`}
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={72}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '16px',
                border: '1px solid #bbf7d0',
                boxShadow: '0 16px 40px rgba(148, 163, 184, 0.16)',
              }}
              formatter={(value) => [`${formatNumber(Number(value ?? 0))} kg`, 'Panen']}
            />
            <Bar dataKey="total_weight" fill="#10b981" radius={[10, 10, 4, 4]} maxBarSize={28} />
          </BarChart>
        ) : (
          <div className="h-full w-full animate-pulse rounded-xl bg-slate-100" />
        )}
      </div>
    </section>
  )
}
