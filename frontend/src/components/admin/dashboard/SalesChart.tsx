import { useEffect, useRef, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { SalesChartPoint } from '@/types/dashboard'
import { formatCompactCurrency, formatDate, formatNumber } from '@/utils/format'

type SalesChartProps = {
  data: SalesChartPoint[]
}

export function SalesChart({ data }: SalesChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [chartSize, setChartSize] = useState({ width: 0, height: 280 })

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
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
            Ringkasan Penjualan
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Penjualan 30 Hari Terakhir</h2>
        </div>
        <div className="admin-dashboard-subpanel rounded-xl border border-cyan-100 bg-cyan-50/80 px-4 py-2 text-right">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-700">Total</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {formatCompactCurrency(data.reduce((total, item) => total + item.revenue, 0))}
          </p>
        </div>
      </div>

      <div ref={containerRef} className="mt-6 h-[280px] min-h-[280px] min-w-0 w-full">
        {chartSize.width > 0 && chartSize.height > 0 ? (
          <LineChart width={chartSize.width} height={chartSize.height} data={data}>
            <defs>
              <linearGradient id="salesStroke" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#0f766e" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" vertical={false} />
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
              width={88}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '16px',
                border: '1px solid #dbeafe',
                boxShadow: '0 16px 40px rgba(148, 163, 184, 0.16)',
              }}
              formatter={(value, name) =>
                name === 'revenue'
                  ? [formatCurrencyValue(Number(value ?? 0)), 'Pendapatan']
                  : [formatNumber(Number(value ?? 0)), 'Pesanan']
              }
              labelFormatter={(label) =>
                formatDate(label, {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              }
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="url(#salesStroke)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5, fill: '#2563eb', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </LineChart>
        ) : (
          <div className="h-full w-full animate-pulse rounded-xl bg-slate-100" />
        )}
      </div>
    </section>
  )
}

function formatCurrencyValue(value: number) {
  return formatCompactCurrency(value).includes('Rp')
    ? formatCompactCurrency(value)
    : formatNumber(value)
}
